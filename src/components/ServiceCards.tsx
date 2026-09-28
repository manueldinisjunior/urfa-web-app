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
  const [dragCard, setDragCard] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const dragged = useRef(false);
  const pointer = useRef<number | null>(null);
  const firstCycle = useRef(true);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: [.25] });
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const section = root.current?.closest('section');
    if (section) observer.observe(section);
    return () => { motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', onVisibilityChange); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!visible) firstCycle.current = true;
    if (reduced || !visible || !pageVisible || dragging) return;
    let interval: number | undefined;
    const timer = window.setTimeout(() => {
      setActive(value => (value + 1) % cards.length);
      firstCycle.current = false;
      interval = window.setInterval(() => setActive(value => (value + 1) % cards.length), 4000);
    }, firstCycle.current ? 3000 : 4000);
    return () => { window.clearTimeout(timer); window.clearInterval(interval); };
  }, [reduced, visible, pageVisible, dragging]);

  const endDrag = (clientX: number, index: number, cancelled = false) => {
    const distance = start.current === null ? 0 : clientX - start.current;
    if (!cancelled && Math.abs(distance) > 45) {
      dragged.current = true;
      setActive(value => index === value ? (value + 1) % cards.length : index);
    }
    start.current = null;
    pointer.current = null;
    setDragOffset(0);
    setDragging(false);
    setDragCard(null);
  };

  return <div ref={root} className="service-card-carousel" role="region" aria-label="Einblicke in unsere Küche">
    <img className="service-garnish" src={assetUrl('assets/service-garnish.webp')} alt="" aria-hidden="true" loading="lazy" />
    <div className="service-card-stage">
      {cards.map((card, index) => <button key={card.image} type="button"
        className={`service-photo-card ${active === index ? 'is-front' : 'is-back'}`}
        style={dragCard === index ? { '--drag-offset': `${dragOffset}px` } as React.CSSProperties : undefined}
        data-dragging={dragCard === index && dragging ? 'true' : undefined}
        aria-label={`${card.alt} – nächstes Bild anzeigen`}
        tabIndex={active === index ? 0 : -1}
        onPointerDown={event => {
          if (event.button !== 0) return;
          start.current = event.clientX;
          pointer.current = event.pointerId;
          dragged.current = false;
          setDragging(true);
          setDragCard(index);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (pointer.current === event.pointerId && start.current !== null) {
            setDragOffset(Math.max(-110, Math.min(110, (event.clientX - start.current) * .55)));
          }
        }}
        onPointerUp={event => { if (pointer.current === event.pointerId) endDrag(event.clientX, index); }}
        onPointerCancel={event => { if (pointer.current === event.pointerId) endDrag(event.clientX, index, true); }}
        onClick={() => { if (!dragged.current) setActive(value => index === value ? (value + 1) % cards.length : index); dragged.current = false; }}>
        <img src={assetUrl(`assets/${card.image}`)} alt={card.alt} draggable={false} loading="lazy" decoding="async" />
      </button>)}
    </div>
    <div className="service-card-controls">
      <span aria-live="off">{active + 1} / {cards.length}</span>
    </div>
  </div>;
}
