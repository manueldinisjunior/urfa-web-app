import { Check, Minus, Plus } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import type { AppDispatch } from '../../store';
import type { Product } from '../../types';
import { createCartItem } from '../../utils/cartItem';
import { formatPrice } from '../../utils/formatPrice';

interface ProductConfiguratorProps {
  product: Product;
  formId: string;
  submitLabel?: string;
  showSubmitButton?: boolean;
  onAdded?: () => void;
}

const ProductConfigurator = ({
  product,
  formId,
  submitLabel = 'In den Warenkorb',
  showSubmitButton = true,
  onAdded,
}: ProductConfiguratorProps) => {
  const timerRef = useRef<number>();
  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  const configuredItem = useMemo(
    () => createCartItem(product, selectedOptions, selectedExtras, quantity),
    [product, quantity, selectedExtras, selectedOptions],
  );
  const optionTotal = configuredItem.price - product.price;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (added) return;
    const missingGroup = product.optionGroups?.find((group) => group.required && !selectedOptions[group.id]);
    if (missingGroup) {
      setError(`Bitte wähle zuerst „${missingGroup.name}“ aus.`);
      return;
    }

    dispatch(addItem(configuredItem));
    setError('');
    setAdded(true);
    timerRef.current = window.setTimeout(() => {
      setAdded(false);
      onAdded?.();
    }, 480);
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((current) => current.includes(id)
      ? current.filter((entry) => entry !== id)
      : [...current, id]);
  };

  return (
    <form id={formId} className="product-configurator" onSubmit={submit}>
      {(product.optionGroups ?? []).map((group) => (
        <label className="option-group" key={group.id}>
          <span>{group.name}{group.required ? ' *' : ''}</span>
          <select
            aria-label={group.name}
            value={selectedOptions[group.id] ?? ''}
            onChange={(event) => {
              setSelectedOptions((current) => ({ ...current, [group.id]: event.target.value }));
              setError('');
            }}
            required={group.required}
          >
            <option value="">Option auswählen</option>
            {group.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}{option.price ? ` (+${formatPrice(option.price)})` : ''}
              </option>
            ))}
          </select>
        </label>
      ))}

      {!!product.extras?.length && (
        <fieldset className="extras-group">
          <legend>Extras</legend>
          <p>Mach deine Bestellung komplett.</p>
          {product.extras.map((extra) => (
            <label key={extra.id}>
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra.id)}
                onChange={() => toggleExtra(extra.id)}
              />
              <span>{extra.name}</span>
              <strong>+{formatPrice(extra.price)}</strong>
            </label>
          ))}
        </fieldset>
      )}

      <div className="configuration-total" aria-live="polite">
        <div><span>Grundpreis</span><strong>{formatPrice(product.price)}</strong></div>
        <div><span>Optionen &amp; Extras</span><strong>{formatPrice(optionTotal)}</strong></div>
        <div className="configuration-total-final"><span>Gesamt</span><strong>{formatPrice(configuredItem.price * quantity)}</strong></div>
      </div>

      <div className="configurator-quantity-row">
        <span>Menge</span>
        <div className="quantity-control" aria-label={`Menge für ${product.name}`}>
          <button type="button" aria-label="Menge verringern" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus /></button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Menge erhöhen" onClick={() => setQuantity((current) => Math.min(20, current + 1))}><Plus /></button>
        </div>
      </div>

      {error && <p className="configuration-error" role="alert">{error}</p>}
      {added && <p className="configuration-added" role="status"><Check /> Hinzugefügt</p>}
      {showSubmitButton && <button className="red-button configurator-submit" type="submit">{submitLabel}</button>}
    </form>
  );
};

export default ProductConfigurator;
