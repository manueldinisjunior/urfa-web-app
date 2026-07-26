import axios from 'axios';
import type { Product } from '../../types';

const API_URL = 'https://api.example.com/products';

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Unknown error';

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await axios.get<Product[]>(API_URL);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching products: ${getErrorMessage(error)}`);
    }
};

export const fetchProductById = async (id: string): Promise<Product> => {
    try {
        const response = await axios.get<Product>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching product: ${getErrorMessage(error)}`);
    }
};
