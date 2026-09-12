import { FacebookLogo, InstagramLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <p>© {new Date().getFullYear()} Urfa Grill. All Rights Reserved<br /> Developed By<a href="https://manueldinisjunior.de/" target="_blank" rel="noreferrer">Manuel Dinis Júnior</a></p>
    <nav aria-label="Fußnavigation">
      <Link to="/menu">Speisekarte</Link>
      <Link to="/about">Über uns</Link>
      <Link to="/contact">Kontakt</Link>
      <Link to="/careers">Karriere</Link>
    </nav>
    <div className="footer-socials" aria-label="Social Media">
      <a href="https://www.instagram.com/urfa_grill_hildesheim_/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo /></a>
      <a href="https://www.facebook.com/profile.php?id=61579836777680" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookLogo /></a>
    </div>
  </footer>
);

export default Footer;
