import { ArrowRight, Play } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assetUrl';

const About = () => (
  <div className="about-page">
    <section className="about-story">
      <div className="page-heading">
        <p className="section-kicker">Über uns</p>
        <h1>Aus Feuer wird<br />Gastfreundschaft.</h1>
      </div>
      <div className="about-image">
        <img src={assetUrl('assets/urfa-about.jpg')} alt="Koch bereitet türkische Grillspieße über Holzkohle zu" />
        <span className="play-mark" aria-hidden="true"><Play weight="fill" /></span>
      </div>
      <div className="about-copy">
        <p className="lead">Urfa Grill verbindet traditionelle türkische Grillkultur mit einem modernen, unkomplizierten Restaurant-Erlebnis.</p>
        <p>Im Mittelpunkt stehen offene Hitze, gute Zutaten und Handwerk. Unsere Gerichte werden direkt nach der Bestellung zubereitet – mit kräftigen Gewürzen, frischen Kräutern und der Ruhe, die gutes Essen braucht.</p>
        <p>Digitalisierung bedeutet für uns nicht weniger Persönlichkeit. Sie macht Bestellung und Orientierung einfacher, damit mehr Zeit für das Wesentliche bleibt: Geschmack und Begegnung.</p>
        <Link className="arrow-link" to="/menu">Unsere Speisekarte <ArrowRight /></Link>
      </div>
    </section>
    <section className="values-strip">
      <article><strong>01</strong><h2>Handwerk</h2><p>Frisch, sorgfältig und sichtbar zubereitet.</p></article>
      <article><strong>02</strong><h2>Gastfreundschaft</h2><p>Warm, direkt und ohne unnötige Distanz.</p></article>
      <article><strong>03</strong><h2>Einfachheit</h2><p>Klare Auswahl und ein schneller Bestellweg.</p></article>
    </section>
  </div>
);

export default About;
