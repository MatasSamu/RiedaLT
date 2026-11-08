import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Perskaitome prisijungusį naudotoją
  const user = getCurrentUser();

  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
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

        <NavLink to="/reviews">Atsiliepimai</NavLink>

        {(isAdmin || isEmployee) && (
          <>
            <span className="navbar-divider" />
            {isEmployee && <NavLink to="/employee/cars">Darbuotojas</NavLink>}
        {isAdmin && (
          <>
            <NavLink to="/admin/discount-codes">
              Nuolaidų kodai
            </NavLink>

            <NavLink to="/admin/users">
              Naudotojų sąrašas
            </NavLink>
          </>
        )}
          </>
        )}
      </nav>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">
              {user.firstName} (
              {isAdmin
                ? "Administratorius"
                : isEmployee
                  ? "Darbuotojas"
                  : "Klientas"}
              )
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
