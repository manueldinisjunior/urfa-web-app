import BrandVideos from '../components/BrandVideos';
import { Clock, CreditCard, MapPin, Package } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import ProductModal from '../components/product/ProductModal';
import { useCatalog } from '../hooks/useCatalog';
import { Notice } from '../components/OperationsUI';
import { useResource } from '../hooks/useResource';
import type { Settings } from '../features/operations';
import { DEMO_MODE } from '../utils/api';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import type { Product } from '../types';
import { assetUrl } from '../utils/assetUrl';
import { createCartItem } from '../utils/cartItem';

const favoritesHeadings = { de: 'Beliebt im Restaurant.', en: 'Popular at the restaurant.', tr: 'Restoranda sevilenler.', pt: 'Populares no restaurante.' };
function currentHeadingLanguage(): keyof typeof favoritesHeadings {
  try {
    const code = localStorage.getItem('urfa-language');
    return code && Object.prototype.hasOwnProperty.call(favoritesHeadings, code) ? code as keyof typeof favoritesHeadings : 'de';
  } catch { return 'de'; }
}

const homepageSections = [
  { id: 'hero', label: 'Startbereich' },
  { id: 'favorites', label: 'Favoriten' },
  { id: 'service', label: 'Service' },
  { id: 'moments', label: 'Urfa auf TikTok' },
  { id: 'location', label: 'Standort' },
] as const;

const Home = () => {
  const { products, loading, error } = useCatalog();
  const { data: operating } = useResource<Settings>(DEMO_MODE?null:'/settings',30000);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [headingLanguage, setHeadingLanguage] = useState(currentHeadingLanguage);
  useEffect(() => {
    const update = (event: Event) => {
      const code = (event as CustomEvent<string>).detail;
      if (Object.prototype.hasOwnProperty.call(favoritesHeadings, code)) setHeadingLanguage(code as keyof typeof favoritesHeadings);
    };
    window.addEventListener('urfa-language-change', update);
    return () => window.removeEventListener('urfa-language-change', update);
  }, []);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addToCart = (product: Product) => {
    if (product.variants?.length || product.configurationPending || product.optionGroups?.length || product.extras?.length) setSelectedProduct(product);
    else dispatch(addItem(createCartItem(product)));
  };

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
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

      const service = document.getElementById('service');
      const bounds = service?.getBoundingClientRect();
      if (service && bounds) {
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) service.classList.remove('is-visible');
        else if (bounds.top <= window.innerHeight * 0.55 && bounds.bottom >= window.innerHeight * 0.45) service.classList.add('is-visible');
      }
      setActiveSection(currentSection);
      animationFrame = 0;
    };

    const handleScroll = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.home-reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'service') {
          if (!entry.isIntersecting) entry.target.classList.remove('is-visible');
          return;
        }
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: [0, 0.01] });
    sections.forEach((section) => observer.observe(section));


    return () => {
      observer.disconnect();
    };
  }, []);

  const dotsOnDarkBackground = activeSection === 'hero' || activeSection === 'service';

  return (
    <>
      <section id="hero" className="editorial-hero home-reveal" style={{ backgroundImage: `url(${assetUrl('assets/urfa-hero.webp')})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="section-kicker light">Willkommen bei Urfa Grill</p>
          {operating && <span className={`status-badge status-${operating.isOpen?'confirmed':'delivered'}`}>{operating.isOpen?'Annahme geöffnet':'Annahme pausiert'}</span>}
          <h1>Feuer. Handwerk.<br /><span className="brand-heading-accent">Echter Geschmack.</span></h1>
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

      <section id="favorites" className="editorial-section favorites-section home-reveal">
        <div className="section-title-row">
          <div>
            <p className="section-kicker">Speisekarte</p>
            <h2 className="notranslate" translate="no" lang={headingLanguage}>{favoritesHeadings[headingLanguage]}</h2>
          </div>
          <Link className="arrow-link" to="/menu">Alle Gerichte ansehen <span>→</span></Link>
        </div>
        {loading && <Notice>Speisekarte wird geladen …</Notice>}{error && <Notice error>{error}</Notice>}
        <ProductList products={products.filter((product) => product.featured)} onAddToCart={addToCart} onViewProduct={setSelectedProduct} />
      </section>

      <BrandVideos />
      <section id="service" className="service-showcase home-reveal">
        <div className="service-copy left">
          <MapPin weight="thin" />
          <h3>MITTEN IN HILDESHEIM</h3>
          <p>Ein moderner Treffpunkt für ehrliche Grillküche und entspannte Abende.</p>
          <Package weight="thin" />
          <h3>ABHOLUNG</h3>
          <p>Bestelle digital und hole deine Auswahl frisch zubereitet ab.</p>
        </div>
        <div className="service-images">
          <img src={assetUrl('assets/urfa-about.webp')} alt="Kebabspieße über offenem Holzkohlegrill" loading="lazy" decoding="async" />
          <img src={assetUrl('assets/product-adana-wrap.webp')} alt="Frisch zubereiteter Adana Wrap" loading="lazy" decoding="async" />
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

      <section id="gallery" className="food-gallery editorial-section" aria-labelledby="food-gallery-title">
        <div className="section-title-row"><div><p className="section-kicker">Türkische Küche</p><h2 id="food-gallery-title">Frisch. Herzhaft. Authentisch.</h2></div><Link className="red-button" to="/menu">Speisekarte entdecken</Link></div>
        <div className="food-gallery-grid">
          <img src={assetUrl('assets/urfa-table.webp')} alt="Türkische Spezialitäten mit Fleisch, Salat und Dips" width="1400" height="613" loading="lazy" decoding="async" />
          <img src={assetUrl('assets/urfa-skewers.webp')} alt="Gegrillte Fleischspieße mit Gemüse und Saucen" width="679" height="889" loading="lazy" decoding="async" />
          <img src={assetUrl('assets/urfa-grill.webp')} alt="Grillfleisch mit Paprika und frischen Zwiebeln" width="1400" height="934" loading="lazy" decoding="async" />
          <img src={assetUrl('assets/urfa-kebab.webp')} alt="Kebab mit Reis, Tomaten und würziger Sauce" width="1400" height="933" loading="lazy" decoding="async" />
        </div>
      </section>

      <section id="location" className="location-section home-reveal">
        <div className="location-photo">
          <img src={assetUrl('assets/urfa-contact.webp')} alt="Warmer Innenraum eines modernen türkischen Grillrestaurants" loading="lazy" decoding="async" />
        </div>
        <div className="location-copy">
          <p className="section-kicker">Besuche uns</p>
          <h2>Hildesheim</h2>
          <p>Türkische Gastfreundschaft, offener Grill und ein digitaler Bestellprozess, der sich einfach anfühlt.</p>
          <dl>
            <div><dt>Adresse</dt><dd>Schuhstraße 39, 31134 Hildesheim</dd></div>
            <div><dt>Kontakt</dt><dd><a href="tel:04951219890410">04951 219890410</a></dd></div>
          </dl>
          <Link className="red-button" to="/reservar">Tisch reservieren</Link>
        </div>
      </section>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

export default Home;
