import { config } from '../config/index.js';
import { prisma } from '../config/db.js';
import { deserializeProduct, parseSearchQuery } from './productService.js';
import { Product } from '../types/index.js';

export interface AiShoppingResponse {
  text: string;
  recommendedProducts?: Product[];
  actionSuggestion?: {
    label: string;
    actionType: 'open-cart' | 'open-missions' | 'open-deals';
  };
  isLiveAi: boolean;
  provider: string;
}

export interface ChatTurn {
  role: 'user' | 'ai' | 'assistant' | 'model';
  text: string;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/** Cheapest offer across a product's Product Twin group, used to report real cross-store savings. */
function twinSavingsText(p: Product): string {
  if (!p.twinOffers || p.twinOffers.length < 2) return '';
  const highest = Math.max(...p.twinOffers.map(o => o.finalPrice));
  const saving = highest - p.finalEstimatedPrice;
  return saving > 0 ? ` Product Twin™ comparison shows this saves ${inr(saving)} versus the priciest listing.` : '';
}

function describe(p: Product): string {
  const discount = p.discountPercent > 0 ? ` (${p.discountPercent}% off)` : '';
  return `**${p.name}** on ${p.store} for ${inr(p.finalEstimatedPrice)}${discount}`;
}

export class AiService {
  public async handleShoppingQuery(query: string, conversationHistory?: ChatTurn[]): Promise<AiShoppingResponse> {
    const rawProducts = await prisma.product.findMany();
    const allProducts = rawProducts.map(deserializeProduct);

    // If a Google Gemini API Key is configured, use live LLM with product grounding
    if (config.geminiApiKey && config.geminiApiKey.trim()) {
      try {
        return await this.callGeminiWithGrounding(query, allProducts, conversationHistory);
      } catch (err: any) {
        console.warn('⚠️ Gemini API call failed or encountered rate limits, falling back to rule-based engine:', err?.message || err);
      }
    }

    // Honest, intelligent fallback using local shopping rule-based engine grounded in database
    return this.runLocalShoppingEngine(query, allProducts);
  }

