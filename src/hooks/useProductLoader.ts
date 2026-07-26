import { useEffect, useState } from 'react';
import { fetchProducts } from '../features/products/productApi';

const useProductLoader = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return { products, loading, error };
};

export default useProductLoader;