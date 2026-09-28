import { FacebookLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../../utils/assetUrl';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-invite" style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 19, 14, .94), rgba(12, 19, 14, .72)), url(${assetUrl('assets/urfa-hero.webp')})` }}>
      <div><span className="footer-kicker">URFA GRILL · HILDESHEIM</span><h2>Guter Geschmack. Ganz einfach.</h2><p>Entdecke unsere Gerichte und erfahre mehr über Urfa Grill.</p></div>
      <div className="footer-actions"><Link to="/menu" className="footer-primary">Speisekarte ansehen</Link><Link to="/contact" className="footer-secondary">Kontakt</Link></div>
    </div>
    <div className="footer-main">
      <div className="footer-identity">
        <Link to="/" aria-label="Urfa Grill – Startseite"><img src={assetUrl('assets/urfa-logo.png')} alt="Urfa Grill" width="130" height="90" loading="lazy" /></Link>
        <p>Türkische Küche in Hildesheim.</p>
        <div className="footer-socials" aria-label="Social Media">
          <a href="https://www.instagram.com/urfa_grill_hildesheim_/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo /></a>
          <a href="https://www.facebook.com/profile.php?id=61579836777680" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookLogo /></a>
          <a href="https://www.tiktok.com/@mehmettemel__" target="_blank" rel="noreferrer" aria-label="TikTok"><TiktokLogo /></a>
        </div>
      </div>
      <nav aria-label="Fußnavigation">
        <div className="footer-link-group"><strong>Entdecken</strong><Link to="/menu">Speisekarte</Link><Link to="/about">Über uns</Link><Link to="/careers">Karriere</Link></div>
        <div className="footer-link-group"><strong>Service</strong><Link to="/contact">Kontakt</Link><Link to="/faq">FAQ</Link><Link to="/account">Mein Konto</Link></div>
      </nav>
      <div className="footer-contact"><strong>Besuche uns</strong><p>Schuhstraße 39<br />31134 Hildesheim</p><a href="https://www.google.com/maps/search/?api=1&query=Schuhstra%C3%9Fe+39+31134+Hildesheim" target="_blank" rel="noreferrer">Route ansehen</a></div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Urfa Grill · Entwickelt von <a href="https://manueldinisjunior.de/" target="_blank" rel="noreferrer">Manuel Dinis Júnior</a></p><div><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link></div></div>
  </footer>
);

export default Footer;
