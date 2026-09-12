import { Clock, EnvelopeSimple, MapPin } from '@phosphor-icons/react';
import { useState, type FormEvent } from 'react';
import { assetUrl } from '../utils/assetUrl';

const Contact = () => {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-split">
        <img
          className="contact-map"
          src={assetUrl('assets/urfa-map.jpg')}
          alt="Stilisierte Karte des Standorts in Hildesheim"
        />
        <div className="contact-panel">
          <p className="section-kicker light">Kontakt</p>
          <h1>Lass uns sprechen.</h1>
          <p>Du hast Fragen zum Konzept, zur Speisekarte oder zu einer Zusammenarbeit? Schreib uns direkt über das Formular.</p>
          <div className="contact-detail"><MapPin weight="thin" /><div><strong>Standort</strong><span>Hildesheim · Niedersachsen</span></div></div>
          <div className="contact-detail"><Clock weight="thin" /><div><strong>Service</strong><span>Restaurant · Abholung · Catering</span></div></div>
          <div className="contact-detail"><EnvelopeSimple weight="thin" /><div><strong>Antwortzeit</strong><span>In der Regel innerhalb eines Werktags</span></div></div>
          <a className="outline-button light" href="#contact-form">Nachricht senden</a>
        </div>
      </section>

      <section className="contact-form-scene" style={{ backgroundImage: `url(${assetUrl('assets/urfa-contact.jpg')})` }}>
        <form id="contact-form" className="editorial-form" onSubmit={submit}>
          <p className="section-kicker">Nachricht</p>
          <h2>Wie können wir helfen?</h2>
          <label>Name<input name="name" autoComplete="name" minLength={2} required placeholder="Vor- und Nachname" /></label>
          <label>E-Mail<input name="email" type="email" autoComplete="email" required placeholder="name@beispiel.de" /></label>
          <label>Nachricht<textarea name="message" minLength={10} required rows={5} placeholder="Deine Nachricht" /></label>
          <button className="red-button" type="submit">Absenden</button>
          {sent && <p className="form-success" role="status">Danke! Deine Demo-Nachricht wurde erfolgreich geprüft.</p>}
          <small>Portfolio-Demo: Das Formular überträgt keine Daten.</small>
        </form>
      </section>
    </div>
  );
};

export default Contact;
