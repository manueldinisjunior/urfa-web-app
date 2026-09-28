import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const action = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = true;
    let disposed = false;
    let due = Date.now() + 3000;
    let timer: number | undefined;
    const clear = () => window.clearTimeout(timer);
    const play = () => {
      element.muted = true;
      element.defaultMuted = true;
      element.playsInline = true;
      if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
      if (element.error) element.load();
      void element.play().catch(() => { if (!disposed) setPlaying(false); });
    };
    const schedule = () => {
      clear();
      if (connection?.saveData || !visible || document.hidden) return;
      timer = window.setTimeout(play, Math.max(0, due - Date.now()));
    };
    action.current = () => {
      clear();
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
      if (!visible || document.hidden) {
        clear();
        element.pause();
      } else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    const hero = element.closest('section');
    const onHeroClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a, button, input, select, textarea')) return;
      action.current();
    };
    hero?.addEventListener('click', onHeroClick);
    document.addEventListener('visibilitychange', update);
    schedule();
    return () => {
      disposed = true;
      clear();
      action.current = () => {};
      observer.disconnect();
      hero?.removeEventListener('click', onHeroClick);
      document.removeEventListener('visibilitychange', update);
      element.pause();
    };
  }, []);

  return <>
    <video ref={video} className={`hero-background-video${playing ? ' is-playing' : ''}`}
      muted loop playsInline preload="none" poster={assetUrl('assets/urfa-hero.webp')} aria-hidden="true"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => setPlaying(false)} />
    <button type="button" className="hero-video-keyboard-control" onClick={() => action.current()}
      aria-label={playing ? 'Hintergrundvideo für 5 Sekunden pausieren' : 'Hintergrundvideo abspielen'}>
      {playing ? 'Video pausieren' : 'Video abspielen'}
    </button>
  </>;
}
