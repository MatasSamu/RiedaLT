import { useState } from "react";
import { Link } from "react-router-dom";
import { initialUsers } from "../data/mockReservations";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Registration() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.password.length < 8) {
      setError("Slaptažodį turi sudaryti bent 8 simboliai.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Slaptažodžiai nesutampa.");
      return;
    }

    let users;
    try {
      const storedUsers = localStorage.getItem("riedalt-users");
      users = storedUsers ? JSON.parse(storedUsers) : initialUsers;
    } catch {
      setError("Nepavyko perskaityti naudotojų duomenų. Bandykite dar kartą.");
      return;
    }

    if (!Array.isArray(users)) {
      setError("Nepavyko perskaityti naudotojų duomenų. Bandykite dar kartą.");
      return;
    }

    if (
      users.some(
        (user) => user.email?.toLowerCase() === form.email.trim().toLowerCase(),
      )
    ) {
      setError("Naudotojas su šiuo el. pašto adresu jau užregistruotas.");
      return;
    }

    const publicProfiles = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }));
    publicProfiles.push({
      id: Date.now(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: "customer",
    });

    try {
      const storedCredentials = localStorage.getItem("riedalt-credentials");
      const credentials = storedCredentials
        ? JSON.parse(storedCredentials)
        : {};

      credentials[form.email.trim()] = form.password;

      localStorage.setItem("riedalt-users", JSON.stringify(publicProfiles));
      localStorage.setItem("riedalt-credentials", JSON.stringify(credentials));

      setRegistered(true);
      setForm(emptyForm);
      setForm(emptyForm);
    } catch {
      setError("Nepavyko išsaugoti registracijos šiame įrenginyje.");
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <p className="home-subtitle">SVEIKI ATVYKĘ Į RIEDALT</p>
        <h1>{registered ? "Registracija sėkminga" : "Sukurkite paskyrą"}</h1>

        {registered ? (
          <div className="registration-success">
            <p>
              Jūsų paskyros duomenys išsaugoti šiame įrenginyje. Galite tęsti ir
              peržiūrėti automobilius.
            </p>
            <Link to="/cars" className="primary-button">
              Peržiūrėti automobilius
            </Link>
          </div>
        ) : (
          <>
            <p className="registration-intro">
              Užpildykite duomenis, kad sukurtumėte nuomos sistemos paskyrą.
            </p>
            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Vardas
                  <input
                    name="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Pavardė
                  <input
                    name="lastName"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <label>
                El. paštas
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Slaptažodis
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Pakartokite slaptažodį
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="primary-button">
                Registruotis
              </button>
            </form>
            <p className="registration-notice">
              Tai demonstracinė registracija: duomenys saugomi tik naršyklėje, o
              slaptažodis neišsaugomas. Serverinė paskyrų sistema dar
              neprijungta.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default Registration;
