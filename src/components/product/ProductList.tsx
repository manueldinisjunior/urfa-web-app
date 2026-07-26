import React from 'react';
import ProductCard from './ProductCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';

const ProductList: React.FC = () => {
    const products = useSelector((state: RootState) => state.products.items);

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;