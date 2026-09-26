import LanguageSelector from "../language/LanguageSelector";
import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  List,
  MagnifyingGlass,
  ShoppingBag,
  X,
} from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";
import { assetUrl } from "../../utils/assetUrl";
// Navigation shortcuts; sales rankings require actual order analytics.
const categories = ["Dönergerichte", "Gegrilltes in der Teigrolle - Dürüm", "Grillgerichte - Izgaralar vom Holzkohlegrill", "Pizza"];
import type { RootState } from "../../types";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const history = useHistory();
  const drawerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("button,a")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab") {
        const nodes = Array.from(
          drawerRef.current?.querySelectorAll<HTMLElement>(
            "a,button,summary",
          ) || [],
        ).filter((e) => e.getClientRects().length);
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [menuOpen]);
  const itemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const cartLabel = `Warenkorb mit ${itemCount} ${itemCount === 1 ? "Artikel" : "Artikeln"}`;

  const closePanels = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = String(data.get("search") ?? "").trim();
    history.push(`/menu${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    closePanels();
  };

  return (
    <header className="site-header">
      <div className="header-socials" aria-label="Social Media">
        <a
          href="https://www.instagram.com/urfa_grill_hildesheim_/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <InstagramLogo />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61579836777680"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <FacebookLogo />
        </a>
        <a href="https://www.tiktok.com/@mehmettemel__" target="_blank" rel="noreferrer" aria-label="Urfa-Videos auf TikTok"><TiktokLogo /></a>
      </div>

      <Link
        className="wordmark"
        to="/"
        onClick={closePanels}
        aria-label="Urfa Grill Startseite"
      >
        <img
          src={assetUrl("assets/urfa-brand-light.png")}
          width="112"
          height="59"
          alt="Urfa Grill"
        />
      </Link>

      <div className="header-tools">
        <LanguageSelector />
        <button
          type="button"
          aria-label={
            searchOpen ? "Suche schließen" : "Speisekarte durchsuchen"
          }
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((open) => !open);
            setMenuOpen(false);
          }}
        >
          {searchOpen ? <X /> : <MagnifyingGlass />}
        </button>
        <Link to="/cart" aria-label={cartLabel} onClick={closePanels}>
          <ShoppingBag />
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          {menuOpen ? <X /> : <List />}
        </button>
      </div>

      {searchOpen && (
        <form className="search-panel" onSubmit={submitSearch}>
          <label htmlFor="global-search">Wonach suchst du?</label>
          <input
            id="global-search"
            name="search"
            autoFocus
            placeholder="z. B. Grill, Falafel oder Wrap"
          />
          <button className="red-button" type="submit">
            Suchen
          </button>
        </form>
      )}

      {menuOpen && (
        <>
          <button
            className="drawer-backdrop"
            aria-label="Menü schließen"
            tabIndex={-1}
            onClick={closePanels}
          />
          <nav
            ref={drawerRef}
            className="nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Hauptnavigation"
          >
            <button
              className="drawer-close"
              aria-label="Navigation schließen"
              onClick={closePanels}
            >
              <X />
            </button>
            <NavLink
              exact
              to="/"
              activeClassName="active"
              onClick={closePanels}
            >
              Startseite
            </NavLink>
            <details className="drawer-categories">
              <summary>Speisekarte</summary>
              <NavLink to="/menu" onClick={closePanels}>
                Alle Gerichte
              </NavLink>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/menu?category=${encodeURIComponent(category)}`}
                  onClick={closePanels}
                >
                  {category}
                </Link>
              ))}
            </details>
            <NavLink
              to="/reservar"
              activeClassName="active"
              onClick={closePanels}
            >
              Tisch reservieren
            </NavLink>
            <NavLink to="/faq" activeClassName="active" onClick={closePanels}>
              FAQ
            </NavLink>
            <NavLink to="/about" activeClassName="active" onClick={closePanels}>
              Über uns
            </NavLink>
            <NavLink
              to="/contact"
              activeClassName="active"
              onClick={closePanels}
            >
              Kontakt
            </NavLink>
            <NavLink
              to="/careers"
              activeClassName="active"
              onClick={closePanels}
            >
              Karriere
            </NavLink>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
