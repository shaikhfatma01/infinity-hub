import { Request, Response } from 'express';
import { productService, ProductQueryFilters } from '../services/productService.js';
import { SortOption } from '../types/index.js';

export class ProductController {
  public async getProducts(req: Request, res: Response) {
    const filters: ProductQueryFilters = {
      search: req.query.search as string,
      category: req.query.category as string,
      store: req.query.store as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      minDiscount: req.query.minDiscount ? parseFloat(req.query.minDiscount as string) : undefined,
      onlyInStock: req.query.onlyInStock === 'true',
      onlyTwins: req.query.onlyTwins === 'true',
      sortBy: req.query.sortBy as SortOption,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
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
