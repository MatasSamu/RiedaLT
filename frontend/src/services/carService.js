import { initialCars } from "../data/mockReservations";

const storageKey = "riedalt-cars";

export function getCars() {
  const storedCars = localStorage.getItem(storageKey);

  if (!storedCars) {
    return initialCars;
  }

  try {
    return JSON.parse(storedCars);
  } catch {
    return initialCars;
  }
}

export function saveCars(cars) {
  localStorage.setItem(storageKey, JSON.stringify(cars));
}
