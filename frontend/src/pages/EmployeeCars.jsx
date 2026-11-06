import { useState } from "react";
import { getCars, saveCars } from "../services/carService";

const emptyCar = {
  brand: "",
  model: "",
  year: "",
  pricePerDay: "",
  image: "",
};

function EmployeeCars() {
  const [cars, setCars] = useState(getCars);
  const [form, setForm] = useState(emptyCar);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const filteredCars = cars.filter((car) =>
    `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase()),
  );

  function updateCars(nextCars) {
    setCars(nextCars);
    saveCars(nextCars);
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.brand || !form.model || !form.year || !form.pricePerDay) {
      setError("Užpildykite visus privalomus laukus.");
      return;
    }

    const car = {
      ...form,
      year: Number(form.year),
      pricePerDay: Number(form.pricePerDay),
    };

    if (editingId) {
      updateCars(cars.map((item) => (item.id === editingId ? { ...car, id: editingId } : item)));
    } else {
      updateCars([...cars, { ...car, id: Date.now() }]);
    }

    setForm(emptyCar);
    setEditingId(null);
    setError("");
  }

  function editCar(car) {
    setEditingId(car.id);
    setForm(car);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeCar(id) {
    if (!window.confirm("Ar tikrai norite pašalinti šį automobilį?")) {
      return;
    }

    updateCars(cars.filter((car) => car.id !== id));
  }

  function cancelEdit() {
    setForm(emptyCar);
    setEditingId(null);
    setError("");
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="home-subtitle">DARBUOTOJO ZONA</p>
          <h1>Automobilių valdymas</h1>
          <p className="page-description">
            Pridėkite, redaguokite arba pašalinkite nuomos automobilius.
          </p>
        </div>
        <span className="role-badge">Darbuotojas</span>
      </div>

      <section className="management-layout">
        <form className="management-card" onSubmit={handleSubmit}>
          <h2>{editingId ? "Redaguoti automobilį" : "Sukurti automobilį"}</h2>
          <label>
            Markė *
            <input name="brand" value={form.brand} onChange={handleChange} />
          </label>
          <label>
            Modelis *
            <input name="model" value={form.model} onChange={handleChange} />
          </label>
          <div className="form-row">
            <label>
              Metai *
              <input
                name="year"
                type="number"
                min="1900"
                value={form.year}
                onChange={handleChange}
              />
            </label>
            <label>
              Kaina už dieną (€) *
              <input
                name="pricePerDay"
                type="number"
                min="1"
                value={form.pricePerDay}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Nuotraukos URL
            <input name="image" value={form.image} onChange={handleChange} />
          </label>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId ? "Išsaugoti pakeitimus" : "Pridėti automobilį"}
            </button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={cancelEdit}>
                Atšaukti
              </button>
            )}
          </div>
        </form>

        <section className="management-card">
          <div className="section-heading">
            <h2>Automobilių sąrašas</h2>
            <span>
              {filteredCars.length} / {cars.length} vnt.
            </span>
          </div>
          <label className="car-search">
            <span>Ieškoti automobilio</span>
            <input
              type="search"
              placeholder="Markė arba modelis..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="management-list">
            {filteredCars.length === 0 ? (
              <div className="management-empty">
                Automobilių pagal paiešką nerasta.
              </div>
            ) : (
              filteredCars.map((car) => (
              <article className="management-item" key={car.id}>
                <div className="management-car-image">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                    />
                  ) : (
                    <span>{car.brand}</span>
                  )}
                </div>
                <div>
                  <h3>
                    {car.brand} {car.model}
                  </h3>
                  <p>
                    {car.year} m. · {car.pricePerDay} € / diena
                  </p>
                </div>
                <div className="item-actions">
                  <button type="button" className="link-button" onClick={() => editCar(car)}>
                    Redaguoti
                  </button>
                  <button type="button" className="danger-button" onClick={() => removeCar(car.id)}>
                    Šalinti
                  </button>
                </div>
              </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default EmployeeCars;
