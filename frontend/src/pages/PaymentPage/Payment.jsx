
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  calculateRentalPrice,
  createReservation,
} from "../../services/reservationService";
import { validateDiscountCode } from "../../services/discountService";
import { getCars } from "../../services/carService";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const reservation = location.state;
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  if (
    !reservation ||
    !reservation.carId ||
    !reservation.startDate ||
    !reservation.endDate
  ) {
    return (
      <main className="page-container">
        <h1>Mokėjimo informacija nerasta</h1>
        <p>Pirmiausia pasirinkite automobilį ir nuomos datas.</p>
        <Link to="/cars">Grįžti į automobilius</Link>
      </main>
    );
  }

  const car = getCars().find(
    (item) => item.id === Number(reservation.carId)
  );

  let totalPrice = 0;
  let priceError = "";

  try {
    const originalPrice = calculateRentalPrice(
      reservation.carId,
      reservation.startDate,
      reservation.endDate
    );

    const discount = reservation.discountCode
      ? validateDiscountCode(reservation.discountCode)
      : null;

    totalPrice = Math.round(
      originalPrice * (1 - (discount?.amount || 0) / 100) * 100
    ) / 100;
  } catch (err) {
    priceError = err.message;
  }

  function handlePayment(e) {
    e.preventDefault();
    setError("");

    if (isPaying) return;

    setIsPaying(true);

    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error("Norėdami sumokėti, prisijunkite.");
      }

      // Tik čia išsaugoma rezervacija.
      // Mokėjimas yra tik demonstracinis.
      createReservation({
        userId: user.id,
        carId: reservation.carId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        discountCode: reservation.discountCode || "",
      });

      navigate("/reservations", { replace: true });
    } catch (err) {
      setError(err.message);
      setIsPaying(false);
    }
  }

  return (
    <main className="page-container payment-page">
      <div className="page-heading">
        <div>
          <p className="home-subtitle">REZERVACIJOS APMOKĖJIMAS</p>
          <h1>Mokėjimas</h1>
          <p className="page-description">
            Patikrinkite rezervacijos informaciją ir patvirtinkite mokėjimą.
          </p>
        </div>
      </div>

      <div className="payment-card">
        <h2>Rezervacijos informacija</h2>

        <div className="payment-row">
          <span>Automobilis</span>
          <strong>
            {car ? `${car.brand} ${car.model}` : "Nerastas"}
          </strong>
        </div>

        <div className="payment-row">
          <span>Nuomos pradžia</span>
          <strong>{reservation.startDate}</strong>
        </div>

        <div className="payment-row">
          <span>Nuomos pabaiga</span>
          <strong>{reservation.endDate}</strong>
        </div>

        {reservation.discountCode && (
          <div className="payment-row">
            <span>Nuolaidos kodas</span>
            <strong>{reservation.discountCode}</strong>
          </div>
        )}

        <div className="payment-total">
          <span>Mokėtina suma</span>
          <strong>{totalPrice.toFixed(2)} €</strong>
        </div>

        <form onSubmit={handlePayment}>
          <h3>Mokėjimo informacija</h3>

          <p className="payment-notice">
            Tai demonstracinis mokėjimas. Tikri pinigai nebus nuskaičiuoti.
            Banko kortelės duomenų įvesti nereikia.
          </p>

          {priceError && (
            <p className="error-message">{priceError}</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            type="submit"
            className="primary-button payment-button"
            disabled={isPaying || !!priceError || !car}
          >
            {isPaying
              ? "Vykdoma..."
              : `Sumokėti ${totalPrice.toFixed(2)} €`}
          </button>
        </form>

        <Link
          to="/cars"
          className="payment-back-link"
        >
          Grįžti į automobilius
        </Link>
      </div>
    </main>
  );
}

export default Payment;
