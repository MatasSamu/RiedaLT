import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { getCars } from "../../services/carService";
import {
  calculateComparison,
  comparisonCriteria,
  getFuelConsumptionUnit,
  getCriterionOptions,
  hasCompleteCriterionData,
} from "../../services/carComparison";

const initialCriteriaState = Object.fromEntries(
  comparisonCriteria.map((criterion) => [
    criterion.key,
    { selected: criterion.defaultSelected, weight: 1, preferredValue: "" },
  ]),
);

function formatCriterionValue(car, criterion) {
  const value = car[criterion.key];
  if (value === undefined || value === null || value === "") {
    return "Nenurodyta";
  }
  if (criterion.key === "pricePerDay") {
    return `${value} € / d.`;
  }
  if (criterion.key === "year") {
    return `${value} m.`;
  }
  if (criterion.key === "mileage") {
    return `${Number(value).toLocaleString("lt-LT")} km`;
  }
  if (criterion.key === "fuelConsumption") {
    return `${value} ${getFuelConsumptionUnit(car)}`;
  }
  return `${value} ${criterion.unit || ""}`.trim();
}

function CarComparison() {
  const location = useLocation();
  const canAccessFromCarList =
    location.state?.fromCarsList === true &&
    Array.isArray(location.state?.selectedCarIds);
  const [cars] = useState(getCars);
  const [selectedIds, setSelectedIds] = useState(
    () => location.state?.selectedCarIds || [],
  );
  const [criteriaState, setCriteriaState] = useState(initialCriteriaState);
  const [step, setStep] = useState(1);

  const selectedCars = cars.filter((car) => selectedIds.includes(car.id));
  const selectedCriteria = useMemo(
    () =>
      comparisonCriteria
        .filter((criterion) => criteriaState[criterion.key]?.selected)
        .filter((criterion) => hasCompleteCriterionData(selectedCars, criterion))
        .map((criterion) => ({
          ...criterion,
          ...criteriaState[criterion.key],
          preferredValue:
            criteriaState[criterion.key].preferredValue ||
            getCriterionOptions(selectedCars, criterion)[0],
        })),
    [criteriaState, selectedCars],
  );
  const results = useMemo(
    () => calculateComparison(selectedCars, selectedCriteria),
    [selectedCars, selectedCriteria],
  );

  if (!canAccessFromCarList) {
    return <Navigate to="/cars" replace />;
  }

  function toggleCar(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  function updateCriterion(key, changes) {
    setCriteriaState((current) => ({
      ...current,
      [key]: { ...current[key], ...changes },
    }));
  }

  function stepLabel(number, label) {
    return (
      <div className={`comparison-step ${step >= number ? "active" : ""}`} key={number}>
        <span>{number}</span>
        <strong>{label}</strong>
      </div>
    );
  }

  const hasTie =
    results.length > 1 && Math.abs(results[0].score - results[1].score) < 1e-9;
  const recommendedCars = hasTie
    ? results.filter((result) => Math.abs(result.score - results[0].score) < 1e-9)
    : results.slice(0, 1);

  return (
    <main className="page-container comparison-page">
      <div className="page-heading">
        <div>
          <p className="home-subtitle">IŠSIRINKITE TINKAMIAUSIĄ</p>
          <h1>Automobilių palyginimas</h1>
          <p className="page-description">
            Pasirinkite automobilius ir kriterijus – apskaičiuosime svertinį
            įvertinimą bei pateiksime rekomendaciją.
          </p>
        </div>
        <Link to="/cars" className="secondary-button">
          Grįžti į sąrašą
        </Link>
      </div>

      <nav className="comparison-steps" aria-label="Palyginimo žingsniai">
        {stepLabel(1, "Automobiliai")}
        {stepLabel(2, "Kriterijai")}
        {stepLabel(3, "Rezultatas")}
      </nav>

      {step === 1 && (
        <section className="comparison-panel">
          <div className="comparison-panel-heading">
            <div>
              <h2>1. Pasirinkite automobilius</h2>
              <p>Pažymėkite bent du automobilius, kuriuos norite palyginti.</p>
            </div>
            <span>{selectedCars.length} pasirinkta</span>
          </div>
          <div className="comparison-car-options">
            {cars.map((car) => {
              const make = car.manufacturer || car.brand;
              return (
                <label className="comparison-car-option" key={car.id}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(car.id)}
                    onChange={() => toggleCar(car.id)}
                  />
                  <span>
                    <strong>{make} {car.model}</strong>
                    <small>{car.year} m. · {car.pricePerDay} € / diena</small>
                  </span>
                </label>
              );
            })}
          </div>
          {cars.length < 2 && (
            <p className="comparison-message" role="status">
              Palyginimui reikia bent dviejų automobilių.
            </p>
          )}
          <div className="comparison-actions">
            <Link to="/cars" className="secondary-button">Atšaukti</Link>
            <button
              type="button"
              className="primary-button"
              onClick={() => setStep(2)}
              disabled={selectedCars.length < 2}
            >
              Toliau: kriterijai
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="comparison-panel">
          <div className="comparison-panel-heading">
            <div>
              <h2>2. Pasirinkite ir pasverkite kriterijus</h2>
              <p>
                Svoris nuo 1 iki 5 nusako, kiek kriterijus svarbus. Galutiniai
                svoriai automatiškai normalizuojami.
              </p>
            </div>
          </div>
          <div className="criteria-list">
            {comparisonCriteria.map((criterion) => {
              const complete = hasCompleteCriterionData(selectedCars, criterion);
              const options = getCriterionOptions(selectedCars, criterion);
              const selection = criteriaState[criterion.key];
              return (
                <div
                  className={`criterion-option ${!complete ? "unavailable" : ""}`}
                  key={criterion.key}
                >
                  <label className="criterion-select">
                    <input
                      type="checkbox"
                      checked={selection.selected}
                      disabled={!complete}
                      onChange={(event) =>
                        updateCriterion(criterion.key, { selected: event.target.checked })
                      }
                    />
                    <span>
                      <strong>{criterion.label}</strong>
                      <small>
                        {!complete
                          ? "Trūksta duomenų bent vienam pasirinktam automobiliui"
                          : criterion.type === "preference"
                            ? "Vertinamas atitikimas pageidaujamai reikšmei"
                            : criterion.direction === "lower"
                              ? "Mažesnė reikšmė vertinama geriau"
                              : "Didesnė reikšmė vertinama geriau"}
                      </small>
                    </span>
                  </label>
                  {criterion.type === "preference" && complete && (
                    <label className="criterion-preference">
                      Pageidaujama reikšmė
                      <select
                        value={selection.preferredValue || options[0]}
                        disabled={!selection.selected}
                        onChange={(event) =>
                          updateCriterion(criterion.key, {
                            preferredValue: event.target.value,
                          })
                        }
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="criterion-weight">
                    Svoris
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="1"
                      value={selection.weight}
                      disabled={!complete || !selection.selected}
                      onChange={(event) =>
                        updateCriterion(criterion.key, {
                          weight: Math.min(5, Math.max(1, Number(event.target.value) || 1)),
                        })
                      }
                    />
                  </label>
                </div>
              );
            })}
          </div>
          {selectedCriteria.length === 0 && (
            <p className="comparison-message" role="alert">
              Pasirinkite bent vieną kriterijų, kurio duomenys yra visuose
              automobiliuose.
            </p>
          )}
          <div className="comparison-actions">
            <button type="button" className="secondary-button" onClick={() => setStep(1)}>
              Atgal: automobiliai
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setStep(3)}
              disabled={selectedCriteria.length === 0}
            >
              Apskaičiuoti palyginimą
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="comparison-panel comparison-results">
          <div className="comparison-panel-heading">
            <div>
              <h2>3. Palyginimo rezultatai</h2>
              <p>
                Skaitinės reikšmės normalizuotos pagal pasirinktų automobilių
                intervalą, o kriterijų balai sujungti pagal jų svorius.
              </p>
            </div>
          </div>
          <div className="recommendation-card" role="status">
            <span>REKOMENDACIJA</span>
            <h3>
              {hasTie ? "Geriausiai įvertinti automobiliai" : "Geriausiai įvertintas automobilis"}
            </h3>
            <p>
              {recommendedCars.map(({ car }) =>
                `${car.manufacturer || car.brand} ${car.model}`,
              ).join(" ir ")}
            </p>
            <small>
              Svertinis rezultatas: {Math.round(results[0]?.score * 100 || 0)} / 100
            </small>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Automobilis</th>
                  {selectedCriteria.map((criterion) => (
                    <th scope="col" key={criterion.key}>
                      {criterion.label}<small>Svoris: {criterion.weight}</small>
                    </th>
                  ))}
                  <th scope="col">Svertinis balas</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ car, score, criterionScores }, index) => (
                  <tr key={car.id} className={index === 0 ? "recommended-row" : ""}>
                    <th scope="row">
                      <Link to={`/cars/${car.id}`}>
                        {car.manufacturer || car.brand} {car.model}
                      </Link>
                      {index === 0 && <small>Rekomenduojamas</small>}
                    </th>
                    {selectedCriteria.map((criterion) => (
                      <td key={criterion.key}>
                        <strong>{formatCriterionValue(car, criterion)}</strong>
                        <small>
                          {Math.round(criterionScores[criterion.key] * 100)} / 100
                        </small>
                      </td>
                    ))}
                    <td className="total-score">
                      {Math.round(score * 100)} / 100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-actions">
            <button type="button" className="secondary-button" onClick={() => setStep(2)}>
              Keisti kriterijus
            </button>
            <button type="button" className="primary-button" onClick={() => setStep(1)}>
              Keisti automobilius
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default CarComparison;
