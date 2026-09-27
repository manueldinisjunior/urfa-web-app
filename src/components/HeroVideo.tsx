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
    let due = Date.now() + 3300;
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
    document.addEventListener('visibilitychange', update);
    schedule();
    return () => {
      disposed = true;
      clear();
      action.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      element.pause();
    };
  }, []);

  return <>
    <video ref={video} className={`hero-background-video${playing ? ' is-playing' : ''}`}
      muted loop playsInline preload="none" poster={assetUrl('assets/urfa-hero.webp')} aria-hidden="true"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => setPlaying(false)} />
    <button type="button" className="hero-video-toggle" onClick={() => action.current()}
      aria-label={playing ? 'Hintergrundvideo für 5 Sekunden pausieren' : 'Hintergrundvideo abspielen'}>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" focusable="false">
        {playing ? <path d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path d="M8 5v14l11-7z" />}
      </svg>
    </button>
  </>;
}
