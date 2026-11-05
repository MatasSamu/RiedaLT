import { useState } from "react";
import { Link } from "react-router-dom";
import { getReservationsByUser } from "../../services/reservationService";
import { initialCars } from "../../data/mockReservations";

function Reservations() {
  // Kol dar neturime prisijungimo funkcionalumo,
  // naudojame demonstracinio naudotojo ID.
  const currentUserId = 1;

  const [reservations] = useState(() => getReservationsByUser(currentUserId));

  return (
    <main className="page-container">
      <h1>Mano rezervacijos</h1>
      <p className="page-description">
        Čia galite peržiūrėti savo automobilių rezervacijas.
      </p>

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

                <Link
                  className="reservation-details-button"
                  to={`/reservations/${reservation.id}`}
                >
                  Peržiūrėti
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Reservations;
