import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

const cards = [
  { image: 'service-wrap-detail.png', alt: 'Frisch zubereiteter Dürüm auf Holz mit Kräutern' },
  { image: 'urfa-about.webp', alt: 'Kebabspieße über offenem Holzkohlegrill' },
];

export default function ServiceCards() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const dragged = useRef(false);
  const pointer = useRef<number | null>(null);
  const firstCycle = useRef(true);
  const next = () => setActive(value => (value + 1) % cards.length);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 });
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (root.current) observer.observe(root.current);
    return () => { motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', onVisibilityChange); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!visible) firstCycle.current = true;
    if (reduced || !visible || !pageVisible || dragging) return;
    const timer = window.setTimeout(() => {
      setActive(value => (value + 1) % cards.length);
    }, firstCycle.current ? 3000 : 4000);
    firstCycle.current = false;
    return () => window.clearTimeout(timer);
  }, [active, reduced, visible, pageVisible, dragging]);

  const endDrag = (clientX: number, cancelled = false) => {
    const distance = start.current === null ? 0 : clientX - start.current;
    if (!cancelled && Math.abs(distance) > 45) { dragged.current = true; next(); }
    start.current = null;
    pointer.current = null;
    setDragOffset(0);
    setDragging(false);
  };

  return <div ref={root} className="service-card-carousel" role="region" aria-label="Einblicke in unsere Küche">
    <img className="service-garnish" src={assetUrl('assets/service-garnish.webp')} alt="" aria-hidden="true" loading="lazy" />
    <div className="service-card-stage">
      {cards.map((card, index) => <button key={card.image} type="button"
        className={`service-photo-card ${active === index ? 'is-front' : 'is-back'}`}
        style={active === index ? { '--drag-offset': `${dragOffset}px` } as React.CSSProperties : undefined}
        data-dragging={active === index && dragging ? 'true' : undefined}
        aria-label={`${card.alt} – nächstes Bild anzeigen`}
        tabIndex={active === index ? 0 : -1}
        onPointerDown={event => {
          if (index !== active || event.button !== 0) return;
          start.current = event.clientX;
          pointer.current = event.pointerId;
          dragged.current = false;
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (pointer.current === event.pointerId && start.current !== null) {
            setDragOffset(Math.max(-110, Math.min(110, (event.clientX - start.current) * .55)));
          }
        }}
        onPointerUp={event => { if (pointer.current === event.pointerId) endDrag(event.clientX); }}
        onPointerCancel={event => { if (pointer.current === event.pointerId) endDrag(event.clientX, true); }}
        onClick={() => { if (!dragged.current) next(); dragged.current = false; }}>
        <img src={assetUrl(`assets/${card.image}`)} alt={card.alt} draggable={false} loading="lazy" decoding="async" />
      </button>)}
    </div>
    <div className="service-card-controls">
      <span aria-live="off">{active + 1} / {cards.length}</span>
    </div>
  </div>;
}
