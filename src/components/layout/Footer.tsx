import { FacebookLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';
import { assetUrl } from '../../utils/assetUrl';

const Footer = () => (
  <footer id="footer" className="site-footer" style={{ backgroundImage: `linear-gradient(rgba(9, 16, 11, .86), rgba(9, 16, 11, .9)), url(${assetUrl('assets/urfa-hero.webp')})` }}>
    <div className="footer-main">
      <div className="footer-identity">
        <NavLink exact to="/" activeClassName="is-current" className="footer-wordmark" aria-label="Urfa Grill – Startseite"><img src={assetUrl('assets/urfa-footer-logo.png')} alt="Urfa Grill" width="210" height="90" loading="lazy" /></NavLink>
        <p>Türkische Küche in Hildesheim.</p>
        <div className="footer-socials" aria-label="Social Media">
          <a href="https://www.instagram.com/urfa_grill_hildesheim_/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo /></a>
          <a href="https://www.facebook.com/profile.php?id=61579836777680" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookLogo /></a>
          <a href="https://www.tiktok.com/@mehmettemel__" target="_blank" rel="noreferrer" aria-label="TikTok"><TiktokLogo /></a>
        </div>
      </div>
      <nav aria-label="Fußnavigation">
        <div className="footer-link-group"><strong>Entdecken</strong><NavLink to="/menu" activeClassName="is-current">Speisekarte</NavLink><NavLink to="/about" activeClassName="is-current">Über uns</NavLink><NavLink to="/careers" activeClassName="is-current">Karriere</NavLink></div>
        <div className="footer-link-group"><strong>Service</strong><NavLink to="/contact" activeClassName="is-current">Kontakt</NavLink><NavLink to="/faq" activeClassName="is-current">FAQ</NavLink><NavLink to="/account" activeClassName="is-current">Mein Konto</NavLink></div>
      </nav>
      <div className="footer-contact"><strong>Besuche uns</strong><p>Schuhstraße 39<br />31134 Hildesheim</p><a href="https://www.google.com/maps/search/?api=1&query=Schuhstra%C3%9Fe+39+31134+Hildesheim" target="_blank" rel="noreferrer">Route ansehen</a></div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Urfa Grill · Entwickelt von <a href="https://manueldinisjunior.de/" target="_blank" rel="noreferrer">Manuel Dinis Júnior</a></p><div><NavLink to="/impressum" activeClassName="is-current">Impressum</NavLink><NavLink to="/datenschutz" activeClassName="is-current">Datenschutz</NavLink></div></div>
  </footer>
);

export default Footer;
