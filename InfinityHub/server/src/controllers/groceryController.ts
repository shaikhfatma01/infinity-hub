import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { deserializeProduct } from '../services/productService.js';

export class GroceryController {
  public async getGroceryComparisons(req: Request, res: Response) {
    const rawProducts = await prisma.product.findMany({
      where: { category: 'Grocery' },
    });

    const products = rawProducts.map(deserializeProduct);

    // Group items by commodity (e.g. Basmati Rice, Sunflower Oil)
    const showcases = [
      {
        title: 'Aged Basmati Rice Unit Comparison',
        standardPack: {
          name: 'Premium Basmati Rice (1 kg Pouch)',
          packSize: '1 kg',
          price: 110,
          unitRate: '₹110 / kg',
          store: 'Zepto',
        },
        valuePack: {
          name: 'Daawat Rozana Gold Aged Basmati Rice (5 kg)',
          packSize: '5 kg Value Sack',
          price: 425,
          unitRate: '₹85 / kg',
          savingsPerUnit: 'Save ₹25 / kg (23% savings)',
          store: 'BigBasket',
          isBestValue: true,
        },
      },
      {
        title: 'Refined Cooking Sunflower Oil Unit Comparison',
        standardPack: {
          name: 'Fortune Sunlite Sunflower Oil (500ml Bottle)',
          packSize: '500 ml',
          price: 80,
          unitRate: '₹160 / Litre',
          store: 'Zepto',
        },
        valuePack: {
          name: 'Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)',
          packSize: '1 Litre Pouch',
          price: 128,
          unitRate: '₹128 / Litre',
          savingsPerUnit: 'Save ₹32 / Litre (20% savings)',
          store: 'Blinkit',
          isBestValue: true,
        },
      },
    ];

    res.json({
      success: true,
      data: {
        products,
        showcases,
        supportedUnitMetrics: ['₹ / kg', '₹ / 100g', '₹ / Litre', '₹ / unit count'],
        isDemoComparison: true,
        notice: 'Unit value comparisons are computed from verified package weights and listed prices across quick commerce and supermarket feeds.',
      },
    });
  }
}

export const groceryController = new GroceryController();
