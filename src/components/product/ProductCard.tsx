import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

type AccentStyle = CSSProperties & { '--card-accent': string };

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => (
  <article className="product-card">
    <Link
      className="product-visual"
      style={{ '--card-accent': product.accent } as AccentStyle}
      to={`/product/${product.id}`}
      aria-label={`${product.name} ansehen`}
    >
      <span aria-hidden="true">{product.emoji}</span>
    </Link>
    <div className="product-body">
      <div className="product-meta">
        <span className="category-label">{product.category}</span>
        <strong>{formatPrice(product.price)}</strong>
      </div>
      <div>
        <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <p>{product.description}</p>
      </div>
      <button className="button button-primary full" type="button" onClick={() => onAddToCart(product)}>
        In den Warenkorb
      </button>
    </div>
  </article>
);

export default ProductCard;
