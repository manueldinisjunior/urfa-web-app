import { Minus, Plus } from '@phosphor-icons/react';
import { useState, type FormEvent } from 'react';

const jobs = [
  { title: 'Service & Gästebetreuung', type: 'Teilzeit · Hildesheim' },
  { title: 'Küche & Grill', type: 'Vollzeit · Hildesheim' },
  { title: 'Initiativbewerbung', type: 'Flexibel · Hildesheim' },
];

const Careers = () => {
  const [openJob, setOpenJob] = useState(0);
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
  };

  return (
    <section className="careers-page">
      <div className="careers-intro">
        <p className="section-kicker">Karriere</p>
        <h1>Werde Teil<br />unseres Teams.</h1>
        <p className="lead"><strong>Bei Urfa Grill zählt jeder Mensch.</strong></p>
        <p>Du arbeitest gern im Team, bleibst auch dann aufmerksam, wenn viel los ist, und hast Freude an gutem Essen? Dann möchten wir dich kennenlernen.</p>
        <div className="job-list">
          {jobs.map((job, index) => (
            <article className={openJob === index ? 'open' : ''} key={job.title}>
              <button type="button" onClick={() => setOpenJob(openJob === index ? -1 : index)} aria-expanded={openJob === index}>
                <span><strong>{job.title}</strong><small>{job.type}</small></span>
                {openJob === index ? <Minus /> : <Plus />}
              </button>
              {openJob === index && <p>Wir suchen zuverlässige Persönlichkeiten mit Qualitätsbewusstsein. Erfahrung ist willkommen; Haltung, Lernbereitschaft und Teamgeist sind entscheidend.</p>}
            </article>
          ))}
        </div>
      </div>

      <form className="application-form" onSubmit={submit}>
        <div className="two-fields">
          <label>Vorname<input name="firstName" required placeholder="Vorname" /></label>
          <label>Nachname<input name="lastName" required placeholder="Nachname" /></label>
        </div>
        <div className="two-fields">
          <label>E-Mail<input name="email" type="email" required placeholder="name@beispiel.de" /></label>
          <label>Telefon<input name="phone" type="tel" placeholder="Telefonnummer" /></label>
        </div>
        <fieldset>
          <legend>Bereich</legend>
          {jobs.map((job, index) => <label className="radio-row" key={job.title}><input type="radio" name="role" value={job.title} defaultChecked={index === 0} /> {job.title}</label>)}
        </fieldset>
        <label>Kurze Vorstellung<textarea name="message" minLength={20} rows={5} required placeholder="Erzähl uns kurz von dir und deiner Motivation." /></label>
        <label>Lebenslauf<input name="cv" type="file" accept=".pdf,.doc,.docx" /></label>
        <button className="red-button" type="submit">Bewerbung prüfen</button>
        {sent && <p className="form-success" role="status">Danke! Deine Demo-Bewerbung wurde erfolgreich geprüft.</p>}
        <small>Portfolio-Demo: Dateien und Formulardaten werden nicht hochgeladen.</small>
      </form>
    </section>
  );
};

export default Careers;
