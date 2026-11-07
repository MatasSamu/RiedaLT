import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { getCurrentUser } from "./services/authService";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import EmployeeCars from "./pages/EmployeeCars";
import AdminDiscountCodes from "./pages/AdminDiscountCodes";
import Reservations from "./pages/ReservationPage/Reservations";
import ReservationDetails from "./pages/ReservationPage/ReservationDetails";
import ReservationForm from "./pages/ReservationPage/ReservationForm";
import ReservationEdit from "./pages/ReservationPage/ReservationEdit";
import Registration from "./pages/Registration";
import CarDetails from "./pages/CarSearchPage/CarDetails";
import CarComparison from "./pages/CarSearchPage/CarComparison";
import Navbar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import Reviews from "./pages/ReviewsPage/Reviews";
import "./App.css";

function RequireAuth({ children }) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/compare" element={<CarComparison />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/reservations"
          element={
            <RequireAuth>
              <Reservations />
            </RequireAuth>
          }
        />
        <Route
          path="/reservations/:id"
          element={
            <RequireAuth>
              <ReservationDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/reservations/new"
          element={
            <RequireAuth>
              <ReservationForm />
            </RequireAuth>
          }
        />
        <Route path="/reservations/:id/edit" element={<ReservationEdit />} />
        <Route path="/employee/cars" element={<EmployeeCars />} />
        <Route path="/admin/discount-codes" element={<AdminDiscountCodes />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
