import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getReservationById,
  cancelReservation,
} from "../../services/reservationService";
import { getCars } from "../../services/carService";
import "./Reservation.css";

function ReservationDetails() {
  const { id } = useParams();

  const [reservation, setReservation] = useState(() => getReservationById(id));

  const [error, setError] = useState("");

  if (!reservation) {
    return (
      <main className="page-container">
        <h1>Rezervacija nerasta</h1>
        <Link to="/reservations" className="reservation-back-link">
          Grįžti į rezervacijas
        </Link>
      </main>
    );
  }

  const car = getCars().find((item) => item.id === reservation.carId);

  const start = new Date(`${reservation.startDate}T00:00:00Z`);
  const end = new Date(`${reservation.endDate}T00:00:00Z`);

  const rentalDays = (end - start) / (1000 * 60 * 60 * 24);

  function handleCancel() {
    const confirmed = window.confirm(
      "Ar tikrai norite atšaukti šią rezervaciją?",
    );

    if (!confirmed) {
      return;
    }

    try {
      cancelReservation(reservation.id);
      setReservation(getReservationById(id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-container">
      <h1>Rezervacijos informacija</h1>

      <div className="reservation-card">
        <div className="reservation-info">
          <h2>{car ? `${car.brand} ${car.model}` : "Automobilis nerastas"}</h2>

          {car && <p>Pagaminimo metai: {car.year}</p>}

          <p>Rezervacijos numeris: #{reservation.id}</p>

          <p>Nuomos pradžia: {reservation.startDate}</p>
          <p>Nuomos pabaiga: {reservation.endDate}</p>

          <p>Nuomos dienos: {rentalDays}</p>

          {car && <p>Kaina už parą: {car.pricePerDay} €</p>}

          <p>
            Bendra kaina: <strong>{reservation.totalPrice} €</strong>
          </p>

          <span
            className={`reservation-status ${
              reservation.status === "Atšaukta" ? "cancelled" : "confirmed"
            }`}
          >
            {reservation.status}
          </span>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="reservation-actions">
        <Link to="/reservations" className="reservation-details-button">
          Grįžti į rezervacijas
        </Link>

        {reservation.status !== "Atšaukta" && (
          <button
            type="button"
            className="reservation-cancel-button"
            onClick={handleCancel}
          >
            Atšaukti rezervaciją
          </button>
        )}
      </div>
    </main>
  );
}

export default ReservationDetails;
