
import { initialReservations } from "../data/mockData";

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
