import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import ProductScene from '../components/three/ProductScene';
import { formatPrice } from '../utils/formatPrice';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const product = useSelector((state: RootState) => 
        state.products.items.find(item => item.id === productId)
    );

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: {formatPrice(product.price)}</p>
            <ProductScene modelUrl={product.modelUrl} />
        </div>
    );
};

export default ProductPage;