import type { Product } from '../../types';
import { getProductById, products } from '../../data/products';

export const fetchProducts = async (): Promise<Product[]> => {
    return products;
};

export const fetchProductById = async (id: string): Promise<Product> => {
    const product = getProductById(id);
    if (!product) throw new Error('Produkt nicht gefunden');
    return product;
};
