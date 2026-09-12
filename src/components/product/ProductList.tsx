import ProductCard from './ProductCard';
import type { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

const ProductList = ({ products, onAddToCart, onViewProduct }: ProductListProps) => {
  if (products.length === 0) {
    return <p className="empty-state">In dieser Kategorie sind noch keine Gerichte verfügbar.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
      ))}
    </div>
  );
};

export default ProductList;
