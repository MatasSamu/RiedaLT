import { useState } from "react";
import { Link } from "react-router-dom";
import { getCars } from "../services/carService";

function Cars() {
  const [cars] = useState(getCars);

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="home-subtitle">MŪSŲ PASIŪLYMAS</p>
          <h1>Automobiliai</h1>
          <p className="page-description">
            Pasirinkite automobilį ir pradėkite rezervaciją.
          </p>
        </div>
        <Link to="/reservations/new" className="primary-button">
          Nauja rezervacija
        </Link>
      </div>

      <div className="car-list">
        {cars.map((car) => (
          <article className="car-card" key={car.id}>
            <div className="car-card-image">
              {car.image ? (
                <img src={car.image} alt={`${car.brand} ${car.model}`} />
              ) : (
                <span>{car.brand}</span>
              )}
            </div>
            <div className="car-card-info">
              <h2>
                {car.brand} {car.model}
              </h2>
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
    </main>
  );
}

export default Cars;
