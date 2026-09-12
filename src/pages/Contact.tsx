import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';
import { assetUrl } from '../utils/assetUrl';

const Contact = () => (
  <section className="contact-split">
    <img className="contact-map" src={assetUrl('assets/urfa-table.webp')} alt="Türkische Spezialitäten" width="1400" height="613" />
    <div className="contact-panel">
      <p className="section-kicker light">Urfa Grill Hildesheim</p>
      <h1>Wir freuen uns auf dich.</h1>
      <p>Fragen zur Speisekarte? Ruf uns an, schreib uns eine E-Mail oder besuche uns direkt im Restaurant.</p>
      <div className="contact-detail"><MapPin weight="thin" /><div><strong>Adresse</strong><span>Schuhstraße 39, 31134 Hildesheim, Deutschland</span></div></div>
      <div className="contact-detail"><Phone weight="thin" /><div><strong>Telefon</strong><a href="tel:04951219890410">04951 219890410</a></div></div>
      <div className="contact-detail"><EnvelopeSimple weight="thin" /><div><strong>E-Mail</strong><a href="mailto:urfagrillhildesheim@gmail.com">urfagrillhildesheim@gmail.com</a></div></div>
      <a className="white-button" href="https://www.google.com/maps/search/?api=1&query=Schuhstra%C3%9Fe+39+31134+Hildesheim" target="_blank" rel="noreferrer">Route planen</a>
    </div>
  </section>
);
export default Contact;
