import catalog from './catalog.json';
import type { Product } from '../types';
export const products: Product[] = catalog;
export const getProductById = (id: string) => products.find(product => product.id === id);
