import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductList from '../components/product/ProductList';
import { useProductLoader } from '../hooks/useProductLoader';

const Home: React.FC = () => {
    const { products, loading, error } = useProductLoader();

    return (
        <div>
            <Header />
            <main>
                {loading && <p>Loading products...</p>}
                {error && <p>Error loading products: {error.message}</p>}
                {!loading && !error && <ProductList products={products} />}
            </main>
            <Footer />
        </div>
    );
};

export default Home;