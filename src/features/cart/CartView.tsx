import { Check, Minus, Plus, Trash } from '@phosphor-icons/react';
import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch } from '../../store';
import type { RootState } from '../../types';
import { assetUrl } from '../../utils/assetUrl';
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
      <section className="message-page success-message" aria-live="polite">
        <span><Check weight="light" /></span>
        <p className="section-kicker">Bestätigt</p>
        <h1>Demo-Bestellung vorbereitet.</h1>
        <p>Es wurden keine Daten übertragen und keine Zahlung ausgelöst.</p>
        <Link className="red-button" to="/menu">Weiter zur Speisekarte</Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="message-page">
        <p className="section-kicker">Warenkorb</p>
        <h1>Noch nichts ausgewählt.</h1>
        <p>Entdecke unsere Gerichte und stelle deine Bestellung zusammen.</p>
        <Link className="red-button" to="/menu">Speisekarte öffnen</Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-list-panel">
        <div className="cart-title">
          <div><p className="section-kicker">Warenkorb</p><h1>Deine Auswahl</h1></div>
          <button type="button" onClick={() => dispatch(clearCart())}>Alles entfernen</button>
        </div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={assetUrl(item.imageUrl)} alt={item.name} />
              <div className="cart-item-copy">
                <h2>{item.name}</h2>
                <span>{formatPrice(item.price)} pro Stück</span>
                <button type="button" onClick={() => dispatch(removeItem(item.id))}><Trash /> Entfernen</button>
              </div>
              <div className="quantity-control" aria-label={`Menge für ${item.name}`}>
                <button type="button" aria-label="Menge verringern" onClick={() => dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }))}><Minus /></button>
                <span aria-live="polite">{item.quantity}</span>
                <button type="button" aria-label="Menge erhöhen" onClick={() => dispatch(setQuantity({ id: item.id, quantity: item.quantity + 1 }))}><Plus /></button>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>
      </div>

      <aside className="checkout-panel">
        <p className="section-kicker light">Bestellung</p>
        <h2>Zusammenfassung</h2>
        <div className="summary-row"><span>Zwischensumme</span><strong>{formatPrice(totalAmount)}</strong></div>
        <div className="summary-row"><span>Abholung</span><strong>Kostenlos</strong></div>
        <div className="summary-row total"><span>Gesamt</span><strong>{formatPrice(totalAmount)}</strong></div>
        <form onSubmit={submitOrder}>
          <label>Name<input name="name" autoComplete="name" minLength={2} required placeholder="Dein Name" /></label>
          <label>Bestellart<select name="orderType" defaultValue="pickup"><option value="pickup">Abholung</option><option value="delivery">Lieferung (Demo)</option></select></label>
          <button className="white-button" type="submit">Demo-Bestellung bestätigen</button>
          <small>Keine echte Bestellung oder Zahlung.</small>
        </form>
      </aside>
    </section>
  );
};

export default CartView;
