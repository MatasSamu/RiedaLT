import { Link, useParams } from "react-router-dom";
import { getReservationById } from "../../services/reservationService";
import { initialCars } from "../../data/mockReservations";

function ReservationDetails() {
  const { id } = useParams();

  const reservation = getReservationById(id);

  if (!reservation) {
    return (
      <main className="page-container">
        <h1>Rezervacija nerasta</h1>
        <Link to="/reservations">Grįžti į rezervacijas</Link>
      </main>
    );
  }

  const car = initialCars.find((item) => item.id === reservation.carId);

  return (
    <main className="page-container">
      <h1>Rezervacijos informacija</h1>

      <div className="reservation-card">
        <div className="reservation-info">
          <h2>{car ? `${car.brand} ${car.model}` : "Automobilis nerastas"}</h2>

          <p>Rezervacijos numeris: {reservation.id}</p>
          <p>Nuomos pradžia: {reservation.startDate}</p>
          <p>Nuomos pabaiga: {reservation.endDate}</p>
          <p>
            Bendra kaina: <strong>{reservation.totalPrice} €</strong>
          </p>
          <p>Statusas: {reservation.status}</p>
        </div>
      </div>

      <Link to="/reservations">Grįžti į rezervacijas</Link>
    </main>
  );
}

export default ReservationDetails;
