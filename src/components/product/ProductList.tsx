import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductListProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    title={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => onAddToCart?.(product)}
                />
            ))}
        </div>
    );
};

export default ProductList;
