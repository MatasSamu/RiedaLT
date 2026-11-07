import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Perskaitome prisijungusį naudotoją
  const user = getCurrentUser();

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

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

        {isCustomer && <NavLink to="/reservations">Mano rezervacijos</NavLink>}

        {isAdmin && (
          <>
            <span className="navbar-divider" />
            <NavLink to="/employee/cars">Darbuotojas</NavLink>
            <NavLink to="/admin/discount-codes">Administratorius</NavLink>
          </>
        )}
      </nav>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">
              {user.firstName} ({isAdmin ? "Administratorius" : "Klientas"})
            </span>

            <button
              type="button"
              className="navbar-login"
              onClick={handleLogout}
            >
              Atsijungti
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-login">
              Prisijungti
            </Link>

            <Link to="/register" className="navbar-register">
              Registruotis
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
