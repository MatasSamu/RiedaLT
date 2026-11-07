import { Link, useParams } from "react-router-dom";
import { getCars } from "../services/carService";
import { getFuelConsumptionUnit } from "../services/carComparison";

function formatValue(value, unit) {
  if (value === undefined || value === null || value === "") {
    return "Nenurodyta";
  }
  return `${value} ${unit}`.trim();
}

function CarDetails() {
  const { id } = useParams();
  const car = getCars().find((item) => String(item.id) === id);

  if (!car) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <h1>Automobilis nerastas</h1>
          <p>Šis automobilis pašalintas arba jo nuoroda neteisinga.</p>
          <Link to="/cars">Grįžti į automobilių sąrašą</Link>
        </section>
      </main>
    );
  }

  const manufacturer = car.manufacturer || car.brand || "Nenurodyta";

  return (
    <main className="page-container car-details-page">
      <Link to="/cars" className="reservation-back-link">
        ← Automobilių sąrašas
      </Link>
      <section className="car-details-hero">
        <div className="car-details-image">
          {car.image ? (
            <img src={car.image} alt={`${manufacturer} ${car.model}`} />
          ) : (
            <span>{manufacturer}</span>
          )}
        </div>
        <div className="car-details-summary">
          <p className="home-subtitle">AUTOMOBILIO INFORMACIJA</p>
          <h1>{manufacturer} {car.model}</h1>
          <p>
            {car.vehicleType || "Automobilio tipas nenurodytas"} · {car.year} m.
          </p>
          <p className="car-details-price">
            {formatValue(car.pricePerDay, "€ / diena")}
          </p>
          <Link
            to={`/reservations/new?carId=${car.id}`}
            className="primary-button"
          >
            Rezervuoti automobilį
          </Link>
        </div>
      </section>

      <section className="car-specification-section">
        <div>
          <p className="home-subtitle">VISKAS, KĄ REIKIA ŽINOTI</p>
          <h2>Techniniai duomenys</h2>
        </div>
        <dl className="car-specification-grid">
          <div><dt>Gamintojas</dt><dd>{manufacturer}</dd></div>
          <div><dt>Modelis</dt><dd>{car.model || "Nenurodyta"}</dd></div>
          <div><dt>Pagaminimo metai</dt><dd>{formatValue(car.year, "m.")}</dd></div>
          <div><dt>Kėbulo tipas</dt><dd>{car.vehicleType || "Nenurodyta"}</dd></div>
          <div><dt>Kuro tipas</dt><dd>{car.fuelType || "Nenurodyta"}</dd></div>
          <div><dt>Pavarų dėžė</dt><dd>{car.gearbox || "Nenurodyta"}</dd></div>
          <div><dt>Rida</dt><dd>{formatValue(car.mileage, "km")}</dd></div>
          <div><dt>Sėdimų vietų skaičius</dt><dd>{formatValue(car.seatCount, "")}</dd></div>
          <div><dt>Bagažinės talpa</dt><dd>{formatValue(car.baggageCapacity, "l")}</dd></div>
          <div>
            <dt>Kuro / energijos sąnaudos</dt>
            <dd>{formatValue(car.fuelConsumption, getFuelConsumptionUnit(car))}</dd>
          </div>
          <div><dt>Nuomos kaina</dt><dd>{formatValue(car.pricePerDay, "€ / diena")}</dd></div>
        </dl>
      </section>
    </main>
  );
}

export default CarDetails;
