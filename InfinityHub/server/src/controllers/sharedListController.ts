import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { deserializeProduct } from '../services/productService.js';
import { badRequest, notFound } from '../utils/httpError.js';
import { toInt } from '../utils/parse.js';

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
    const { name, addedBy, category, productId } = req.body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw badRequest('Item name is required.');
    }
    if (name.trim().length > 200) {
      throw badRequest('Item name is too long (max 200 characters).');
    }
    const quantity = req.body?.quantity === undefined ? 1 : toInt(req.body.quantity);
    if (quantity === undefined || quantity < 1 || quantity > 99) {
      throw badRequest('quantity must be a whole number between 1 and 99.');
    }

    let list = await prisma.sharedList.findFirst();
    if (!list) {
      list = await prisma.sharedList.create({
        data: { name: 'Family Grocery & Essentials', createdBy: (addedBy || 'Member').toString().trim() },
      });
    }

    // Use the product the client already matched, otherwise try to auto-match by name/tags.
    let matched = null as Awaited<ReturnType<typeof prisma.product.findUnique>>;
    if (productId && typeof productId === 'string') {
      matched = await prisma.product.findUnique({ where: { id: productId } });
    }
    if (!matched) {
      const rawProducts = await prisma.product.findMany();
      const lowerName = name.toLowerCase().trim();
      matched =
        rawProducts.find(p => p.name.toLowerCase().includes(lowerName) || p.tags.toLowerCase().includes(lowerName)) || null;
    }

    const newItem = await prisma.sharedListItem.create({
      data: {
        listId: list.id,
        name: name.trim(),
        addedBy: (addedBy || 'Member').toString().trim().slice(0, 100),
        category: (category || 'Grocery').toString().slice(0, 100),
        matchedProductId: matched?.id || null,
        quantity,
        isPurchased: false,
      },
    });

    res.status(201).json({
      success: true,
      message: `${newItem.name} added to shared list.`,
      data: {
        id: newItem.id,
        name: newItem.name,
        addedBy: newItem.addedBy,
        category: newItem.category,
        quantity: newItem.quantity,
        isPurchased: newItem.isPurchased,
        matchedProduct: matched ? deserializeProduct(matched) : undefined,
      },
    });
  }

  public async togglePurchased(req: Request, res: Response) {
    const id = req.params.id as string;
    const item = await prisma.sharedListItem.findUnique({ where: { id } });

    if (!item) {
      throw notFound('Item not found in shared list.');
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
