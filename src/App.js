import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./components/ThemeContext";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./admin/Admin";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/AdminUsers";
import AdminContacts from "./admin/AdminContacts";
import Airlines from "./admin/Airlines";
import Airports from "./admin/Airports";
import Flights from "./admin/Flights";
import AdminBookings from "./admin/AdminBookings";
import Passengers from "./admin/Passengers";
import Payment from "./admin/Payment";

import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./components/ContactUs";
import FAQs from "./components/FAQs";
import About from "./components/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ThemeProvider storageKey="admin-theme">
                <Admin />
              </ThemeProvider>
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="airlines" element={<Airlines />} />
          <Route path="airports" element={<Airports />} />
          <Route path="flights" element={<Flights />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="passengers" element={<Passengers />} />
          <Route path="payments" element={<Payment />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
