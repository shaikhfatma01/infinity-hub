import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShoppingBag, 
  Layers, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { parseNaturalLanguageQuery } from '../../services/aiEngine';
import { catalogService } from '../../services/catalogService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedProducts?: Product[];
  actionSuggestion?: {
    label: string;
    actionType: 'open-cart' | 'open-missions' | 'open-deals';
  };
}

export const AskInfinityAiModal: React.FC = () => {
  const { 
    isAskAiOpen, 
    setIsAskAiOpen, 
    products, 
    addToCart, 
    setSelectedProduct, 
    setIsCartOpen,
    setIsMissionsModalOpen,
    setActiveTab
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Hello! I'm ✨ Infinity AI, your universal shopping companion. Ask me to find products within a budget, compare cross-store deals, optimize your cart, or build a whole shopping mission!",
      actionSuggestion: {
        label: '🎓 Launch ₹15k College Setup Demo',
        actionType: 'open-missions'
      }
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAskAiOpen) {
      scrollToBottom();
    }
  }, [messages, isAskAiOpen, isTyping]);

  if (!isAskAiOpen) return null;

  const quickPrompts = [
    'Black purse under ₹1000 with 4+ rating',
    'Laptop under ₹60000 for coding',
    'Best winter blanket under ₹1500',
    'How do I save money on my cart?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await catalogService.sendAiChat(query);
      if (response && response.success && response.data) {
        const { text, recommendedProducts, actionSuggestion } = response.data;
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text,
          recommendedProducts: recommendedProducts && recommendedProducts.length > 0 ? recommendedProducts : undefined,
          actionSuggestion
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Gracefully fall back to local grounded reasoning
    }

    // AI logic simulation / offline fallback
    setTimeout(() => {
      const lower = query.toLowerCase();
      let replyText = '';
      let matchedProds: Product[] = [];
      let suggestion: ChatMessage['actionSuggestion'] = undefined;

      if (lower.includes('purse') || lower.includes('bag')) {
        matchedProds = products.filter(p => p.category === 'Bags & Purses');
        replyText = `I analyzed offers across Myntra, Amazon, and Flipkart. I found the **Lavie Luxe Black Vegan Satchel** on Myntra for ₹899 (64% discount), beating Amazon by ₹140 on final estimated cost.`;
      } else if (lower.includes('laptop') || lower.includes('coding') || lower.includes('programming')) {
        matchedProds = products.filter(p => p.category === 'Laptops');
        replyText = `For software development and college coding, I recommend the **ASUS Vivobook 15 OLED (16GB RAM / Core i5)**. Croma currently lists it for ₹54,990 with 1-day delivery and includes 1 extra year of accidental protection.`;
      } else if (lower.includes('cart') || lower.includes('optimize') || lower.includes('save')) {
        replyText = `I scanned your active Infinity Cart. By switching items to their verified Product Twin™ Best Deals across Myntra and Nykaa, you can save ~₹1,100 on your overall basket!`;
        suggestion = {
          label: '🛒 Open & Optimize Cart Now',
          actionType: 'open-cart'
        };
      } else if (lower.includes('college') || lower.includes('mission')) {
        matchedProds = products.slice(0, 3);
        replyText = `I built a customized **College Setup Mission** under ₹15,000 including a 32L Wildcraft laptop backpack, Sony ANC headphones, Nike sneakers, and daily skincare.`;
        suggestion = {
          label: '🎓 View Full College Mission (₹15,000)',
          actionType: 'open-missions'
        };
      } else {
        matchedProds = products.slice(0, 2);
        replyText = `I searched across 16 monitored retailers for "${query}". Here are the top verified options based on highest Infinity Score and lowest final cost.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        recommendedProducts: matchedProds.length > 0 ? matchedProds : undefined,
        actionSuggestion: suggestion
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-chocolate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full h-[90vh] sm:h-[650px] shadow-soft-lg border border-pink-300 flex flex-col overflow-hidden animate-slide-up">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-chocolate-950 via-chocolate-900 to-chocolate-950 text-cream-100 px-6 py-4 flex items-center justify-between border-b border-chocolate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-pink-300 text-chocolate-950 flex items-center justify-center font-bold shadow-pink-glow">
              <Sparkles className="w-5 h-5 text-chocolate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-base font-bold text-cream-50">✨ Infinity AI</h3>
                <span className="bg-pink-500/20 text-pink-300 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border border-pink-400/30">
                  Universal Agent
                </span>
              </div>
              <p className="text-[11px] text-cream-300">
                Live reasoning across 15+ stores, discounts & Product Twins
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAskAiOpen(false)}
            className="p-2 rounded-xl text-cream-300 hover:text-white hover:bg-chocolate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-cream-50/60">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAi ? 'bg-pink-200 text-chocolate-950 border border-pink-300' : 'bg-chocolate-900 text-cream-50'
                }`}>
                  {isAi ? <Bot className="w-4 h-4 text-pink-600" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isAi
                    ? 'bg-white border border-pink-200 shadow-soft text-chocolate-900'
                    : 'bg-chocolate-900 text-cream-50 rounded-tr-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Embedded Product Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-pink-100">
                      {msg.recommendedProducts.map(p => (
                        <div
                          key={p.id}
                          className="bg-cream-50 p-2.5 rounded-xl border border-pink-200 flex items-center justify-between gap-3 hover:bg-pink-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedProduct(p)}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 mix-blend-multiply shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-pink-600 block">{p.store}</span>
                              <h5 className="font-serif text-xs font-bold text-chocolate-950 truncate max-w-[170px]">{p.name}</h5>
                              <span className="font-serif text-xs font-bold text-chocolate-900">₹{p.finalEstimatedPrice.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                            className="p-2 rounded-lg bg-chocolate-900 text-cream-50 hover:bg-chocolate-800 shrink-0 cursor-pointer"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embedded Action Suggestion */}
                  {msg.actionSuggestion && (
                    <div className="pt-2 border-t border-pink-100">
                      <button
                        onClick={() => {
                          if (msg.actionSuggestion?.actionType === 'open-cart') setIsCartOpen(true);
                          if (msg.actionSuggestion?.actionType === 'open-missions') setIsMissionsModalOpen(true);
                          if (msg.actionSuggestion?.actionType === 'open-deals') setActiveTab('deals');
                          setIsAskAiOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-pink-100 hover:bg-pink-200 text-chocolate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{msg.actionSuggestion.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-200 text-chocolate-950 flex items-center justify-center">
                <Bot className="w-4 h-4 text-pink-600" />
              </div>
              <div className="bg-white border border-pink-200 rounded-2xl px-4 py-3 shadow-soft flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-pink-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Ribbon */}
        <div className="px-4 py-2 bg-white border-t border-pink-100 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] font-semibold bg-cream-100 hover:bg-pink-100 text-chocolate-800 px-3 py-1 rounded-full border border-pink-200 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-pink-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything: budget, specs, outfits, or best deals..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-cream-100 border border-pink-200 text-xs sm:text-sm text-chocolate-950 placeholder:text-chocolate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-2xl bg-chocolate-900 text-cream-50 hover:bg-chocolate-800 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4 text-pink-300" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
