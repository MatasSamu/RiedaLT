import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Rieda<span>LT</span>
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end>
          Pradžia
        </NavLink>

        <NavLink to="/cars">Automobiliai</NavLink>

        <NavLink to="/reservations">Mano rezervacijos</NavLink>
      </nav>

      <div className="navbar-actions">
        <Link to="/login" className="navbar-login">
          Prisijungti
        </Link>

        <Link to="/register" className="navbar-register">
          Registruotis
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
