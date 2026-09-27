import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const requested = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = true;
    let disposed = false;
    const sync = () => {
      if (!requested.current || !visible || document.hidden) { element.pause(); return; }
      element.muted = true;
      if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
      void element.play().catch(() => { if (!disposed) setPlaying(false); });
    };
    const timer = window.setTimeout(() => {
      requested.current = !motion.matches && !connection?.saveData;
      sync();
    }, 600);
    const onMotion = () => { requested.current = !motion.matches && !connection?.saveData; sync(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    element.addEventListener('canplay', sync);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pageshow', sync);
    motion.addEventListener('change', onMotion);
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      element.removeEventListener('canplay', sync);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pageshow', sync);
      motion.removeEventListener('change', onMotion);
      element.pause();
    };
  }, []);
  const toggle = () => {
    const element = video.current;
    if (!element) return;
    requested.current = !playing;
    if (playing) { element.pause(); return; }
    setFailed(false);
    element.muted = true;
    if (!element.getAttribute('src')) element.src = assetUrl('assets/hero-background.mp4');
    if (element.error) element.load();
    void element.play().catch(() => setPlaying(false));
  };
  return <>
    <video ref={video} className="hero-background-video" muted loop playsInline preload="none" aria-hidden="true"
      onPlaying={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setFailed(true); }} />
    <button className="hero-video-toggle" onClick={toggle} aria-label={playing ? 'Hintergrundvideo pausieren' : 'Hintergrundvideo abspielen'} title={failed ? 'Video erneut laden' : undefined}>{playing ? 'Ⅱ' : '▶'}</button>
  </>;
}
