import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NewLandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FAQs from "./components/FAQs";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/ContactUs";

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

import UserRoute from "./components/UserRoute";
// import User from "./user/User";
import Dashboard from "./user/Dashboard";
import FlightSearch from "./user/FlightSearchForm";
import Sidebar from "./user/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
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

        {/* User */}
        <Route
          path="/user"
          element={
            <UserRoute>
              {/* <User /> */}
              <Sidebar></Sidebar>
            </UserRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="flights" element={<FlightSearch/>}/>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
