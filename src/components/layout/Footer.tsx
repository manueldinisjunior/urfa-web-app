import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div>
        <Link className="logo footer-logo" to="/">
          <span className="logo-mark" aria-hidden="true">U</span>
          <span>URFA <small>GRILL</small></span>
        </Link>
        <p>Eine funktionale Restaurant-App-Demo mit React, TypeScript und Redux.</p>
      </div>
      <nav aria-label="Fußnavigation">
        <Link to="/">Start</Link>
        <Link to="/menu">Speisekarte</Link>
        <Link to="/cart">Warenkorb</Link>
      </nav>
      <p className="copyright">© {new Date().getFullYear()} Urfa Grill Demo</p>
    </div>
  </footer>
);

export default Footer;
