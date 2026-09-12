import { Minus, Plus, X } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../types";
import { setQuantity, removeItem } from "./cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { assetUrl } from "../../utils/assetUrl";
export default function Basket() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <section className="basket-page">
      <nav className="breadcrumbs" aria-label="Brotkrümelnavigation">
        <Link to="/menu">Speisekarte</Link>
        <span>›</span>
        <span aria-current="page">Warenkorb</span>
      </nav>
      <h1>Dein Warenkorb</h1>
      {!items.length ? (
        <>
          <p>Dein Warenkorb ist noch leer.</p>
          <Link className="red-button" to="/menu">
            Speisekarte entdecken
          </Link>
        </>
      ) : (
        <>
          <div className="basket-table">
            <div className="basket-columns" aria-hidden="true">
              <span>Produkt</span>
              <span>Preis</span>
              <span>Menge</span>
              <span>Zwischensumme</span>
            </div>
            {items.map((item) => (
              <article className="basket-row" key={item.lineId}>
                <div className="basket-product">
                  <button
                    type="button"
                    aria-label={`${item.name} entfernen`}
                    onClick={() => dispatch(removeItem(item.lineId))}
                  >
                    <X />
                  </button>
                  {item.imageUrl && (
                    <img src={assetUrl(item.imageUrl)} alt="" />
                  )}
                  <div>
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                    {item.selectedOptions?.map((o) => (
                      <p key={o.groupId}>
                        {o.groupName}: {o.optionName}
                      </p>
                    ))}
                    {!!item.selectedExtras?.length && (
                      <p>
                        Extras:{" "}
                        {item.selectedExtras.map((e) => e.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <span aria-label="Einzelpreis">{formatPrice(item.price)}</span>
                <div className="quantity-control">
                  <button
                    type="button"
                    aria-label={`Menge für ${item.name} verringern`}
                    disabled={item.quantity <= 1}
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
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Menge für ${item.name} erhöhen`}
                    disabled={item.quantity >= 20}
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
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>
          <p className="muted" role="status">
            Mengen und Preise werden automatisch aktualisiert.
          </p>
          <div className="basket-summary">
            <h2>Warenkorbsumme</h2>
            <div>
              <span>Zwischensumme</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div>
              <strong>Gesamt</strong>
              <strong>{formatPrice(total)}</strong>
            </div>
            <Link className="red-button" to="/checkout">
              Weiter zur Kasse
            </Link>
            <Link to="/menu">Weiter einkaufen</Link>
          </div>
        </>
      )}
    </section>
  );
}
