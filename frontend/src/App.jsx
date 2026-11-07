import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import "./App.css";

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
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
        <Route path="/reservations/new" element={<ReservationForm />} />
        <Route path="/reservations/:id/edit" element={<ReservationEdit />} />
        <Route path="/employee/cars" element={<EmployeeCars />} />
        <Route path="/admin/discount-codes" element={<AdminDiscountCodes />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
