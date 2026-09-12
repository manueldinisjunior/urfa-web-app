import { FacebookLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <p>© {new Date().getFullYear()} Urfa Grill. Portfolio-Demo.</p>
    <nav aria-label="Fußnavigation">
      <Link to="/menu">Speisekarte</Link>
      <Link to="/about">Über uns</Link>
      <Link to="/contact">Kontakt</Link>
      <Link to="/careers">Karriere</Link>
    </nav>
    <div className="footer-socials" aria-label="Social Media">
      <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo /></a>
      <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookLogo /></a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogo /></a>
    </div>
  </footer>
);

export default Footer;
