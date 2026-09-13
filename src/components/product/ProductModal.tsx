import { X } from '@phosphor-icons/react';
import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import ProductPhoto, { hasProductPhoto } from './ProductPhoto';
import { formatPrice } from '../../utils/formatPrice';
import ProductConfigurator from './ProductConfigurator';
import { FavoriteButton } from '../../features/CustomerAccount';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const formId = `configure-${product?.id ?? 'product'}`;

  useEffect(() => {
    if (!product) return undefined;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], select, input, textarea') ?? []);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [product]);

  if (!product) return null;

  return (
    <div className="product-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={dialogRef} className={`product-modal ${hasProductPhoto(product)?'':'without-image'}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="product-modal-image">
          <ProductPhoto product={product} />
        </div>
        <div className="product-modal-content">
          <button ref={closeButtonRef} className="product-modal-close" type="button" aria-label="Produktfenster schließen" onClick={onClose}><X /></button>
          <p className="product-modal-category">{product.category}</p>
          <h2 id={titleId}>{product.name}</h2>
          <p className="product-modal-price">ab {formatPrice(product.price)}</p>
          <p className="product-modal-description">{product.description}</p>
          {product.productInfo && <p className="muted">{product.productInfo}</p>}
          {!!product.ingredients?.length && <div><h3>Zutaten</h3><p>{product.ingredients.join(', ')}</p></div>}
          {!!product.allergenCodes?.length && <p className="muted">Allergenkennzeichnung der Quelle: {product.allergenCodes.join(', ')}. Details bitte beim Restaurant erfragen.</p>}
          <ProductConfigurator product={product} formId={formId} showSubmitButton={false} onAdded={onClose} />
          <FavoriteButton id={product.id}/>
        </div>
        <footer className="product-modal-actions">
          <button type="submit" form={formId}>Hinzufügen</button>
          <Link to={`/product/${product.id}`} onClick={onClose}>Mehr Informationen</Link>
        </footer>
      </section>
    </div>
  );
};

export default ProductModal;
