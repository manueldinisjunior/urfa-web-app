import type { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import { formatPrice } from '../utils/formatPrice';

type AccentStyle = CSSProperties & { '--card-accent': string };

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const dispatch = useDispatch<AppDispatch>();

  if (!product) {
    return (
      <section className="empty-state large">
        <h1>Gericht nicht gefunden</h1>
        <p>Dieses Gericht ist nicht mehr in unserer Speisekarte.</p>
        <Link className="button button-primary" to="/menu">Zur Speisekarte</Link>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <div className="detail-visual" style={{ '--card-accent': product.accent } as AccentStyle}>
        <span aria-hidden="true">{product.emoji}</span>
      </div>
      <div className="detail-copy">
        <Link className="text-link" to="/menu">← Zurück zur Speisekarte</Link>
        <span className="category-label">{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong className="detail-price">{formatPrice(product.price)}</strong>
        <button
          className="button button-primary"
          type="button"
          onClick={() => dispatch(addItem({ ...product, quantity: 1 }))}
        >
          In den Warenkorb
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
