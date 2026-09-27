import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const enable = () => setEnabled(!motion.matches && !connection?.saveData);
    const timer = window.setTimeout(enable, 1200);
    motion.addEventListener('change', enable);
    return () => { clearTimeout(timer); motion.removeEventListener('change', enable); };
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element || !enabled) return;
    let visible = true;
    const sync = () => {
      if (paused || !visible || document.hidden) element.pause();
      else void element.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); element.pause(); };
  }, [enabled, paused]);
  if (!enabled) return null;
  return <>
    <video ref={video} className="hero-background-video" src={assetUrl('assets/hero-background.mp4')} muted loop playsInline preload="none" aria-hidden="true" />
    <button className="hero-video-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Hintergrundvideo abspielen' : 'Hintergrundvideo pausieren'}>{paused ? '▶' : 'Ⅱ'}</button>
  </>;
}
