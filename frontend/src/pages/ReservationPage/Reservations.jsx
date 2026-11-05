import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getReservationsByUser,
  cancelReservation,
} from "../../services/reservationService";
import { initialCars } from "../../data/mockReservations";
import "./Reservation.css";

function Reservations() {
  const currentUserId = 1;

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
      <h1>Mano rezervacijos</h1>

      <p className="page-description">
        Čia galite peržiūrėti savo automobilių rezervacijas.
      </p>

      {error && <p className="error-message">{error}</p>}

      {reservations.length === 0 ? (
        <div className="empty-state">
          <h3>Rezervacijų dar neturite</h3>
          <Link to="/">Peržiūrėti automobilius</Link>
        </div>
      ) : (
        <div className="reservation-list">
          {reservations.map((reservation) => {
            const car = initialCars.find(
              (item) => item.id === reservation.carId,
            );

            return (
              <article className="reservation-card" key={reservation.id}>
                <div className="reservation-info">
                  <h2>
                    {car?.brand} {car?.model}
                  </h2>

                  <p>Nuomos pradžia: {reservation.startDate}</p>
                  <p>Nuomos pabaiga: {reservation.endDate}</p>

                  <p>
                    Bendra kaina: <strong>{reservation.totalPrice} €</strong>
                  </p>

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
