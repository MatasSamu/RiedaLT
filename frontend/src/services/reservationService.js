
import { initialReservations, initialCars  } from "../data/mockReservations";

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

export function calculateRentalPrice(carId, startDate, endDate) {
  const car = initialCars.find(
    (item) => item.id === Number(carId)
  );

  if (!car) {
    throw new Error("Automobilis nerastas.");
  }

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    throw new Error("Neteisingai pasirinktos nuomos datos.");
  }

  const rentalDays = (end - start) / (1000 * 60 * 60 * 24);

  return rentalDays * car.pricePerDay;
}

export function createReservation({
  userId,
  carId,
  startDate,
  endDate,
}) {
  const reservations = getAllReservations();

  const car = initialCars.find(
    (item) => item.id === Number(carId)
  );

  if (!car) {
    throw new Error("Automobilis nerastas.");
  }

  const totalPrice = calculateRentalPrice(
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

  const newReservation = {
    id: Math.max(0, ...reservations.map((item) => item.id)) + 1,
    userId: Number(userId),
    carId: Number(carId),
    startDate,
    endDate,
    totalPrice,
    status: "Patvirtinta",
  };

  const updatedReservations = [...reservations, newReservation];

  saveReservations(updatedReservations);

  return newReservation;
}
