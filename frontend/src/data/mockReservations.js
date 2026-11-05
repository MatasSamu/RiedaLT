
export const initialUsers = [
  {
    id: 1,
    firstName: "Matas",
    lastName: "Samulionis",
    email: "matas@gmail.com",
    password: "123456",
    role: "customer",
  },
];

export const initialCars = [
  {
    id: 1,
    brand: "BMW",
    model: "320d",
    year: 2021,
    pricePerDay: 45,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900",
  },
  {
    id: 2,
    brand: "Audi",
    model: "A4",
    year: 2020,
    pricePerDay: 40,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900",
  },
  {
    id: 3,
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2022,
    pricePerDay: 55,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900",
  },
];

export const initialReservations = [
  {
    id: 1,
    userId: 1,
    carId: 1,
    startDate: "2026-11-10",
    endDate: "2026-11-13",
    totalPrice: 135,
    status: "Patvirtinta",
  },
];

export const initialReviews = [
  {
    id: 1,
    userId: 1,
    carId: 1,
    rating: 5,
    comment: "Puikus automobilis, viskas vyko sklandžiai!",
    date: "2026-11-01",
  },
];
