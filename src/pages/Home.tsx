import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import { products } from '../data/products';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import type { Product } from '../types';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addToCart = (product: Product) => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      emoji: product.emoji,
      accent: product.accent,
    }));
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Türkische Grillkultur · neu gedacht</p>
          <h1>Frisch vom Grill. Einfach bestellt.</h1>
          <p className="hero-text">
            Entdecke beliebte Urfa-Spezialitäten, stelle deinen Warenkorb zusammen
            und erlebe einen schnellen, klaren Bestellablauf.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/menu">Speisekarte öffnen</Link>
            <Link className="button button-secondary" to="/cart">Warenkorb ansehen</Link>
          </div>
          <div className="trust-row" aria-label="Unsere Vorteile">
            <span>✓ Frisch zubereitet</span>
            <span>✓ Vegetarische Auswahl</span>
            <span>✓ Mobil optimiert</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Urfa Grill Mix Illustration">
          <div className="hero-plate" aria-hidden="true">🔥</div>
          <div className="floating-note">
            <span>Heute beliebt</span>
            <strong>Urfa Grill Mix</strong>
            <small>ab 16,90 €</small>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="favorites-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">Unsere Favoriten</p>
            <h2 id="favorites-title">Direkt auf den Geschmack kommen.</h2>
          </div>
          <Link className="text-link" to="/menu">Alle Gerichte ansehen →</Link>
        </div>
        <ProductList products={products.filter((product) => product.featured)} onAddToCart={addToCart} />
      </section>

      <section className="promise-grid" aria-label="So funktioniert es">
        <article>
          <span>01</span>
          <h3>Gericht wählen</h3>
          <p>Finde Grillgerichte, Wraps und vegetarische Favoriten.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Warenkorb prüfen</h3>
          <p>Ändere Mengen und behalte den Gesamtpreis im Blick.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Bestellung vorbereiten</h3>
          <p>Schließe den Demo-Ablauf sicher und ohne echte Zahlung ab.</p>
        </article>
      </section>
    </>
  );
};

export default Home;
