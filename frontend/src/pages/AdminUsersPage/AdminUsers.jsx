
import { useState } from "react";
import { getCurrentUser, getUsers, updateUserRole } from "../../services/authService";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState(() => getUsers());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();

  function handleRoleChange(userId, newRole) {
    setMessage("");
    setError("");

    try {
      updateUserRole(userId, newRole);
      setUsers(getUsers());
      setMessage("Naudotojo rolė sėkmingai pakeista.");
    } catch (err) {
      setError(err.message);
    }
  }

  function getRoleName(role) {
    if (role === "admin") return "Administratorius";
    if (role === "employee") return "Darbuotojas";
    return "Klientas";
  }

  return (
    <main className="page-container admin-users-page">
      <section className="page-heading">
        <p className="home-subtitle">ADMINISTRAVIMAS</p>
        <h1>Naudotojų sąrašas</h1>
        <p className="page-description">
          Peržiūrėkite registruotus naudotojus ir keiskite jų roles.
        </p>
      </section>

      <section className="admin-users-content">
        <div className="admin-users-heading">
          <div>
            <p className="home-subtitle">NAUDOTOJŲ VALDYMAS</p>
            <h2>Visi naudotojai</h2>
          </div>

          <span className="admin-users-count">
            Iš viso: {users.length}
          </span>
        </div>

        {message && (
          <p className="admin-users-success">{message}</p>
        )}

        {error && (
          <p className="admin-users-error">{error}</p>
        )}

        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Naudotojas</th>
                <th>El. paštas</th>
                <th>Dabartinė rolė</th>
                <th>Pakeisti rolę</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isSelf =
                  String(currentUser?.id) === String(user.id);

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-info">
                        <span className="admin-user-avatar">
                          {(user.firstName || "N")
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <strong>
                          {[user.firstName, user.lastName]
                            .filter(Boolean)
                            .join(" ") || "Naudotojas"}
                        </strong>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`admin-role admin-role-${user.role || "customer"}`}
                      >
                        {getRoleName(user.role)}
                      </span>
                    </td>

                    <td>
                      <select
                        value={user.role || "customer"}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={isSelf}
                        aria-label={`Keisti ${user.firstName || "naudotojo"} rolę`}
                      >
                        <option value="customer">Klientas</option>
                        <option value="employee">Darbuotojas</option>
                        <option value="admin">Administratorius</option>
                      </select>

                      {isSelf && (
                        <span className="admin-user-self">
                          Jūsų paskyra
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="admin-users-empty">
              Naudotojų dar nėra.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminUsers;
