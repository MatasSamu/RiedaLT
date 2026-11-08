import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getReservationsByUser,
  cancelReservation,
} from "../../services/reservationService";
import { getCars } from "../../services/carService";
import "./Reservation.css";
import { getCurrentUser } from "../../services/authService";

function Reservations() {
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  const [reservations, setReservations] = useState(() =>
    getReservationsByUser(currentUserId),
  );

  const [error, setError] = useState("");

  function handleCancel(id) {
    const confirmed = window.confirm(
      "Ar tikrai norite atšaukti šią rezervaciją?",
    );

    if (!confirmed) {
      return;
    }

    try {
      cancelReservation(id);
      setReservations(getReservationsByUser(currentUserId));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-container">
      <div className="reservation-page-heading">
        <div>
          <p className="home-subtitle">TAVO KELIONĖS</p>
          <h1>Mano rezervacijos</h1>
          <p className="page-description">
            Čia galite peržiūrėti savo automobilių rezervacijas.
          </p>
        </div>
        <div className="reservation-count">
          <strong>{reservations.length}</strong>
          <span>rezervacija(-os)</span>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {reservations.length === 0 ? (
        <div className="empty-state">
          <h3>Rezervacijų dar neturite</h3>
          <Link to="/">Peržiūrėti automobilius</Link>
        </div>
      ) : (
        <div className="reservation-list">
          {reservations.map((reservation) => {
            const car = getCars().find(
              (item) => item.id === reservation.carId,
            );

            return (
              <article className="reservation-card" key={reservation.id}>
                <div className="reservation-car-visual">
                  {car?.image ? (
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                    />
                  ) : (
                    <span>{car?.brand || "Automobilis"}</span>
                  )}
                  <span className="reservation-number">
                    #{reservation.id}
                  </span>
                </div>

                <div className="reservation-info">
                  <h2>
                    {car?.brand} {car?.model}
                  </h2>

                  <div className="reservation-dates">
                    <div>
                      <span>NUOMOS PRADŽIA</span>
                      <strong>{reservation.startDate}</strong>
                    </div>
                    <span className="date-arrow">→</span>
                    <div>
                      <span>NUOMOS PABAIGA</span>
                      <strong>{reservation.endDate}</strong>
                    </div>
                  </div>

                  <span
                    className={`reservation-status ${
                      reservation.status === "Atšaukta"
                        ? "cancelled"
                        : "confirmed"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div className="reservation-actions">
                  <div className="reservation-price">
                    <span>Bendra kaina</span>
                    <strong>{reservation.totalPrice} €</strong>
                  </div>
                  <Link
                    className="reservation-details-button"
                    to={`/reservations/${reservation.id}`}
                  >
                    Peržiūrėti
                  </Link>

                  {reservation.status !== "Atšaukta" && (
                    <Link
                      className="reservation-details-button"
                      to={`/reservations/${reservation.id}/edit`}
                    >
                      Redaguoti
                    </Link>
                  )}

                  {reservation.status !== "Atšaukta" && (
                    <button
                      type="button"
                      className="reservation-cancel-button"
                      onClick={() => handleCancel(reservation.id)}
                    >
                      Atšaukti
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Reservations;
