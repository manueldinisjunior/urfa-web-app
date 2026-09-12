import { Check, Minus, Plus, Trash } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { mutate, DEMO_MODE } from "../../utils/api";
import { Notice } from "../../components/OperationsUI";
import { berlinDate } from "../operations";
import type { AppDispatch } from "../../store";
import type { RootState } from "../../types";
import { assetUrl } from "../../utils/assetUrl";
import { formatPrice } from "../../utils/formatPrice";
import { clearCart, removeItem, setQuantity } from "./cartSlice";

const CartView = () => {
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const errorRef = useRef<HTMLDivElement>(null);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState("");
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  useEffect(() => setRequestKey(crypto.randomUUID()), [cartItems]);
  const minimumAge = Math.max(0, ...cartItems.map((item) => item.minAge || 0));
  const [orderPlaced, setOrderPlaced] = useState(false);
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const invalid = Array.from(form.elements).filter(
      (element): element is HTMLInputElement =>
        element instanceof HTMLInputElement && !element.validity.valid,
    );
    if (invalid.length) {
      setFieldErrors(
        invalid.map(
          (input) =>
            `${input.closest("label")?.textContent?.trim() || input.name}: ${input.validity.valueMissing ? "Dieses Feld ist erforderlich." : input.type === "date" || input.type === "time" ? "Bitte einen gültigen zukünftigen Termin wählen." : "Bitte eine gültige Angabe eingeben."}`,
        ),
      );
      invalid.forEach((input) => input.setAttribute("aria-invalid", "true"));
      requestAnimationFrame(() => {
        errorRef.current?.focus();
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
      return;
    }
    setFieldErrors([]);
    const fields = new FormData(event.currentTarget);
    const enteredDate = String(fields.get("date"));
    const enteredTime = String(fields.get("time"));
    const nowTime = new Date().toLocaleTimeString("de-DE", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
    });
    if (
      enteredDate < berlinDate() ||
      (enteredDate === berlinDate() && enteredTime <= nowTime)
    ) {
      setError("Bitte Datum und Uhrzeit in der Zukunft wählen.");
      return;
    }
    if (DEMO_MODE) {
      setOrderPlaced(true);
      dispatch(clearCart());
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await mutate<{ id: string; trackingToken: string }>(
        "/orders",
        "POST",
        {
          customer: {
            name: `${fields.get("firstName")} ${fields.get("lastName")}`,
            email: fields.get("email"),
            phone: fields.get("phone"),
          },
          expectedTotalCents: Math.round(totalAmount * 100),
          ageConfirmed: fields.has("ageConfirmed"),
          date: fields.get("date"),
          time: fields.get("time"),
          notes: fields.get("notes") || "",
          requestKey,
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            options: Object.fromEntries(
              (item.selectedOptions || []).map((o) => [o.groupId, o.optionId]),
            ),
            extras: (item.selectedExtras || []).map((e) => e.id),
          })),
        },
      );
      dispatch(clearCart());
      history.push(`/tracking/${response.id}?token=${response.trackingToken}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (orderPlaced) {
    return (
      <section className="message-page success-message" aria-live="polite">
        <span>
          <Check weight="light" />
        </span>
        <p className="section-kicker">Bestätigt</p>
        <h1>Demo-Bestellung vorbereitet.</h1>
        <p>Es wurden keine Daten übertragen und keine Zahlung ausgelöst.</p>
        <Link className="red-button" to="/menu">
          Weiter zur Speisekarte
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="message-page">
        <p className="section-kicker">Warenkorb</p>
        <h1>Noch nichts ausgewählt.</h1>
        <p>Entdecke unsere Gerichte und stelle deine Bestellung zusammen.</p>
        <Link className="red-button" to="/menu">
          Speisekarte öffnen
        </Link>
      </section>
    );
  }

  return (
    <form
      noValidate
      className="checkout-page"
      onSubmit={submitOrder}
      onChange={(event) => {
        setRequestKey(crypto.randomUUID());
        if (event.target instanceof HTMLInputElement)
          event.target.removeAttribute("aria-invalid");
      }}
    >
      {!!fieldErrors.length && (
        <div
          className="checkout-error-summary"
          role="alert"
          tabIndex={-1}
          ref={errorRef}
        >
          <strong>Bitte ergänze oder korrigiere folgende Angaben:</strong>
          <ul>
            {fieldErrors.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      <nav className="checkout-back breadcrumbs">
        <Link to="/cart">← Zurück zum Warenkorb</Link>
      </nav>
      <section
        className="checkout-details"
        aria-labelledby="checkout-details-title"
      >
        <div className="checkout-heading-row">
          <div>
            <p className="section-kicker">Abholung</p>
            <h1 id="checkout-details-title">Rechnungs- und Abholdaten</h1>
          </div>
          <button type="button" onClick={() => dispatch(clearCart())}>
            Warenkorb leeren
          </button>
        </div>

        <div className="checkout-field-grid">
          <label>
            Datum
            <input
              type="date"
              name="date"
              min={berlinDate(clock)}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </label>
          <label>
            Uhrzeit
            <input
              type="time"
              name="time"
              min={
                selectedDate === berlinDate(clock)
                  ? new Date(clock.getTime() + 60000).toLocaleTimeString(
                      "de-DE",
                      {
                        timeZone: "Europe/Berlin",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : undefined
              }
              required
            />
          </label>
          <label>
            Vorname
            <input
              name="firstName"
              autoComplete="given-name"
              minLength={2}
              required
              placeholder="Vorname"
            />
          </label>
          <label>
            Nachname
            <input
              name="lastName"
              autoComplete="family-name"
              minLength={2}
              required
              placeholder="Nachname"
            />
          </label>
        </div>

        <fieldset className="pickup-locations">
          <legend>Abholort</legend>
          <label>
            <input
              type="radio"
              name="location"
              value="Hildesheim-Mitte"
              required
            />{" "}
            Schuhstraße 39, Hildesheim
          </label>
        </fieldset>

        <div className="checkout-field-grid">
          <label>
            Telefon
            <input
              type="tel"
              pattern="\+?[0-9]{10,15}"
              title="10–15 Ziffern, optional mit +"
              name="phone"
              autoComplete="tel"
              required
              placeholder="Telefonnummer"
            />
          </label>
          <label>
            E-Mail
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="E-Mail"
            />
          </label>
        </div>

        <section
          className="additional-info"
          aria-labelledby="additional-info-title"
        >
          <h2 id="additional-info-title">Zusätzliche Informationen</h2>
          <label>
            Bestellhinweise <span>(optional)</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Hinweise zur Abholung oder Zubereitung"
            />
          </label>
        </section>
      </section>

      <aside className="order-summary" aria-labelledby="order-summary-title">
        <p className="section-kicker">Bestellung</p>
        <h2 id="order-summary-title">Deine Bestellung</h2>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <article className="checkout-item" key={item.lineId}>
              {item.imageUrl && <img src={assetUrl(item.imageUrl)} alt="" />}
              <div>
                <h3>{item.name}</h3>
                {item.selectedOptions?.map((option) => (
                  <p key={`${option.groupId}-${option.optionId}`}>
                    {option.groupName}: {option.optionName}
                  </p>
                ))}
                {!!item.selectedExtras?.length && (
                  <p>
                    Extras:{" "}
                    {item.selectedExtras.map((extra) => extra.name).join(", ")}
                  </p>
                )}
                <div className="checkout-item-controls">
                  <div
                    className="quantity-control"
                    aria-label={`Menge für ${item.name}`}
                  >
                    <button
                      type="button"
                      aria-label="Menge verringern"
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            lineId: item.lineId,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                    >
                      <Minus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Menge erhöhen"
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            lineId: item.lineId,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }
                    >
                      <Plus />
                    </button>
                  </div>
                  <button
                    className="checkout-remove"
                    type="button"
                    aria-label={`${item.name} entfernen`}
                    onClick={() => dispatch(removeItem(item.lineId))}
                  >
                    <Trash />
                  </button>
                </div>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </article>
          ))}
        </div>

        <div className="checkout-totals">
          <div>
            <span>Zwischensumme</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="checkout-total">
            <span>Gesamt</span>
            <strong>{formatPrice(totalAmount)}</strong>
          </div>
        </div>

        <div className="payment-note">
          <h3>Zahlung bei Abholung</h3>
          <p>
            {DEMO_MODE
              ? "Diese Website ist eine Bestelldemo und löst keine Zahlung aus."
              : "Die Bestellung wird an das Restaurant übermittelt. Bezahlt wird bei der Abholung. Der Endpreis wird anhand der aktuellen Speisekarte berechnet."}
          </p>
        </div>

        <label className="terms-check">
          <input type="checkbox" name="terms" required />
          <span>
            {DEMO_MODE
              ? "Ich verstehe, dass dies eine Demo ist und keine Bestellung gesendet wird."
              : "Ich habe meine Angaben geprüft und möchte diese Bestellung aufgeben."}
          </span>
        </label>
        {error && <Notice error>{error}</Notice>}
        {minimumAge > 0 && (
          <label className="terms-check">
            <input type="checkbox" name="ageConfirmed" required />
            <span>
              Ich bin mindestens {minimumAge} Jahre alt. Altersnachweis bei
              Abholung erforderlich.
            </span>
          </label>
        )}
        <button className="place-order-button" type="submit" disabled={busy}>
          {busy
            ? "Wird gesendet …"
            : DEMO_MODE
              ? "Demo-Bestellung abschließen"
              : "Zahlungspflichtig bestellen"}
        </button>
      </aside>
    </form>
  );
};

export default CartView;
