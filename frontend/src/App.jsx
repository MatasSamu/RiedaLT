import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Reservations from "./pages/ReservationPage/Reservations";
import ReservationDetails from "./pages/ReservationPage/ReservationDetails";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
