import { Link } from "react-router-dom";
import { initialCars } from "../data/mockReservations";

function Home() {
  return (
    <main className="home-page">
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

      <section className="home-cars">
        <div className="home-cars-heading">
          <div>
            <p className="home-subtitle">MŪSŲ PASIŪLYMAS</p>
            <h2>Populiariausi automobiliai</h2>
          </div>
        </div>

        <div className="car-list">
          {initialCars.map((car) => (
            <article className="car-card" key={car.id}>
              <div className="car-card-image">
                <span>{car.brand}</span>
              </div>

              <div className="car-card-info">
                <h3>
                  {car.brand} {car.model}
                </h3>

                <p>Pagaminimo metai: {car.year}</p>

                <div className="car-card-bottom">
                  <p>
                    <strong>{car.pricePerDay} €</strong> / diena
                  </p>

                  <Link
                    to={`/reservations/new?carId=${car.id}`}
                    className="car-reserve-button"
                  >
                    Rezervuoti
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
