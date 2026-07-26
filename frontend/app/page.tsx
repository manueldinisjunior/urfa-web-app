const menuHighlights = [
  {
    name: "Urfa Döner Deluxe",
    description: "Rinderfleisch, Sumach-Zwiebeln, Knoblauchjoghurt, Lavash",
    price: "€9.90"
  },
  {
    name: "Adana Wrap",
    description: "Gegrilltes Hackfleisch, Tomate, Petersilie, Chili",
    price: "€8.40"
  },
  {
    name: "Mezze Platte",
    description: "Hummus, Acılı Ezme, Oliven, Frischkäse, Pita",
    price: "€7.50"
  }
];

const serviceSteps = [
  {
    title: "Wähle deine Lieblingsgerichte",
    copy: "Entdecke unsere Kategorien mit Döner, Grill, Bowls und Vegan-Optionen."
  },
  {
    title: "Passe alles an",
    copy: "Extras, Saucen und Schärfegrad – wir grillen genau nach deinem Wunsch."
  },
  {
    title: "Abholen oder liefern lassen",
    copy: "Live-Status der Bestellung und schnelle Auslieferung in Hildesheim."
  }
];

const orderModes = [
  "Abholung in 20 Minuten",
  "Lieferung in 35-45 Minuten",
  "Firmen-Catering",
  "Große Bestellungen"
];

export default function Home() {
  return (
    <main className="main">
      <header className="header">
        <div className="brand">Urfa Grill Hildesheim</div>
        <nav className="nav">
          <a href="#menu">Speisekarte</a>
          <a href="#ordering">Bestellen</a>
          <a href="#app">App</a>
          <button className="ghost">Anmelden</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Tradition trifft Technologie</p>
          <h1>
            Der neue Standard für türkisches Streetfood in Hildesheim.
          </h1>
          <p className="lead">
            Bestelle Urfa Klassiker in Sekunden. Unsere Plattform bietet klare
            Menüs, Treuepunkte, Echtzeit-Tracking und sichere Zahlungen – alles
            in einem Erlebnis wie bei Kasushi.
          </p>
          <div className="hero-actions">
            <button className="primary">Jetzt bestellen</button>
            <button className="secondary">Speisekarte ansehen</button>
          </div>
          <div className="hero-meta">
            <span>⭐ 4,9/5 aus 1.200+ Bewertungen</span>
            <span>⏱️ Durchschnittliche Zubereitung: 15 Min.</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Heute beliebt</h3>
          <p>Urfa Grill Mix Plate</p>
          <div className="price">€14.90</div>
          <ul>
            <li>Gegrilltes Lamm & Hähnchen</li>
            <li>Frischer Bulgur</li>
            <li>Rauchige Paprika-Sauce</li>
          </ul>
          <button className="primary full">Zum Warenkorb</button>
        </div>
      </section>

      <section id="menu" className="menu">
        <div className="section-head">
          <h2>Signature-Highlights</h2>
          <p>Unsere Favoriten – optimiert für schnelle Bestellung und volle Kontrolle.</p>
        </div>
        <div className="menu-grid">
          {menuHighlights.map((item) => (
            <article key={item.name} className="menu-card">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <span>{item.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="ordering" className="ordering">
        <div className="section-head">
          <h2>Bestellen wie bei einer modernen Food-Plattform</h2>
          <p>
            Rollenbasierter Zugriff für Kunden, Admins und Partner – mit sicheren
            Tokens, Kundenprofilen und Filialsteuerung.
          </p>
        </div>
        <div className="steps">
          {serviceSteps.map((step) => (
            <div key={step.title} className="step">
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
        <div className="order-modes">
          {orderModes.map((mode) => (
            <span key={mode}>{mode}</span>
          ))}
        </div>
      </section>

      <section id="app" className="app">
        <div>
          <h2>Smartes Dashboard für Urfa Teams</h2>
          <p>
            Verwalte Menüs, Bestellungen und Kundenbindung in Echtzeit. Das Admin-
            Dashboard synchronisiert Filialen, liefert Reportings und automatisiert
            Statusupdates.
          </p>
          <ul>
            <li>JWT-Sicherheit mit Refresh-Cookies</li>
            <li>Rollen: ADMIN, USER, COMPANY</li>
            <li>Live-Order-Tracking & Statusmanagement</li>
          </ul>
        </div>
        <div className="app-card">
          <div>
            <p className="label">Live Dashboard</p>
            <h3>Heute 128 Bestellungen</h3>
            <p>Top-Gericht: Adana Wrap</p>
          </div>
          <button className="secondary">Dashboard öffnen</button>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h4>Urfa Grill Hildesheim</h4>
          <p>Arnekenstraße 16 · 31134 Hildesheim</p>
          <p>Mo-So 11:00 – 23:00</p>
        </div>
        <div>
          <h4>Kontakt</h4>
          <p>+49 5121 000000</p>
          <p>hello@urfa-grill.de</p>
        </div>
      </footer>
    </main>
  );
}
