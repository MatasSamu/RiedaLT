import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { initialCars } from "../../data/mockReservations";
import {
  getReservationById,
  updateReservation,
} from "../../services/reservationService";
import "./Reservation.css";

function ReservationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation] = useState(() => getReservationById(id));

  const [startDate, setStartDate] = useState(reservation?.startDate || "");

  const [endDate, setEndDate] = useState(reservation?.endDate || "");

  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  if (!reservation) {
    return (
      <main className="page-container">
        <h1>Rezervacija nerasta</h1>
        <Link to="/reservations">Grįžti į rezervacijas</Link>
      </main>
    );
  }

  if (reservation.status === "Atšaukta") {
    return (
      <main className="page-container">
        <h1>Rezervacijos redaguoti negalima</h1>
        <p>Atšauktos rezervacijos keisti negalima.</p>
        <Link to={`/reservations/${id}`}>Grįžti į rezervaciją</Link>
      </main>
    );
  }

  const car = initialCars.find((item) => item.id === reservation.carId);

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
      updateReservation(id, {
        startDate,
        endDate,
      });

      navigate(`/reservations/${id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-container">
      <h1>Redaguoti rezervaciją</h1>

      <div className="reservation-card">
        <h2>{car ? `${car.brand} ${car.model}` : "Automobilis nerastas"}</h2>

        {car && (
          <>
            <p>Pagaminimo metai: {car.year}</p>
            <p>Kaina už parą: {car.pricePerDay} €</p>
          </>
        )}

        <p>Rezervacijos numeris: #{reservation.id}</p>
      </div>

      <form onSubmit={handleSubmit} className="reservation-form">
        <h2>Pakeiskite nuomos laikotarpį</h2>

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
            min={startDate || today}
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {rentalDays > 0 && car && (
          <div className="reservation-price">
            <p>Nuomos dienos: {rentalDays}</p>
            <h3>Bendra kaina: {totalPrice} €</h3>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={rentalDays <= 0}>
          Išsaugoti pakeitimus
        </button>

        <Link to={`/reservations/${id}`} className="reservation-back-link">
          Atšaukti redagavimą
        </Link>
      </form>
    </main>
  );
}

export default ReservationEdit;
