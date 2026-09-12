import { useState, type FormEvent } from 'react';
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  List,
  MagnifyingGlass,
  ShoppingBag,
  X,
} from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import type { RootState } from '../../types';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const history = useHistory();
  const itemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const cartLabel = `Warenkorb mit ${itemCount} ${itemCount === 1 ? 'Artikel' : 'Artikeln'}`;

  const closePanels = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = String(data.get('search') ?? '').trim();
    history.push(`/menu${query ? `?search=${encodeURIComponent(query)}` : ''}`);
    closePanels();
  };

  return (
    <header className="site-header">
      <div className="header-socials" aria-label="Social Media">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramLogo /></a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookLogo /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinLogo /></a>
      </div>

      <Link className="wordmark" to="/" onClick={closePanels} aria-label="Urfa Grill Startseite">
        <span>URFA</span><strong>GRILL</strong>
      </Link>

      <div className="header-tools">
        <button
          type="button"
          aria-label={searchOpen ? 'Suche schließen' : 'Speisekarte durchsuchen'}
          aria-expanded={searchOpen}
          onClick={() => { setSearchOpen((open) => !open); setMenuOpen(false); }}
        >
          {searchOpen ? <X /> : <MagnifyingGlass />}
        </button>
        <Link to="/cart" aria-label={cartLabel} onClick={closePanels}>
          <ShoppingBag />
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={menuOpen}
          onClick={() => { setMenuOpen((open) => !open); setSearchOpen(false); }}
        >
          {menuOpen ? <X /> : <List />}
        </button>
      </div>

      {searchOpen && (
        <form className="search-panel" onSubmit={submitSearch}>
          <label htmlFor="global-search">Wonach suchst du?</label>
          <input id="global-search" name="search" autoFocus placeholder="z. B. Grill, Falafel oder Wrap" />
          <button className="red-button" type="submit">Suchen</button>
        </form>
      )}

      {menuOpen && (
        <nav className="nav-drawer" aria-label="Hauptnavigation">
          <NavLink exact to="/" activeClassName="active" onClick={closePanels}>Startseite</NavLink>
          <NavLink to="/menu" activeClassName="active" onClick={closePanels}>Speisekarte</NavLink>
          <NavLink to="/about" activeClassName="active" onClick={closePanels}>Über uns</NavLink>
          <NavLink to="/contact" activeClassName="active" onClick={closePanels}>Kontakt</NavLink>
          <NavLink to="/careers" activeClassName="active" onClick={closePanels}>Karriere</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;
