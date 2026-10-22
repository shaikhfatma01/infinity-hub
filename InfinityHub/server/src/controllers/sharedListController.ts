import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { deserializeProduct } from '../services/productService.js';

export class SharedListController {
  public async getSharedLists(req: Request, res: Response) {
    let list = await prisma.sharedList.findFirst({
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!list) {
      list = await prisma.sharedList.create({
        data: {
          name: 'Family Grocery & Essentials',
          createdBy: 'Fatma Shaikh',
        },
        include: { items: true },
      });
    }

    // Match product details for each item
    const rawProducts = await prisma.product.findMany();
    const productMap = new Map(rawProducts.map(p => [p.id, deserializeProduct(p)]));

    const enrichedItems = list.items.map(item => ({
      id: item.id,
      name: item.name,
      addedBy: item.addedBy,
      category: item.category,
      quantity: item.quantity,
      isPurchased: item.isPurchased,
      matchedProduct: item.matchedProductId ? productMap.get(item.matchedProductId) : undefined,
    }));

    res.json({
      success: true,
      data: {
        id: list.id,
        name: list.name,
        createdBy: list.createdBy,
        items: enrichedItems,
      },
    });
  }

  public async addItem(req: Request, res: Response) {
    const { name, addedBy, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Item name is required.' });
    }

    let list = await prisma.sharedList.findFirst();
    if (!list) {
      list = await prisma.sharedList.create({
        data: { name: 'Family Grocery & Essentials', createdBy: addedBy || 'Fatma' },
      });
    }

    // Try to auto-match with a product in the catalog
    const rawProducts = await prisma.product.findMany();
    const lowerName = name.toLowerCase().trim();
    const matched = rawProducts.find(p =>
      p.name.toLowerCase().includes(lowerName) || p.tags.toLowerCase().includes(lowerName)
    );

    const newItem = await prisma.sharedListItem.create({
      data: {
        listId: list.id,
        name: name.trim(),
        addedBy: (addedBy || 'Member').trim(),
        category: category || 'Grocery',
        matchedProductId: matched?.id || null,
        quantity: 1,
        isPurchased: false,
      },
    });

    res.status(201).json({
      success: true,
      message: `${newItem.name} added to shared list.`,
      data: {
        ...newItem,
        matchedProduct: matched ? deserializeProduct(matched) : undefined,
      },
    });
  }

  public async togglePurchased(req: Request, res: Response) {
    const id = req.params.id as string;
    const item = await prisma.sharedListItem.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found in shared list.' });
    }

    const updated = await prisma.sharedListItem.update({
      where: { id },
      data: { isPurchased: !item.isPurchased },
    });

    res.json({
      success: true,
      message: `Item marked as ${updated.isPurchased ? 'purchased' : 'pending'}.`,
      data: updated,
    });
  }

  public async removeItem(req: Request, res: Response) {
    const id = req.params.id as string;
    await prisma.sharedListItem.deleteMany({ where: { id } });
    res.json({
      success: true,
      message: 'Item removed from shared list.',
    });
  }
}

export const sharedListController = new SharedListController();
