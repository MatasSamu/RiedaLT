import { initialUsers } from "../data/mockReservations";

const USERS_KEY = "riedalt-users";
const CREDENTIALS_KEY = "riedalt-credentials";
const CURRENT_USER_KEY = "riedalt-current-user";

// Demonstracinė administratoriaus paskyra
const demoAdmin = {
  id: 0,
  firstName: "Sistemos",
  lastName: "Administratorius",
  email: "admin@riedalt.lt",
  role: "admin",
  password: "Admin123",
};

function getUsers() {
  const storedUsers = localStorage.getItem(USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : initialUsers;
}

function getCredentials() {
  const storedCredentials = localStorage.getItem(CREDENTIALS_KEY);
  return storedCredentials ? JSON.parse(storedCredentials) : {};
}

export function loginUser(email, password) {
  if (!email.trim() || !password) {
    throw new Error("Įveskite el. paštą ir slaptažodį.");
  }

  // Administratoriaus prisijungimas
  if (
    email.trim().toLowerCase() === demoAdmin.email &&
    password === demoAdmin.password
  ) {
    const adminProfile = {
  id: demoAdmin.id,
  firstName: demoAdmin.firstName,
  lastName: demoAdmin.lastName,
  email: demoAdmin.email,
  role: demoAdmin.role,
};

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(adminProfile)
    );

    return adminProfile;
  }

  let users;
  let credentials;

  try {
    users = getUsers();
    credentials = getCredentials();
  } catch {
    throw new Error("Nepavyko nuskaityti naudotojų duomenų.");
  }

  if (!Array.isArray(users) || !credentials || typeof credentials !== "object") {
    throw new Error("Naudotojų duomenys yra netinkamo formato.");
  }

  const user = users.find(
    (item) =>
      item.email?.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user || credentials[user.email] !== password) {
    // Suderinamumas su pradine demonstracine paskyra
    const initialUser = initialUsers.find(
      (item) =>
        item.email?.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!initialUser) {
      throw new Error("Neteisingas el. paštas arba slaptažodis.");
    }
  }

  const loggedInUser = {
    id: user?.id ?? initialUsers.find(
      (item) => item.email?.toLowerCase() === email.trim().toLowerCase()
    )?.id,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? email.trim(),
    role: user?.role ?? "customer",
  };

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(loggedInUser)
  );

  return loggedInUser;
}

export function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}