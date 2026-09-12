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
    <form className="checkout-page" onSubmit={submitOrder}>
      <section className="checkout-details" aria-labelledby="checkout-details-title">
        <div className="checkout-heading-row">
          <div>
            <p className="section-kicker">Abholung</p>
            <h1 id="checkout-details-title">Rechnungs- und Abholdaten</h1>
          </div>
          <button type="button" onClick={() => dispatch(clearCart())}>Warenkorb leeren</button>
        </div>

        <div className="checkout-field-grid">
          <label>Datum<input type="date" name="date" required /></label>
          <label>Uhrzeit<input type="time" name="time" required /></label>
          <label>Vorname<input name="firstName" autoComplete="given-name" minLength={2} required placeholder="Vorname" /></label>
          <label>Nachname<input name="lastName" autoComplete="family-name" minLength={2} required placeholder="Nachname" /></label>
        </div>

        <fieldset className="pickup-locations">
          <legend>Abholort</legend>
          <label><input type="radio" name="location" value="Hildesheim-Mitte" required /> Schuhstraße 39, Hildesheim</label>
        </fieldset>

        <div className="checkout-field-grid">
          <label>Telefon<input type="tel" name="phone" autoComplete="tel" required placeholder="Telefonnummer" /></label>
          <label>E-Mail<input type="email" name="email" autoComplete="email" required placeholder="E-Mail" /></label>
        </div>

        <section className="additional-info" aria-labelledby="additional-info-title">
          <h2 id="additional-info-title">Zusätzliche Informationen</h2>
          <label>Bestellhinweise <span>(optional)</span>
            <textarea name="notes" rows={3} placeholder="Hinweise zur Abholung oder Zubereitung" />
          </label>
        </section>
      </section>

      <aside className="order-summary" aria-labelledby="order-summary-title">
        <p className="section-kicker">Bestellung</p>
        <h2 id="order-summary-title">Deine Bestellung</h2>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <article className="checkout-item" key={item.lineId}>
              <img src={assetUrl(item.imageUrl)} alt="" />
              <div>
                <h3>{item.name}</h3>
                {item.selectedOptions?.map((option) => <p key={`${option.groupId}-${option.optionId}`}>{option.groupName}: {option.optionName}</p>)}
                {!!item.selectedExtras?.length && <p>Extras: {item.selectedExtras.map((extra) => extra.name).join(', ')}</p>}
                <div className="checkout-item-controls">
                  <div className="quantity-control" aria-label={`Menge für ${item.name}`}>
                    <button type="button" aria-label="Menge verringern" onClick={() => dispatch(setQuantity({ lineId: item.lineId, quantity: item.quantity - 1 }))}><Minus /></button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label="Menge erhöhen" onClick={() => dispatch(setQuantity({ lineId: item.lineId, quantity: item.quantity + 1 }))}><Plus /></button>
                  </div>
                  <button className="checkout-remove" type="button" aria-label={`${item.name} entfernen`} onClick={() => dispatch(removeItem(item.lineId))}><Trash /></button>
                </div>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>

        <div className="checkout-totals">
          <div><span>Zwischensumme</span><span>{formatPrice(totalAmount)}</span></div>
          <div className="checkout-total"><span>Gesamt</span><strong>{formatPrice(totalAmount)}</strong></div>
        </div>

        <div className="payment-note">
          <h3>Zahlung bei Abholung</h3>
          <p>Bezahle vor Ort in bar, mit Karte oder kontaktlos. Diese Website ist eine Bestelldemo und löst keine Zahlung aus.</p>
        </div>

        <label className="terms-check">
          <input type="checkbox" name="terms" required />
          <span>Ich verstehe, dass dies eine Demo ist und keine Bestellung gesendet wird.</span>
        </label>
        <button className="place-order-button" type="submit">Demo-Bestellung abschließen</button>
      </aside>
    </form>
  );
};

export default CartView;
