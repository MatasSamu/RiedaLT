
import { initialReservations } from "../data/mockReservations";
import { getCars } from "./carService";
import { validateDiscountCode, getDiscountCodes, saveDiscountCodes } from "./discountService";

const STORAGE_KEY = "riedalt_reservations";

// Gauna visas rezervacijas iš localStorage
function getAllReservations() {
  const savedReservations = localStorage.getItem(STORAGE_KEY);

  if (savedReservations) {
    return JSON.parse(savedReservations);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialReservations)
  );

  return initialReservations;
}

// Grąžina konkretaus naudotojo rezervacijas
export function getReservationsByUser(userId) {
  const reservations = getAllReservations();

  return reservations.filter(
    (reservation) => reservation.userId === userId
  );
}

// Grąžina rezervaciją pagal jos ID
export function getReservationById(id) {
  const reservations = getAllReservations();

  return reservations.find(
    (reservation) => reservation.id === Number(id)
  );
}
function saveReservations(reservations) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(reservations)
  );
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function calculateRentalPrice(carId, startDate, endDate) {
  const car = getCars().find(
    (item) => item.id === Number(carId)
  );

  if (!car) {
    throw new Error("Automobilis nerastas.");
  }

  if (!startDate || !endDate) {
    throw new Error("Pasirinkite abi nuomos datas.");
  }

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start.toISOString().slice(0, 10) !== startDate ||
    end.toISOString().slice(0, 10) !== endDate
  ) {
    throw new Error("Neteisingai pasirinktos nuomos datos.");
  }

  if (startDate < getTodayDate()) {
    throw new Error("Negalima rezervuoti automobilio praeities data.");
  }

  if (endDate <= startDate) {
    throw new Error("Nuomos pabaiga turi būti vėlesnė už pradžią.");
  }

  const rentalDays = (end - start) / (1000 * 60 * 60 * 24);

  return rentalDays * car.pricePerDay;
}


export function createReservation({
  userId,
  carId,
  startDate,
  endDate,
  discountCode = "",
}) {
  const reservations = getAllReservations();

  const car = getCars().find(
    (item) => item.id === Number(carId)
  );

  if (!car) {
    throw new Error("Automobilis nerastas.");
  }

  const originalPrice = calculateRentalPrice(
    carId,
    startDate,
    endDate
  );

  const hasConflict = reservations.some((reservation) => {
    return (
      reservation.carId === Number(carId) &&
      reservation.status !== "Atšaukta" &&
      startDate < reservation.endDate &&
      endDate > reservation.startDate
    );
  });

  if (hasConflict) {
    throw new Error("Šis automobilis pasirinktomis datomis jau rezervuotas.");
  }

  let totalPrice = originalPrice;
  let discountAmount = 0;
  let appliedDiscountCode = null;

  if (discountCode.trim()) {
    const discount = validateDiscountCode(discountCode);

    discountAmount = Number(discount.amount);
    appliedDiscountCode = discount.code;

    totalPrice = Math.round(
      originalPrice * (1 - discountAmount / 100) * 100
    ) / 100;
  }

  const newReservation = {
    id: Math.max(0, ...reservations.map((item) => item.id)) + 1,
    userId: Number(userId),
    carId: Number(carId),
    startDate,
    endDate,
    originalPrice,
    discountCode: appliedDiscountCode,
    discountAmount,
    totalPrice,
    status: "Patvirtinta",
  };

  const updatedReservations = [...reservations, newReservation];

  saveReservations(updatedReservations);

  if (appliedDiscountCode) {
    const codes = getDiscountCodes();

    const updatedCodes = codes.map((item) =>
      item.code === appliedDiscountCode
        ? { ...item, uses: (item.uses || 0) + 1 }
        : item
    );

    saveDiscountCodes(updatedCodes);
  }

  return newReservation;
}


export function cancelReservation(id) {
  const reservations = getAllReservations();

  const reservation = reservations.find(
    (item) => item.id === Number(id)
  );

  if (!reservation) {
    throw new Error("Rezervacija nerasta.");
  }

  if (reservation.status === "Atšaukta") {
    throw new Error("Ši rezervacija jau atšaukta.");
  }

  const updatedReservations = reservations.map((item) =>
    item.id === Number(id)
      ? { ...item, status: "Atšaukta" }
      : item
  );

  saveReservations(updatedReservations);

  return updatedReservations;
}

export function updateReservation(id, { startDate, endDate }) {
  const reservations = getAllReservations();

  const reservation = reservations.find(
    (item) => item.id === Number(id)
  );

  if (!reservation) {
    throw new Error("Rezervacija nerasta.");
  }

  if (reservation.status === "Atšaukta") {
    throw new Error("Atšauktos rezervacijos redaguoti negalima.");
  }

  // Patikriname datas ir perskaičiuojame kainą
const originalPrice = calculateRentalPrice(
  reservation.carId,
  startDate,
  endDate
);

const totalPrice = Math.round(
  originalPrice * (1 - (reservation.discountAmount || 0) / 100) * 100
) / 100;

  // Tikriname, ar tuo laikotarpiu automobilis nėra rezervuotas
  const hasConflict = reservations.some((item) => {
    return (
      item.id !== Number(id) &&
      item.carId === reservation.carId &&
      item.status !== "Atšaukta" &&
      startDate < item.endDate &&
      endDate > item.startDate
    );
  });

  if (hasConflict) {
    throw new Error(
      "Šis automobilis pasirinktomis datomis jau rezervuotas."
    );
  }

const updatedReservation = {
  ...reservation,
  startDate,
  endDate,
  originalPrice,
  totalPrice,
};

  const updatedReservations = reservations.map((item) =>
    item.id === Number(id) ? updatedReservation : item
  );

  saveReservations(updatedReservations);

  return updatedReservation;
}