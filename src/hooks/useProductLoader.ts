import { useEffect, useState } from 'react';
import { fetchProducts } from '../features/products/productApi';
import type { Product } from '../types';

const useProductLoader = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unable to load products'));
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return { products, loading, error };
};

export default useProductLoader;
