export const comparisonCriteria = [
  {
    key: "pricePerDay",
    label: "Dienos kaina",
    direction: "lower",
    unit: "€ / d.",
    defaultSelected: true,
  },
  {
    key: "year",
    label: "Pagaminimo metai",
    direction: "higher",
    unit: "m.",
    defaultSelected: true,
  },
  {
    key: "mileage",
    label: "Rida",
    direction: "lower",
    unit: "km",
    defaultSelected: true,
  },
  {
    key: "seatCount",
    label: "Sėdimų vietų skaičius",
    direction: "higher",
    unit: "vietos",
    defaultSelected: true,
  },
  {
    key: "baggageCapacity",
    label: "Bagažinės talpa",
    direction: "higher",
    unit: "l",
    defaultSelected: true,
  },
  {
    key: "fuelConsumption",
    label: "Kuro / energijos sąnaudos",
    direction: "lower",
    unit: "",
    defaultSelected: true,
  },
  {
    key: "fuelType",
    label: "Kuro tipas",
    type: "preference",
    defaultSelected: false,
  },
  {
    key: "gearbox",
    label: "Pavarų dėžė",
    type: "preference",
    defaultSelected: false,
  },
  {
    key: "vehicleType",
    label: "Automobilio tipas",
    type: "preference",
    defaultSelected: false,
  },
];

export function getFuelConsumptionUnit(car) {
  return car.fuelConsumptionUnit ||
    (car.fuelType === "Elektra" ? "kWh/100 km" : "l/100 km");
}

export function hasCompleteCriterionData(cars, criterion) {
  const allValuesPresent =
    cars.length > 0 &&
    cars.every((car) => {
      const value = car[criterion.key];
      return criterion.type === "preference"
        ? typeof value === "string" && value.trim().length > 0
        : Number.isFinite(Number(value)) && value !== "" && value !== null;
    });

  if (!allValuesPresent) {
    return false;
  }

  return (
    criterion.key !== "fuelConsumption" ||
    new Set(cars.map(getFuelConsumptionUnit)).size === 1
  );
}

export function getCriterionOptions(cars, criterion) {
  return [...new Set(cars.map((car) => car[criterion.key]).filter(Boolean))].sort();
}

export function calculateComparison(cars, selectedCriteria) {
  const totalWeight = selectedCriteria.reduce(
    (total, criterion) => total + Number(criterion.weight),
    0,
  );

  const scores = new Map(cars.map((car) => [car.id, {}]));

  selectedCriteria.forEach((criterion) => {
    if (criterion.type === "preference") {
      cars.forEach((car) => {
        scores.get(car.id)[criterion.key] =
          car[criterion.key] === criterion.preferredValue ? 1 : 0;
      });
      return;
    }

    const values = cars.map((car) => Number(car[criterion.key]));
    const lowest = Math.min(...values);
    const highest = Math.max(...values);

    cars.forEach((car) => {
      const value = Number(car[criterion.key]);
      const normalized =
        highest === lowest
          ? 1
          : criterion.direction === "lower"
            ? (highest - value) / (highest - lowest)
            : (value - lowest) / (highest - lowest);
      scores.get(car.id)[criterion.key] = normalized;
    });
  });

  return cars
    .map((car) => {
      const criterionScores = scores.get(car.id);
      const score =
        totalWeight > 0
          ? selectedCriteria.reduce(
              (total, criterion) =>
                total +
                criterionScores[criterion.key] *
                  (Number(criterion.weight) / totalWeight),
              0,
            )
          : 0;
      return { car, score, criterionScores };
    })
    .sort((left, right) => right.score - left.score);
}
