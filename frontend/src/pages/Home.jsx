import { Link } from "react-router-dom";
import { getCars } from "../services/carService";
import { useState } from "react";

function Home() {
  const [cars] = useState(getCars);
  const featuredCars = cars.slice(0, 3);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="hero-eyebrow">RIEDALT AUTOMOBILIŲ NUOMA</span>

          <h1>
            Kelionė prasideda
            <br />
            nuo tinkamo <em>automobilio.</em>
          </h1>

          <p>
            Atraskite patogų ir patikimą automobilį savo kelionei. Rezervuokite
            internetu greitai, aiškiai ir be nereikalingų žingsnių.
          </p>

          <div className="hero-actions">
            <Link to="/cars" className="home-button">
              Peržiūrėti automobilius <span>→</span>
            </Link>
            <Link to="/reservations" className="hero-secondary-link">
              Mano rezervacijos
            </Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-image-frame">
            <img src={featuredCars[0]?.image} alt="BMW 320d automobilis" />
          </div>
        </div>
      </section>

      <section className="home-cars">
        <div className="home-cars-heading">
          <div>
            <p className="home-subtitle">ATRASKITE SAVO KITĄ KELIONĘ</p>
            <h2>Populiariausi automobiliai</h2>
          </div>
          <Link to="/cars" className="view-all-link">
            Visi automobiliai <span>→</span>
          </Link>
        </div>

        <div className="car-list">
          {featuredCars.map((car) => (
            <article className="car-card" key={car.id}>
              <div className="car-card-image">
                {car.image ? (
                  <img src={car.image} alt={`${car.brand} ${car.model}`} />
                ) : (
                  <span>{car.brand}</span>
                )}
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

      <section className="home-stats">
        <div>
          <strong>{cars.length}+</strong>
          <span>Automobilių pasirinkimas</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>Paprastas rezervavimas</span>
        </div>
      </section>

      <section className="home-features">
        <p className="home-subtitle">KODĖL RIEDALT?</p>
        <h2>Viskas, ko reikia patogiai kelionei</h2>

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
