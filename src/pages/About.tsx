import { ArrowRight } from '@phosphor-icons/react';
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
        <img src={assetUrl('assets/urfa-about.webp')} alt="Koch bereitet türkische Grillspieße über Holzkohle zu" />
        
      </div>
      <div className="about-copy">
        <p className="lead">Bei Urfa Grill in Hildesheim erleben Sie den einzigartigen Geschmack der traditionellen türkischen Küche – frisch, herzhaft und authentisch.</p>
        <p>Ob saftige Kebabs, knusprige Lahmacun oder vegetarische Spezialitäten – wir bereiten jedes Gericht mit Leidenschaft und besten Zutaten zu.</p>
        <p>Besuchen Sie uns in der Schuhstraße 39, 31134 Hildesheim. Wir freuen uns auf Sie!</p>
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
