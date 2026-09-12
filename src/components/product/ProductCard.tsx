import { Eye, Plus } from '@phosphor-icons/react';
import type { Product } from '../../types';
import { assetUrl } from '../../utils/assetUrl';
import { formatPrice } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onViewProduct }: ProductCardProps) => (
  <article className={`product-card ${product.imageUrl?'':'product-card-text'}`}>
    {product.imageUrl && <button className="product-image-wrap" type="button" onClick={() => onViewProduct(product)} aria-label={`${product.name} ansehen`}>
      <img src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />
      <span className="product-image-cta"><Eye /> Ansehen</span>
    </button>}
    <div className="product-body">
      <div className="product-card-meta">
        <span className="product-category">{product.category}</span>
        <h3><button type="button" onClick={() => onViewProduct(product)}>{product.name}</button></h3>
        <p>{product.description}</p>
        {Boolean(product.depositCents)&&<small>inkl. {formatPrice((product.depositCents||0)/100)} Pfand</small>}
      </div>
      <div className="product-bottom product-card-price">
        <strong>{formatPrice(product.price)}</strong>
      </div>
      <div className="product-card-actions">
        <button type="button" onClick={() => onAddToCart(product)}><Plus /> {product.variants?.length || product.configurationPending || product.optionGroups?.length || product.extras?.length ? 'Auswählen' : 'Hinzufügen'}</button>
        <button type="button" onClick={() => onViewProduct(product)}><Eye /> Ansehen</button>
      </div>
    </div>
  </article>
);

export default ProductCard;
