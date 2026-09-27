import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const action = useRef<(kind: 'toggle' | 'stop') => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = true;
    let disabled = false;
    let disposed = false;
    let due = Date.now() + 3300;
    let timer: number | undefined;
    const clear = () => window.clearTimeout(timer);
    const play = () => {
      element.muted = true;
      if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
      if (element.error) element.load();
      void element.play().catch(() => { if (!disposed) setPlaying(false); });
    };
    const schedule = () => {
      clear();
      if (disabled || motion.matches || connection?.saveData || !visible || document.hidden) return;
      timer = window.setTimeout(play, Math.max(0, due - Date.now()));
    };
    action.current = kind => {
      clear();
      if (kind === 'stop') {
        disabled = true;
        setStopped(true);
        element.pause();
        return;
      }
      disabled = false;
      setStopped(false);
      if (!element.paused) {
        element.pause();
        due = Date.now() + 5000;
        schedule();
      } else {
        due = Date.now();
        play();
      }
    };
    const update = () => {
      if (!visible || document.hidden || motion.matches) {
        clear();
        element.pause();
      } else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    schedule();
    return () => {
      disposed = true;
      clear();
      action.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', update);
      element.pause();
    };
  }, []);

  return <>
    <video ref={video} className={`hero-background-video${playing ? ' is-playing' : ''}`}
      muted loop playsInline preload="none" poster={assetUrl('assets/urfa-hero.webp')} aria-hidden="true"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => setPlaying(false)} />
    <button type="button" className="hero-video-toggle" onClick={() => action.current('toggle')}
      aria-label={playing ? 'Hintergrundvideo für 5 Sekunden pausieren' : 'Hintergrundvideo abspielen'}>
      <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
    </button>
    <button type="button" className="hero-video-toggle hero-video-stop" onClick={() => action.current('stop')}
      aria-label="Hintergrundvideo dauerhaft ausschalten" aria-pressed={stopped}>Video aus</button>
  </>;
}
