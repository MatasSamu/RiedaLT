import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCars } from "../services/carService";

function uniqueValues(cars, key) {
  return [...new Set(cars.map((car) => car[key]).filter(Boolean))].sort();
}

function Cars() {
  const [cars] = useState(getCars);
  const [search, setSearch] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const manufacturers = useMemo(
    () =>
      [...new Set(cars.map((car) => car.manufacturer || car.brand).filter(Boolean))].sort(),
    [cars],
  );
  const vehicleTypes = useMemo(() => uniqueValues(cars, "vehicleType"), [cars]);
  const fuelTypes = useMemo(() => uniqueValues(cars, "fuelType"), [cars]);
  const gearboxes = useMemo(() => uniqueValues(cars, "gearbox"), [cars]);

  const filteredCars = cars.filter((car) => {
    const make = car.manufacturer || car.brand || "";
    const searchMatches = `${make} ${car.model}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return (
      searchMatches &&
      (!manufacturer || make === manufacturer) &&
      (!vehicleType || car.vehicleType === vehicleType) &&
      (!fuelType || car.fuelType === fuelType) &&
      (!gearbox || car.gearbox === gearbox) &&
      (!maxPrice || Number(car.pricePerDay) <= Number(maxPrice)) &&
      (!minYear || Number(car.year) >= Number(minYear))
    );
  });

  function toggleSelected(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  function openComparison() {
    navigate("/cars/compare", {
      state: { fromCarsList: true, selectedCarIds: selectedIds },
    });
  }

  function clearFilters() {
    setSearch("");
    setManufacturer("");
    setVehicleType("");
    setFuelType("");
    setGearbox("");
    setMaxPrice("");
    setMinYear("");
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="home-subtitle">MŪSŲ PASIŪLYMAS</p>
          <h1>Automobiliai</h1>
          <p className="page-description">
            Ieškokite, filtruokite ir palyginkite automobilius prieš rezervuodami.
          </p>
        </div>
        <Link to="/reservations/new" className="primary-button">
          Nauja rezervacija
        </Link>
      </div>

      <section className="car-filter-panel" aria-label="Automobilių filtrai">
        <div className="filter-panel-heading">
          <div>
            <h2>Raskite tinkamą automobilį</h2>
            <p>{filteredCars.length} iš {cars.length} automobilių</p>
          </div>
          <button type="button" className="link-button" onClick={clearFilters}>
            Išvalyti filtrus
          </button>
        </div>
        <div className="car-filter-grid">
          <label className="filter-search">
            Paieška
            <input
              type="search"
              placeholder="Markė arba modelis"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            Gamintojas
            <select value={manufacturer} onChange={(event) => setManufacturer(event.target.value)}>
              <option value="">Visi gamintojai</option>
              {manufacturers.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Kėbulo tipas
            <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
              <option value="">Visi tipai</option>
              {vehicleTypes.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Kuro tipas
            <select value={fuelType} onChange={(event) => setFuelType(event.target.value)}>
              <option value="">Visi</option>
              {fuelTypes.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Pavarų dėžė
            <select value={gearbox} onChange={(event) => setGearbox(event.target.value)}>
              <option value="">Visos</option>
              {gearboxes.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Maks. kaina / dieną (€)
            <input
              type="number"
              min="0"
              placeholder="Bet kokia"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </label>
          <label>
            Nuo metų
            <input
              type="number"
              min="1900"
              placeholder="Bet kokie"
              value={minYear}
              onChange={(event) => setMinYear(event.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="comparison-toolbar">
        <p>
          Pasirinkta palyginimui: <strong>{selectedIds.length}</strong>
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={openComparison}
          disabled={selectedIds.length < 2}
        >
          Palyginti automobilius
        </button>
      </div>

      {filteredCars.length ? (
        <div className="car-list">
          {filteredCars.map((car) => {
            const make = car.manufacturer || car.brand;
            return (
              <article className="car-card" key={car.id}>
                <Link
                  to={`/cars/${car.id}`}
                  className="car-card-image"
                  aria-label={`Peržiūrėti ${make} ${car.model} informaciją`}
                >
                  {car.image ? (
                    <img src={car.image} alt={`${make} ${car.model}`} />
                  ) : (
                    <span>{make}</span>
                  )}
                </Link>
                <div className="car-card-info">
                  <h2>
                    <Link to={`/cars/${car.id}`}>{make} {car.model}</Link>
                  </h2>
                  <p>{car.year} m. · {car.vehicleType || "Tipas nenurodytas"}</p>
                  <p className="car-card-specs">
                    {car.fuelType || "Kuras nenurodytas"} · {car.gearbox || "Pavarų dėžė nenurodyta"}
                  </p>
                  <div className="car-card-bottom">
                    <p><strong>{car.pricePerDay} €</strong> / diena</p>
                    <Link
                      to={`/reservations/new?carId=${car.id}`}
                      className="car-reserve-button"
                    >
                      Rezervuoti
                    </Link>
                  </div>
                  <label className="compare-select">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(car.id)}
                      onChange={() => toggleSelected(car.id)}
                    />
                    Įtraukti į palyginimą
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="empty-state">
          <h2>Pagal pasirinktus filtrus automobilių nerasta</h2>
          <p>Pakeiskite paieškos kriterijus arba išvalykite filtrus.</p>
          <button type="button" className="secondary-button" onClick={clearFilters}>
            Išvalyti filtrus
          </button>
        </section>
      )}
    </main>
  );
}

export default Cars;
