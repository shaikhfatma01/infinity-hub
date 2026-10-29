import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { deserializeProduct } from '../services/productService.js';
import { Product } from '../types/index.js';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

interface ShowcaseSpec {
  title: string;
  /** Illustrative everyday pack used as the baseline (not a catalogue listing). */
  standard: { name: string; packSize: string; price: number; quantity: number; unit: 'kg' | 'Litre'; store: string };
  /** Catalogue product used as the value pack; its real price drives the maths. */
  valueProductId: string;
  valuePackSize: string;
  valueQuantity: number;
  unit: 'kg' | 'Litre';
  fallbackValue: { name: string; price: number; store: string };
}

const SHOWCASES: ShowcaseSpec[] = [
  {
    title: 'Aged Basmati Rice Unit Comparison',
    standard: { name: 'Premium Basmati Rice (1 kg Pouch)', packSize: '1 kg', price: 110, quantity: 1, unit: 'kg', store: 'Zepto' },
    valueProductId: 'prod-rice-bigbasket',
    valuePackSize: '5 kg Value Sack',
    valueQuantity: 5,
    unit: 'kg',
    fallbackValue: { name: 'Daawat Rozana Gold Aged Basmati Rice (5 kg)', price: 425, store: 'BigBasket' },
  },
  {
    title: 'Refined Cooking Sunflower Oil Unit Comparison',
    standard: { name: 'Fortune Sunlite Sunflower Oil (500ml Bottle)', packSize: '500 ml', price: 80, quantity: 0.5, unit: 'Litre', store: 'Zepto' },
    valueProductId: 'prod-oil-blinkit',
    valuePackSize: '1 Litre Pouch',
    valueQuantity: 1,
    unit: 'Litre',
    fallbackValue: { name: 'Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)', price: 128, store: 'Blinkit' },
  },
];

export class GroceryController {
  public async getGroceryComparisons(req: Request, res: Response) {
    const rawProducts = await prisma.product.findMany({
      where: { category: 'Grocery' },
    });

    const products: Product[] = rawProducts.map(deserializeProduct);
    const byId = new Map<string, Product>(products.map((p): [string, Product] => [p.id, p]));

    // Unit rates are computed from pack price / pack quantity so they can never drift from the catalogue.
    const showcases = SHOWCASES.map(spec => {
      const value = byId.get(spec.valueProductId);
      const valuePrice = value ? value.finalEstimatedPrice : spec.fallbackValue.price;
      const standardRate = spec.standard.price / spec.standard.quantity;
      const valueRate = valuePrice / spec.valueQuantity;
      const savedPerUnit = standardRate - valueRate;
      const savedPercent = standardRate > 0 ? Math.round((savedPerUnit / standardRate) * 100) : 0;

      return {
        title: spec.title,
        standardPack: {
          name: spec.standard.name,
          packSize: spec.standard.packSize,
          price: spec.standard.price,
          unitRate: `${inr(standardRate)} / ${spec.unit}`,
          store: spec.standard.store,
        },
        valuePack: {
          name: value ? value.name : spec.fallbackValue.name,
          packSize: spec.valuePackSize,
          price: valuePrice,
          unitRate: `${inr(valueRate)} / ${spec.unit}`,
          savingsPerUnit:
            savedPerUnit > 0 ? `Save ${inr(savedPerUnit)} / ${spec.unit} (${savedPercent}% savings)` : 'No per-unit saving',
          store: value ? value.store : spec.fallbackValue.store,
          isBestValue: savedPerUnit > 0,
        },
      };
    });

    res.json({
      success: true,
      data: {
        products,
        showcases,
        supportedUnitMetrics: ['₹ / kg', '₹ / 100g', '₹ / Litre', '₹ / unit count'],
        isDemoComparison: true,
        notice:
          'Demo comparison: the value pack comes from the catalogue; the standard-pack baseline is an illustrative everyday price, not a live retailer feed.',
      },
    });
  }
}

export const groceryController = new GroceryController();
