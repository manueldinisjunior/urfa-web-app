import { ShoppingBag } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../data/products';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import { assetUrl } from '../utils/assetUrl';
import { formatPrice } from '../utils/formatPrice';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const dispatch = useDispatch<AppDispatch>();

  if (!product) {
    return (
      <section className="message-page">
        <p className="section-kicker">404</p>
        <h1>Gericht nicht gefunden.</h1>
        <Link className="red-button" to="/menu">Zur Speisekarte</Link>
      </section>
    );
  }

  return (
    <section className="product-detail-page">
      <div className="product-detail-image">
        <img src={assetUrl(product.imageUrl)} alt={product.name} />
      </div>
      <div className="product-detail-copy">
        <p className="breadcrumb"><Link to="/menu">Speisekarte</Link> <span>›</span> {product.category}</p>
        <p className="section-kicker">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong>{formatPrice(product.price)}</strong>
        <button className="red-button" type="button" onClick={() => dispatch(addItem({ ...product, quantity: 1 }))}>
          In den Warenkorb <ShoppingBag />
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
