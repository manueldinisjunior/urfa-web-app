import { Plus } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { assetUrl } from '../../utils/assetUrl';
import { formatPrice } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => (
  <article className="product-card">
    <Link className="product-image-wrap" to={`/product/${product.id}`} aria-label={`${product.name} ansehen`}>
      <img src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />
    </Link>
    <div className="product-body">
      <span className="product-category">{product.category}</span>
      <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
      <p>{product.description}</p>
      <div className="product-bottom">
        <strong>{formatPrice(product.price)}</strong>
        <button type="button" onClick={() => onAddToCart(product)} aria-label={`${product.name} in den Warenkorb`}>
          <Plus weight="light" />
        </button>
      </div>
    </div>
  </article>
);

export default ProductCard;
