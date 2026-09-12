import { useState } from 'react';
import { assetUrl } from '../utils/assetUrl';
const videos = ['7539572724239240466', '7608631872163237140'];
export default function BrandVideos() {
 const [active,setActive]=useState<string|null>(null);
 return <section id="moments" className="brand-moments editorial-section" aria-labelledby="moments-title">
  <div className="brand-moments-copy"><p className="section-kicker">Urfa auf TikTok</p><h2 id="moments-title">Mehr als Grill.<br/><span>Ein Stück Urfa.</span></h2><p>Entdecke die Videos von @mehmettemel__ und lerne Urfa aus einer anderen Perspektive kennen.</p><p className="video-privacy">Videos werden erst auf deinen Wunsch geladen. Dabei wird eine Verbindung zu TikTok hergestellt.</p><a className="arrow-link" href="https://www.tiktok.com/discover/urfa-grill-hildesheim-er%C3%B6ffnung" target="_blank" rel="noreferrer">Mehr auf TikTok entdecken ↗</a></div>
  <div className="brand-video-grid">{videos.map((id,i)=><article className="brand-video" key={id}><div className="brand-video-player">{active===id?<iframe src={`https://www.tiktok.com/player/v1/${id}?autoplay=0&rel=0`} title={`Urfa Grill auf TikTok – Video ${i+1}`} allow="fullscreen" allowFullScreen loading="lazy" referrerPolicy="no-referrer"/>:<div className="brand-video-cover"><img src={assetUrl('assets/urfa-brand-dark.png')} alt="Urfa Grill" width="533" height="374" loading="lazy"/><span className="video-number">URFA MOMENTE / 0{i+1}</span><button type="button" onClick={()=>setActive(id)} aria-label={`TikTok Video ${i+1} laden`}><span aria-hidden="true">▶</span> Video laden</button></div>}</div><div className="brand-video-links"><a href={`https://www.tiktok.com/@mehmettemel__/video/${id}`} target="_blank" rel="noreferrer">Auf TikTok ansehen ↗</a>{active===id&&<button onClick={()=>setActive(null)}>Video schließen</button>}</div></article>)}</div>
 </section>;
}
