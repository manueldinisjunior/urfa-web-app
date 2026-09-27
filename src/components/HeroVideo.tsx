import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

const INITIAL_DELAY_MS = 3300;
const RESTART_DELAY_MS = 5000;

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const restartTimer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = true;
    let disposed = false;

    const clearRestart = () => {
      if (restartTimer.current !== null) {
        window.clearTimeout(restartTimer.current);
        restartTimer.current = null;
      }
    };

    const canAutoPlay = () => !motion.matches && !connection?.saveData && visible && !document.hidden;

    const play = () => {
      if (!canAutoPlay()) return;
      element.muted = true;
      if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
      void element.play().catch(() => { if (!disposed) setPlaying(false); });
    };

    const initialTimer = window.setTimeout(play, INITIAL_DELAY_MS);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible || document.hidden) element.pause();
    });
    observer.observe(element);

    const onVisibility = () => {
      if (document.hidden) element.pause();
    };
    const onMotion = () => {
      clearRestart();
      if (motion.matches) element.pause();
    };

    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);

    return () => {
      disposed = true;
      window.clearTimeout(initialTimer);
      clearRestart();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
      element.pause();
    };
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;

    if (restartTimer.current !== null) {
      window.clearTimeout(restartTimer.current);
      restartTimer.current = null;
    }

    if (playing) {
      element.pause();
      const motion = matchMedia('(prefers-reduced-motion: reduce)');
      if (!motion.matches) {
        restartTimer.current = window.setTimeout(() => {
          if (document.hidden) return;
          element.muted = true;
          if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
          void element.play().catch(() => setPlaying(false));
        }, RESTART_DELAY_MS);
      }
      return;
    }

    setFailed(false);
    element.muted = true;
    if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
    if (element.error) element.load();
    void element.play().catch(() => setPlaying(false));
  };

  return <>
    <video
      ref={video}
      className={`hero-background-video${playing ? ' is-playing' : ''}`}
      muted
      loop
      playsInline
      preload="metadata"
      poster={assetUrl('assets/urfa-hero.webp')}
      aria-hidden="true"
      onPlaying={() => { setPlaying(true); setFailed(false); }}
      onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setFailed(true); }}
    />
    <button
      type="button"
      className="hero-video-toggle"
      onClick={toggle}
      aria-label={playing ? 'Hintergrundvideo pausieren' : 'Hintergrundvideo abspielen'}
      aria-pressed={playing}
      title={failed ? 'Video erneut laden' : undefined}
    >
      <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
    </button>
  </>;
}
