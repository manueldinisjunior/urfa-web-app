import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch } from '../../store';
import type { RootState } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { clearCart, removeItem, setQuantity } from './cartSlice';

const CartView = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  if (orderPlaced) {
    return (
      <section className="empty-state large success-state" aria-live="polite">
        <span className="success-icon" aria-hidden="true">✓</span>
        <h1>Demo-Bestellung bestätigt</h1>
        <p>Der Ablauf funktioniert. Es wurden keine Daten übertragen und keine Zahlung ausgelöst.</p>
        <Link className="button button-primary" to="/menu">Weiter stöbern</Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="empty-state large">
        <span className="empty-icon" aria-hidden="true">🛒</span>
        <h1>Dein Warenkorb ist leer.</h1>
        <p>Wähle ein Gericht aus unserer Speisekarte und füge es hier hinzu.</p>
        <Link className="button button-primary" to="/menu">Speisekarte öffnen</Link>
      </section>
    );
  }

  return (
    <section className="cart-layout" aria-labelledby="cart-title">
      <div className="cart-panel">
        <div className="cart-heading">
          <div>
            <p className="eyebrow dark">Warenkorb</p>
            <h1 id="cart-title">Deine Auswahl</h1>
          </div>
          <button className="text-button danger" type="button" onClick={() => dispatch(clearCart())}>
            Alles entfernen
          </button>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <span className="cart-item-emoji" style={{ backgroundColor: item.accent }} aria-hidden="true">
                {item.emoji}
              </span>
              <div className="cart-item-copy">
                <h2>{item.name}</h2>
                <span>{formatPrice(item.price)} pro Stück</span>
                <button className="text-button danger" type="button" onClick={() => dispatch(removeItem(item.id))}>
                  Entfernen
                </button>
              </div>
              <div className="quantity-control" aria-label={`Menge für ${item.name}`}>
                <button
                  type="button"
                  aria-label="Menge verringern"
                  onClick={() => dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                >−</button>
                <span aria-live="polite">{item.quantity}</span>
                <button
                  type="button"
                  aria-label="Menge erhöhen"
                  onClick={() => dispatch(setQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                >+</button>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>
      </div>

      <aside className="checkout-panel">
        <h2>Bestellung vorbereiten</h2>
        <div className="summary-row"><span>Zwischensumme</span><strong>{formatPrice(totalAmount)}</strong></div>
        <div className="summary-row"><span>Abholung</span><strong>Kostenlos</strong></div>
        <div className="summary-row total"><span>Gesamt</span><strong>{formatPrice(totalAmount)}</strong></div>
        <form onSubmit={submitOrder}>
          <label>
            Name
            <input name="name" autoComplete="name" minLength={2} required placeholder="Dein Name" />
          </label>
          <label>
            Bestellart
            <select name="orderType" defaultValue="pickup">
              <option value="pickup">Abholung</option>
              <option value="delivery">Lieferung (Demo)</option>
            </select>
          </label>
          <button className="button button-primary full" type="submit">Demo-Bestellung bestätigen</button>
          <small>Portfolio-Demo: Keine echte Bestellung oder Zahlung.</small>
        </form>
      </aside>
    </section>
  );
};

export default CartView;
