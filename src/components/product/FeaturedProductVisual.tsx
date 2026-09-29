import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Product } from '../../types';
import ProductPhoto from './ProductPhoto';
import '../../styles/featured-product-visual.css';

type Tilt = { x: number; y: number };
const center: Tilt = { x: 0, y: 0 };

export default function FeaturedProductVisual({ product }: { product: Product }) {
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [tilt, setTilt] = useState<Tilt>(center);

  const move = (clientX: number, clientY: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: Math.max(-7, Math.min(7, ((clientY - rect.top) / rect.height - .5) * -14)),
      y: Math.max(-7, Math.min(7, ((clientX - rect.left) / rect.width - .5) * 14)),
    });
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || dragging.current) move(event.clientX, event.clientY);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const direction = { ArrowLeft: [0, -4], ArrowRight: [0, 4], ArrowUp: [4, 0], ArrowDown: [-4, 0] }[event.key];
    if (!direction) return;
    event.preventDefault();
    setTilt(previous => ({ x: Math.max(-7, Math.min(7, previous.x + direction[0])), y: Math.max(-7, Math.min(7, previous.y + direction[1])) }));
  };

  return <div ref={frame} className="featured-product-visual" tabIndex={0}
    role="group" aria-label={`${product.name}: Foto räumlich bewegen, mit Maus, Finger oder Pfeiltasten`}
    style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` } as React.CSSProperties}
    onPointerMove={onPointerMove}
    onPointerDown={event => { if (event.pointerType !== 'mouse') { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); move(event.clientX, event.clientY); } }}
    onPointerUp={() => { dragging.current = false; }}
    onPointerCancel={() => { dragging.current = false; setTilt(center); }}
    onPointerLeave={() => { if (!dragging.current) setTilt(center); }}
    onBlur={() => setTilt(center)} onKeyDown={onKeyDown}>
    <ProductPhoto product={product} />
    <span className="featured-product-visual-hint" aria-hidden="true">Bild bewegen</span>
  </div>;
}
