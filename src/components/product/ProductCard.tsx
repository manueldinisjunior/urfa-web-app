import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

interface ProductCardProps {
    title: string;
    price: number;
    imageUrl: string;
    onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, imageUrl, onAddToCart }) => {
    return (
        <article className="product-card card">
            <img src={imageUrl} alt={title} className="product-image" />
            <div className="product-body">
                <h3 className="product-title">{title}</h3>
                <div className="product-price">{formatPrice(price)}</div>
                <div className="product-actions">
                    <button className="btn btn-primary" onClick={onAddToCart}>Add to Cart</button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;