import { Product } from '../types';
import { MOCK_PRODUCTS } from './mockProducts';

/**
 * Looks a demo product up by id. Never index MOCK_PRODUCTS by position: the catalogue order is
 * not part of any contract and positional lookups silently pointed at the wrong products.
 */
export function getMockProduct(id: string): Product {
  const found = MOCK_PRODUCTS.find(p => p.id === id);
  if (!found) {
    throw new Error(`Demo product "${id}" is missing from MOCK_PRODUCTS.`);
  }
  return found;
}
