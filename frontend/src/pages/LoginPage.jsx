import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      loginUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <p className="home-subtitle">SVEIKI SUGRĮŽĘ Į RIEDALT</p>
        <h1>Prisijungti</h1>

        <p className="registration-intro">
          Įveskite savo paskyros prisijungimo duomenis.
        </p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <label>
            El. paštas
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Slaptažodis
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-button">
            Prisijungti
          </button>
        </form>

        <p className="registration-intro">
          Neturite paskyros? <Link to="/register">Registruotis</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
