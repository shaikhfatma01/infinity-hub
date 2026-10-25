import { Request, Response } from 'express';
import { productService, ProductQueryFilters } from '../services/productService.js';
import { SortOption } from '../types/index.js';
import { toFiniteNumber, toInt } from '../utils/parse.js';

export class ProductController {
  public async getProducts(req: Request, res: Response) {
    const q = req.query;
    const filters: ProductQueryFilters = {
      search: typeof q.search === 'string' ? q.search : undefined,
      category: typeof q.category === 'string' ? q.category : undefined,
      store: typeof q.store === 'string' ? q.store : undefined,
      minPrice: toFiniteNumber(q.minPrice),
      maxPrice: toFiniteNumber(q.maxPrice),
      minRating: toFiniteNumber(q.minRating),
      minDiscount: toFiniteNumber(q.minDiscount),
      onlyInStock: q.onlyInStock === 'true',
      onlyTwins: q.onlyTwins === 'true',
      sortBy: typeof q.sortBy === 'string' ? (q.sortBy as SortOption) : undefined,
      page: toInt(q.page) ?? 1,
      limit: toInt(q.limit) ?? 50,
    };

    const result = await productService.getProducts(filters);
    // Keep the response shape aligned with the frontend catalogService contract.
    res.json({
      products: result.products,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
    });
  }

  public async getProductById(req: Request, res: Response) {
    const id = req.params.id as string;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID "${id}" was not found in our catalog.`,
      });
    }

    const twinsResult = await productService.getProductTwins(product.productGroupId);
    res.json({
      product,
      twins: twinsResult.products.filter((item) => item.id !== product.id),
    });
  }

  public async getProductTwins(req: Request, res: Response) {
    const id = req.params.id as string;
    const twins = await productService.getProductTwins(id);
    const product = twins.products.find((item) => item.id === id) || twins.products[0] || null;
    res.json({
      product,
      twins: twins.products.filter((item) => item.id !== product?.id),
      bestDeal: [...twins.products].sort((a, b) => a.finalEstimatedPrice - b.finalEstimatedPrice)[0] || null,
    });
  }

  public async getCategories(req: Request, res: Response) {
    const categories = await productService.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  }

  public async getStores(req: Request, res: Response) {
    const stores = await productService.getStores();
    res.json({
      success: true,
      data: stores,
    });
  }
}

export const productController = new ProductController();
