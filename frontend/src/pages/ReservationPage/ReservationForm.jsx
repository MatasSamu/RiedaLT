import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { initialCars } from "../../data/mockReservations";
import { useState } from "react";
import { createReservation } from "../../services/reservationService";

function ReservationForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const carId = Number(searchParams.get("carId"));
  const car = initialCars.find((item) => item.id === carId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const rentalDays =
    startDate && endDate && endDate > startDate
      ? (new Date(`${endDate}T00:00:00Z`) -
          new Date(`${startDate}T00:00:00Z`)) /
        (1000 * 60 * 60 * 24)
      : 0;

  const totalPrice = rentalDays > 0 && car ? rentalDays * car.pricePerDay : 0;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      createReservation({
        userId: 1,
        carId,
        startDate,
        endDate,
      });

      navigate("/reservations");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!car) {
    return (
      <main className="page-container">
        <h1>Automobilis nerastas</h1>
        <Link to="/">Grįžti į pradžią</Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1>Automobilio rezervacija</h1>

      <div className="reservation-card">
        <h2>
          {car.brand} {car.model}
        </h2>

        <p>Pagaminimo metai: {car.year}</p>
        <p>Kaina už parą: {car.pricePerDay} €</p>
      </div>

      <form onSubmit={handleSubmit} className="reservation-form">
        <h2>Pasirinkite nuomos laikotarpį</h2>

        <div className="form-group">
          <label htmlFor="startDate">Nuomos pradžia</label>
          <input
            type="date"
            id="startDate"
            min={today}
            required
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);

              if (endDate && e.target.value >= endDate) {
                setEndDate("");
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Nuomos pabaiga</label>
          <input
            type="date"
            id="endDate"
            min={startDate ? startDate : today}
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {rentalDays > 0 && (
          <div className="reservation-price">
            <p>Nuomos dienos: {rentalDays}</p>
            <h3>Bendra kaina: {totalPrice} €</h3>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={rentalDays <= 0}>
          Patvirtinti rezervaciją
        </button>
      </form>
    </main>
  );
}

export default ReservationForm;
