import { useSearchParams, Link } from "react-router-dom";
import { initialCars } from "../../data/mockReservations";

function ReservationForm() {
  const [searchParams] = useSearchParams();

  const carId = Number(searchParams.get("carId"));

  const car = initialCars.find((item) => item.id === carId);

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
    </main>
  );
}

export default ReservationForm;
