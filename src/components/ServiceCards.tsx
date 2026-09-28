import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

const cards = [
  { image: 'product-adana-wrap.webp', alt: 'Frisch zubereiteter Adana Dürüm' },
  { image: 'urfa-about.webp', alt: 'Kebabspieße über offenem Holzkohlegrill' },
];

export default function ServiceCards() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const dragged = useRef(false);
  const next = () => setActive(value => (value + 1) % cards.length);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => { motion.removeEventListener('change', sync); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || hovered || reduced || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(value => (value + 1) % cards.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [active, paused, hovered, reduced, visible]);

  return <div ref={root} className="service-card-carousel" role="region" aria-label="Einblicke in unsere Küche"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setHovered(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}>
    <img className="service-garnish" src={assetUrl('assets/service-garnish.webp')} alt="" aria-hidden="true" loading="lazy" />
    <div className="service-card-stage">
      {cards.map((card, index) => <button key={card.image} type="button"
        className={`service-photo-card ${active === index ? 'is-front' : 'is-back'}`}
        aria-label={`${card.alt} – nächstes Bild anzeigen`}
        tabIndex={active === index ? 0 : -1}
        onPointerDown={event => { start.current = event.clientX; dragged.current = false; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerUp={event => {
          if (start.current !== null && Math.abs(event.clientX - start.current) > 35) { dragged.current = true; next(); }
          start.current = null;
        }}
        onPointerCancel={() => { start.current = null; dragged.current = true; }}
        onClick={() => { if (!dragged.current) next(); dragged.current = false; }}>
        <img src={assetUrl(`assets/${card.image}`)} alt={card.alt} draggable={false} loading="lazy" decoding="async" />
      </button>)}
    </div>
    <div className="service-card-controls">
      <button type="button" onClick={next} aria-label="Vorheriges Bild"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
      <span aria-live={paused ? 'polite' : 'off'}>{active + 1} / {cards.length}</span>
      <button type="button" onClick={next} aria-label="Nächstes Bild"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
      {!reduced && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Automatischen Bildwechsel starten' : 'Automatischen Bildwechsel pausieren'}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M8 5v14M16 5v14" />}</svg>
      </button>}
    </div>
  </div>;
}
