import { Link } from "react-router-dom";
import { useResource } from "../hooks/useResource";
import type { Settings } from "../features/operations";
export default function FAQ() {
  const { data } = useResource<Settings>("/settings");
  const days = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];
  const questions = [
    {
      q: "Wie sind die Öffnungszeiten?",
      a: data?.openingHours.some((h) => !h.closed) ? (
        <ul>
          {data.openingHours.map((h, i) => (
            <li key={i}>
              {days[i]}: {h.closed ? "Geschlossen" : `${h.open}–${h.close} Uhr`}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Bitte frage die aktuellen Öffnungszeiten direkt beim Restaurant an:{" "}
          <a href="tel:04951219890410">04951 219890410</a>.
        </p>
      ),
    },
    {
      q: "Wo finde ich Urfa Grill?",
      a: (
        <p>
          Schuhstraße 39, 31134 Hildesheim.{" "}
          <Link to="/contact">Kontakt und Anfahrt</Link>
        </p>
      ),
    },
    {
      q: "Wie bestelle ich?",
      a: (
        <p>
          Wähle deine Gerichte und Extras in der{" "}
          <Link to="/menu">Speisekarte</Link>. Prüfe den Warenkorb und gehe
          anschließend zur Kasse. Dort gibst du Abholzeit und Kontaktdaten ein.
        </p>
      ),
    },
    {
      q: "Kann ich für später bestellen?",
      a: (
        <p>
          Ja, innerhalb der freigegebenen Öffnungszeiten. Vergangene Termine
          sind ausgeschlossen. Die benötigte Vorbereitungszeit wird beim
          Absenden geprüft.
        </p>
      ),
    },
    {
      q: "Wird meine Bestellung geliefert?",
      a: (
        <p>
          Diese Anwendung unterstützt derzeit Abholung im Restaurant. Fragen zu
          einer Lieferung beantwortet das Restaurant direkt.
        </p>
      ),
    },
    {
      q: "Wie bezahle ich?",
      a: (
        <p>
          Du bezahlst bei der Abholung. Diese Anwendung zieht keine
          Onlinezahlung ein. Bitte erkundige dich direkt nach den vor Ort
          akzeptierten Zahlungsmitteln.
        </p>
      ),
    },
    {
      q: "Kann ich Zutaten oder Extras auswählen?",
      a: (
        <p>
          Die verfügbaren Auswahlmöglichkeiten findest du beim jeweiligen
          Gericht. Bei Allergien oder Unverträglichkeiten kontaktiere bitte vor
          der Bestellung das Restaurant.
        </p>
      ),
    },
    {
      q: "Wie kann ich einen Tisch reservieren?",
      a: (
        <p>
          Unter <Link to="/reservar">Tisch reservieren</Link> findest du
          verfügbare Termine. Ob deine Anfrage bereits bestätigt ist, siehst du
          nach dem Absenden.
        </p>
      ),
    },
    {
      q: "Wie verfolge oder ändere ich meinen Auftrag?",
      a: (
        <p>
          Nach einer Bestellung erhältst du einen privaten Link zum
          Bestellstatus. Für Änderungen rufe bitte das Restaurant an.
          Reservierungen kannst du über deinen privaten Stornierungslink
          absagen.
        </p>
      ),
    },
  ];
  return (
    <section className="faq-page">
      <nav className="breadcrumbs" aria-label="Brotkrümelnavigation">
        <Link to="/">Startseite</Link>
        <span>›</span>
        <span aria-current="page">FAQ</span>
      </nav>
      <h1>Häufig gestellte Fragen</h1>
      {questions.map((item, i) => (
        <details key={item.q}>
          <summary>
            <span>
              {i + 1}. {item.q}
            </span>
            <span className="faq-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <div>{item.a}</div>
        </details>
      ))}
    </section>
  );
}
