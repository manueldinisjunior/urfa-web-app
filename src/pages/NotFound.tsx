import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="message-page">
    <p className="section-kicker">Fehler 404</p>
    <h1>Diese Seite gibt es nicht.</h1>
    <p>Gehe zurück zur Startseite oder öffne direkt die Speisekarte.</p>
    <Link className="red-button" to="/">Zur Startseite</Link>
  </section>
);

export default NotFound;
