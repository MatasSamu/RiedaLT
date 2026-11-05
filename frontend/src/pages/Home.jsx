import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <header className="home-header">
        <Link to="/" className="home-logo">
          RiedaLT
        </Link>

        <nav>
          <Link to="/">Pradžia</Link>
          <Link to="/cars">Automobiliai</Link>
          <Link to="/reservations">Mano rezervacijos</Link>
          <Link to="/login">Prisijungti</Link>
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-subtitle">AUTOMOBILIŲ NUOMA PAPRASTAI</p>

          <h1>
            Tavo kelionė
            <br />
            prasideda čia.
          </h1>

          <p>
            Atrask tinkamą automobilį savo kelionei. Patogus rezervavimas ir
            paprasta nuomos patirtis.
          </p>

          <Link to="/cars" className="home-button">
            Ieškoti automobilio
          </Link>
        </div>
      </section>

      <section className="home-features">
        <h2>RiedaLT privalumai</h2>

        <div className="feature-list">
          <article className="feature-card">
            <h3>Platus pasirinkimas</h3>
            <p>Rinkitės iš skirtingų markių ir modelių automobilių.</p>
          </article>

          <article className="feature-card">
            <h3>Paprastas rezervavimas</h3>
            <p>Rezervuokite norimą automobilį vos keliais žingsniais.</p>
          </article>

          <article className="feature-card">
            <h3>Rezervacijų valdymas</h3>
            <p>
              Peržiūrėkite savo rezervacijas ir jų informaciją vienoje vietoje.
            </p>
            <Link to="/reservations">Mano rezervacijos →</Link>
          </article>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 RiedaLT. Visos teisės saugomos.</p>
      </footer>
    </main>
  );
}

export default Home;
