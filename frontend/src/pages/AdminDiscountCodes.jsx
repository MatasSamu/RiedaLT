import { useState } from "react";
import { generateDiscountCode, getDiscountCodes, saveDiscountCodes } from "../services/discountService";

const emptyForm = {
  amount: 10,
  validFrom: "",
  validUntil: "",
};

function AdminDiscountCodes() {
  const [codes, setCodes] = useState(getDiscountCodes);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.validFrom || !form.validUntil || form.amount < 1 || form.amount > 90) {
      setError("Įveskite nuolaidą nuo 1 iki 90 procentų ir galiojimo laikotarpį.");
      return;
    }

    if (form.validUntil < form.validFrom) {
      setError("Galiojimo pabaiga negali būti ankstesnė už pradžią.");
      return;
    }

    const newCode = {
      id: Date.now(),
      code: generateDiscountCode(Number(form.amount)),
      amount: Number(form.amount),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      uses: 0,
    };
    const nextCodes = [newCode, ...codes];

    setCodes(nextCodes);
    saveDiscountCodes(nextCodes);
    setForm(emptyForm);
    setError("");
  }

  function removeCode(id) {
    const discount = codes.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Ar tikrai norite pašalinti kodą ${discount.code}?`,
    );

    if (!confirmed) {
      return;
    }

    const nextCodes = codes.filter((item) => item.id !== id);
    setCodes(nextCodes);
    saveDiscountCodes(nextCodes);
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <p className="home-subtitle">ADMINISTRAVIMO ZONA</p>
          <h1>Nuolaidos kodai</h1>
          <p className="page-description">
            Sugeneruokite kodą ir peržiūrėkite visus sukurtus kodus.
          </p>
        </div>
        <span className="role-badge">Administratorius</span>
      </div>

      <section className="management-layout">
        <form className="management-card" onSubmit={handleSubmit}>
          <h2>Generuoti nuolaidos kodą</h2>
          <p className="form-hint">
            Kodas sudaromas iš nuolaidos prefikso, procento, atsitiktinės sekos
            ir kontrolinio simbolio.
          </p>
          <label>
            Nuolaida (%)
            <input
              name="amount"
              type="number"
              min="1"
              max="90"
              value={form.amount}
              onChange={handleChange}
            />
          </label>
          <div className="form-row">
            <label>
              Galioja nuo
              <input
                name="validFrom"
                type="date"
                value={form.validFrom}
                onChange={handleChange}
              />
            </label>
            <label>
              Galioja iki
              <input
                name="validUntil"
                type="date"
                value={form.validUntil}
                onChange={handleChange}
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="primary-button">
            Sugeneruoti kodą
          </button>
        </form>

        <section className="management-card">
          <div className="section-heading">
            <h2>Visi nuolaidos kodai</h2>
            <span>{codes.length} vnt.</span>
          </div>
          <div className="discount-list">
            {codes.map((discount) => (
              <article className="discount-item" key={discount.id}>
                <div>
                  <strong>{discount.code}</strong>
                  <p>
                    {discount.amount}% · {discount.validFrom} – {discount.validUntil}
                  </p>
                </div>
                <div className="discount-actions">
                  <span className="code-status">Aktyvus</span>
                  <button
                    type="button"
                    className="delete-code-button"
                    onClick={() => removeCode(discount.id)}
                  >
                    Šalinti
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminDiscountCodes;
