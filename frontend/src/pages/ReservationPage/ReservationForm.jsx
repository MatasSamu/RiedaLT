
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCars } from "../../services/carService";
import { createReservation } from "../../services/reservationService";
import { validateDiscountCode } from "../../services/discountService";
import { getCurrentUser } from "../../services/authService";

function ReservationForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const carId = Number(searchParams.get("carId"));
  const car = getCars().find((item) => item.id === carId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const rentalDays =
    startDate && endDate && endDate > startDate
      ? (new Date(`${endDate}T00:00:00Z`) -
          new Date(`${startDate}T00:00:00Z`)) /
        (1000 * 60 * 60 * 24)
      : 0;

  const originalPrice =
    rentalDays > 0 && car
      ? rentalDays * car.pricePerDay
      : 0;

  const discountAmount = appliedDiscount
    ? Number(appliedDiscount.amount)
    : 0;

  const discountValue = Math.round(
    originalPrice * discountAmount
  ) / 100;

  const totalPrice = Math.round(
    (originalPrice - discountValue) * 100
  ) / 100;

  function handleApplyDiscount() {
    setDiscountError("");
    setDiscountMessage("");
    setAppliedDiscount(null);

    try {
      const discount = validateDiscountCode(discountCode);

      setAppliedDiscount(discount);
      setDiscountCode(discount.code);
      setDiscountMessage(
        `Nuolaidos kodas pritaikytas! Nuolaida: ${discount.amount}%.`
      );
    } catch (err) {
      setDiscountError(err.message);
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountMessage("");
    setDiscountError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = getCurrentUser();

      if (!user) {
        throw new Error("Norėdami rezervuoti, prisijunkite.");
      }

      createReservation({
        userId: user.id,
        carId,
        startDate,
        endDate,
        discountCode: appliedDiscount?.code || "",
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
            min={startDate || today}
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountCode">Nuolaidos kodas</label>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              id="discountCode"
              placeholder="Įveskite nuolaidos kodą"
              value={discountCode}
              disabled={!!appliedDiscount}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                setDiscountError("");
              }}
              style={{ flex: 1 }}
            />

            {appliedDiscount ? (
              <button
                type="button"
                onClick={handleRemoveDiscount}
              >
                Pašalinti
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyDiscount}
              >
                Taikyti
              </button>
            )}
          </div>

          {discountMessage && (
            <p style={{ color: "#28543a", marginTop: "8px" }}>
              {discountMessage}
            </p>
          )}

          {discountError && (
            <p className="error-message">{discountError}</p>
          )}
        </div>

        {rentalDays > 0 && (
          <div className="reservation-price">
            <p>Nuomos dienos: {rentalDays}</p>

            {appliedDiscount ? (
              <>
                <p>Pradinė kaina: {originalPrice.toFixed(2)} €</p>

                <p style={{ color: "#28543a" }}>
                  Nuolaida ({discountAmount}%):
                  {" -"}{discountValue.toFixed(2)} €
                </p>

                <h3>
                  Galutinė kaina: {totalPrice.toFixed(2)} €
                </h3>
              </>
            ) : (
              <h3>
                Bendra kaina: {originalPrice.toFixed(2)} €
              </h3>
            )}
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