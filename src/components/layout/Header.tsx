import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import type { RootState } from '../../types';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="logo" to="/" onClick={closeMenu} aria-label="Urfa Grill Startseite">
          <span className="logo-mark" aria-hidden="true">U</span>
          <span>URFA <small>GRILL</small></span>
        </Link>
        <button
          className="mobile-menu"
          type="button"
          aria-label="Navigation öffnen"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
        <nav className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Hauptnavigation">
          <NavLink exact to="/" activeClassName="active" onClick={closeMenu}>Start</NavLink>
          <NavLink to="/menu" activeClassName="active" onClick={closeMenu}>Speisekarte</NavLink>
          <NavLink className="cart-link" to="/cart" activeClassName="active" onClick={closeMenu}>
            Warenkorb <span aria-label={`${itemCount} Artikel`}>{itemCount}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
