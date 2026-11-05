import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Reservations from "./pages/ReservationPage/Reservations";
import ReservationDetails from "./pages/ReservationPage/ReservationDetails";
import ReservationForm from "./pages/ReservationPage/ReservationForm";
import ReservationEdit from "./pages/ReservationPage/ReservationEdit";
import Navbar from "./components/NavBar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
        <Route path="/reservations/new" element={<ReservationForm />} />
        <Route path="/reservations/:id/edit" element={<ReservationEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