  private async callGeminiWithGrounding(
    query: string,
    products: Product[],
    conversationHistory?: ChatTurn[]
  ): Promise<AiShoppingResponse> {
    const productCatalogSummary = products.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.finalEstimatedPrice,
      store: p.store,
      rating: p.rating,
      infinityScore: p.infinityScore,
      dealStatus: p.dealStatus,
      twins: p.twinOffers?.map(t => `${t.store}: ₹${t.finalPrice} (${t.deliveryText})`),
      specs: p.specs,
    }));

    const systemPrompt = `You are "Infinity AI", the intelligent shopping assistant for InfinityHub ("One Search. Every Store. Best Deal.").
You assist users in finding products, comparing cross-store deals, choosing between alternatives, verifying genuine discounts, and staying within their budget.
CRITICAL RULES:
1. ONLY reference products from the verified product catalog below. NEVER fabricate or invent products, prices, or store availability.
2. If the user asks for a product within a budget (e.g. under ₹1000 or under ₹60,000), filter and recommend the best value from the catalog.
3. Highlight cross-store Product Twin savings (e.g. "Save ₹400 on Myntra vs Amazon") whenever identical items exist across stores.
4. Keep answers concise, helpful, and formatted in clean Markdown with emojis.
5. In your response JSON, return:
{
  "text": "Your helpful response text in markdown",
  "matchedProductIds": ["prod-id-1", "prod-id-2"],
  "actionSuggestion": { "label": "Button text", "actionType": "open-cart" | "open-missions" | "open-deals" }
}

VERIFIED CATALOG:
${JSON.stringify(productCatalogSummary, null, 2)}`;

    // Prior turns (bounded) so follow-up questions keep their context.
    const history = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .filter(t => t && typeof t.text === 'string' && t.text.trim())
      .slice(-10)
      .map(t => ({
        role: t.role === 'user' ? 'user' : 'model',
        parts: [{ text: t.text.slice(0, 2000) }],
      }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiModel)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Header (not query string) so the key never ends up in URLs/logs.
          'x-goog-api-key': config.geminiApiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [...history, { role: 'user', parts: [{ text: query }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API HTTP ${response.status}: ${errBody.slice(0, 300)}`);
    }

    const data: any = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('');
    if (!candidateText) {
      throw new Error('No content returned from Gemini model.');
    }

    const parsedJson = JSON.parse(candidateText.replace(/^```json\s*|\s*```$/g, '').trim());
    if (typeof parsedJson.text !== 'string' || !parsedJson.text.trim()) {
      throw new Error('Gemini response did not include a text answer.');
    }
    const ids: string[] = Array.isArray(parsedJson.matchedProductIds) ? parsedJson.matchedProductIds : [];
    const matchedProducts = products.filter(p => ids.includes(p.id));

    return {
      text: parsedJson.text,
      recommendedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
      actionSuggestion: parsedJson.actionSuggestion,
      isLiveAi: true,
      provider: `Google Gemini (${config.geminiModel}) — Live`,
    };
  }

  /** Picks the matching products, applying any "under ₹X" / "4+ star" constraint from the query. */
  private pickProducts(products: Product[], predicate: (p: Product) => boolean, query: string): Product[] {
    const { maxBudget, minRating } = parseSearchQuery(query);
    return products
      .filter(predicate)
      .filter(p => (maxBudget === undefined ? true : p.currentPrice <= maxBudget))
      .filter(p => (minRating === undefined ? true : p.rating >= minRating))
      .sort((a, b) => b.infinityScore - a.infinityScore);
  }

  private async runLocalShoppingEngine(query: string, products: Product[]): Promise<AiShoppingResponse> {
    const lower = query.toLowerCase();
    const { maxBudget } = parseSearchQuery(query);

    let matched: Product[] = [];
    let replyText = '';
    let suggestion: AiShoppingResponse['actionSuggestion'] = undefined;

    const categoryReply = (label: string, predicate: (p: Product) => boolean) => {
      matched = this.pickProducts(products, predicate, query);
      if (matched.length > 0) {
        const best = matched[0];
        replyText = `For ${label}, my top verified pick is ${describe(best)}.${twinSavingsText(best)}`;
        if (matched.length > 1) {
          replyText += ` I also found ${matched.length - 1} more option${matched.length > 2 ? 's' : ''} below.`;
        }
      } else {
        const cheapest = products.filter(predicate).sort((a, b) => a.currentPrice - b.currentPrice)[0];
        replyText = maxBudget && cheapest
          ? `I couldn't find ${label} within ${inr(maxBudget)}. The lowest-priced verified option is ${describe(cheapest)}.`
          : `I couldn't find ${label} in the verified catalogue right now.`;
        matched = cheapest ? [cheapest] : [];
      }
    };

    if (lower.includes('purse') || lower.includes('bag') || lower.includes('satchel')) {
      categoryReply('a bag or purse', p => p.category === 'Bags & Purses');
    } else if (lower.includes('laptop') || lower.includes('coding') || lower.includes('programming') || lower.includes('16gb')) {
      categoryReply('a laptop', p => p.category === 'Laptops');
    } else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('running')) {
      categoryReply('running shoes', p => /shoe|sneaker/i.test(`${p.name} ${p.subCategory}`));
    } else if (lower.includes('skincare') || lower.includes('sunscreen') || lower.includes('face')) {
      categoryReply('skincare', p => p.category === 'Skincare & Beauty');
    } else if (lower.includes('blanket') || lower.includes('winter') || lower.includes('bed')) {
      categoryReply('bedding', p => p.category === 'Bedding & Blankets');
    } else if (lower.includes('cart') || lower.includes('optimize') || lower.includes('save money')) {
      replyText = `Our **Smart Cart Optimizer™** scans all items in your Infinity Cart against cross-store Product Twins. If an identical item is cheaper on another store, it suggests 1-click switches with verified Before vs After totals!`;
      suggestion = {
        label: '🛒 Open & Optimize Cart',
        actionType: 'open-cart',
      };
    } else if (lower.includes('college') || lower.includes('mission') || lower.includes('hostel')) {
      replyText = await this.describeCollegeMission(products);
      matched = [];
      suggestion = {
        label: '🎓 Launch College Setup Mission',
        actionType: 'open-missions',
      };
    } else if (lower.includes('deal') || lower.includes('discount')) {
      matched = this.pickProducts(products, p => p.dealStatus === 'REAL DEAL', query);
      replyText = `Our **Infinity Deal Analyzer™** flags genuine price reductions by evaluating historical prices. Here are ${matched.length} verified Real Deals right now.`;
      suggestion = {
        label: '🔥 Explore All Real Deals',
        actionType: 'open-deals',
      };
    } else {
      matched = this.pickProducts(products, () => true, query).slice(0, 3);
      replyText = matched.length > 0
        ? `I searched across the monitored retailers for "${query}". Here are the top verified options ranked by our composite Infinity Score (price, user rating, and seller trust).`
        : `I couldn't find verified products matching "${query}". Try a different keyword or a higher budget.`;
    }

    return {
      text: replyText,
      recommendedProducts: matched.length > 0 ? matched.slice(0, 4) : undefined,
      actionSuggestion: suggestion,
      isLiveAi: false,
      provider: 'Infinity Intelligent Shopping Engine (Local Grounded)',
    };
  }

  /** Builds the mission summary from the real mission + catalogue data instead of fixed text. */
  private async describeCollegeMission(products: Product[]): Promise<string> {
    const mission = await prisma.shoppingMission.findUnique({ where: { id: 'mission-college-setup' } });
    if (!mission) {
      return 'I can assemble a goal-based Shopping Mission for you — open the Missions hub to pick one.';
    }

    const byId = new Map(products.map(p => [p.id, p]));
    const items: any[] = JSON.parse(mission.itemsJson || '[]');
    const picked = items
      .map(it => byId.get(it.selectedProduct?.id) || it.selectedProduct)
      .filter(Boolean) as Product[];
    const total = picked.reduce((sum, p) => sum + p.finalEstimatedPrice, 0);
    const remaining = mission.targetBudget - total;
    const stores = new Set(picked.map(p => p.store)).size;

    const names = picked.map(p => p.name).join(', ');
    return remaining >= 0
      ? `I assembled the **${mission.title.replace(/^\S+\s/, '')} Mission** (budget ${inr(mission.targetBudget)}): ${names}. Total ${inr(total)} across ${stores} stores, leaving ${inr(remaining)} of your budget.`
      : `I assembled the **${mission.title.replace(/^\S+\s/, '')} Mission**: ${names}. Total ${inr(total)} across ${stores} stores — that is ${inr(-remaining)} over your ${inr(mission.targetBudget)} budget, so consider removing an optional item.`;
  }
}

export const aiService = new AiService();
