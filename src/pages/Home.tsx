import { Clock, CreditCard, MapPin, Package } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import { products } from '../data/products';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import type { Product } from '../types';
import { assetUrl } from '../utils/assetUrl';

const homepageSections = [
  { id: 'hero', label: 'Startbereich' },
  { id: 'favorites', label: 'Favoriten' },
  { id: 'service', label: 'Service' },
  { id: 'location', label: 'Standort' },
] as const;

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('hero');
  const addToCart = (product: Product) => dispatch(addItem({ ...product, quantity: 1 }));

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
  }, []);

  useEffect(() => {
    const requestedSection = new URLSearchParams(location.search).get('section');

    if (requestedSection && homepageSections.some(({ id }) => id === requestedSection)) {
      requestAnimationFrame(() => scrollToSection(requestedSection));
    }
  }, [location.search, scrollToSection]);

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      const pageMarker = window.scrollY + window.innerHeight * 0.45;
      const currentSection = homepageSections.reduce((current, section) => {
        const element = document.getElementById(section.id);
        return element && element.offsetTop <= pageMarker ? section.id : current;
      }, homepageSections[0].id as string);

      setActiveSection(currentSection);
      animationFrame = 0;
    };

    const handleScroll = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  const dotsOnDarkBackground = activeSection === 'hero' || activeSection === 'service';

  return (
    <>
      <section id="hero" className="editorial-hero" style={{ backgroundImage: `url(${assetUrl('assets/urfa-hero.jpg')})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="section-kicker light">Willkommen bei Urfa Grill</p>
          <h1>Feuer. Handwerk.<br />Echter Geschmack.</h1>
          <p>Türkische Grillklassiker, frisch zubereitet und in wenigen Schritten bestellt.</p>
          <div className="hero-actions">
            <Link className="red-button" to="/menu">Jetzt bestellen</Link>
            <Link className="outline-button light" to="/about">Unsere Geschichte</Link>
          </div>
        </div>
        <nav className={`section-dots ${dotsOnDarkBackground ? 'on-dark' : 'on-light'}`} aria-label="Startseitenabschnitte">
          {homepageSections.map(({ id, label }) => (
            <Link
              key={id}
              to={`/?section=${id}`}
              className={activeSection === id ? 'active' : ''}
              aria-label={`Zu ${label} scrollen`}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={() => scrollToSection(id)}
            />
          ))}
        </nav>
      </section>

      <section id="favorites" className="editorial-section favorites-section">
        <div className="section-title-row">
          <div>
            <p className="section-kicker">Speisekarte</p>
            <h2>Beliebt am Grill.</h2>
          </div>
          <Link className="arrow-link" to="/menu">Alle Gerichte ansehen <span>→</span></Link>
        </div>
        <ProductList products={products.filter((product) => product.featured)} onAddToCart={addToCart} />
      </section>

      <section id="service" className="service-showcase">
        <div className="service-copy left">
          <MapPin weight="thin" />
          <h3>MITTEN IN HILDESHEIM</h3>
          <p>Ein moderner Treffpunkt für ehrliche Grillküche und entspannte Abende.</p>
          <Package weight="thin" />
          <h3>ABHOLUNG</h3>
          <p>Bestelle digital und hole deine Auswahl frisch zubereitet ab.</p>
        </div>
        <div className="service-images">
          <img src={assetUrl('assets/urfa-about.jpg')} alt="Kebabspieße über offenem Holzkohlegrill" />
          <img src={assetUrl('assets/product-adana-wrap.jpg')} alt="Frisch zubereiteter Adana Wrap" />
        </div>
        <div className="service-copy right">
          <Clock weight="thin" />
          <h3>TÄGLICH FRISCH</h3>
          <p>Kurze Wege, klare Abläufe und Zubereitung direkt nach deiner Bestellung.</p>
          <CreditCard weight="thin" />
          <h3>TRANSPARENT</h3>
          <p>Alle Preise, Mengen und Bestellschritte jederzeit im Blick.</p>
        </div>
      </section>

      <section id="location" className="location-section">
        <div className="location-photo">
          <img src={assetUrl('assets/urfa-contact.jpg')} alt="Warmer Innenraum eines modernen türkischen Grillrestaurants" />
        </div>
        <div className="location-copy">
          <p className="section-kicker">Unser Konzeptstandort</p>
          <h2>Hildesheim</h2>
          <p>Türkische Gastfreundschaft, offener Grill und ein digitaler Bestellprozess, der sich einfach anfühlt.</p>
          <dl>
            <div><dt>Region</dt><dd>Hildesheim · Niedersachsen</dd></div>
            <div><dt>Konzept</dt><dd>Grill · Abholung · Digital</dd></div>
          </dl>
          <Link className="red-button" to="/contact">Kontakt aufnehmen</Link>
        </div>
      </section>
    </>
  );
};

export default Home;
