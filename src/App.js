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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Contact from "./components/ContactUs";
import FAQs from "./components/FAQs";
import About from "./components/About";

import UserRoute from "./components/UserRoute";
import Dashboard from "./user/Dashboard";
import Sidebar from "./user/Sidebar";
import MyProfile from "./user/MyProfile";
import PrivacyPolicy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import Services from "./components/Services";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import Checkout from "./pages/Checkout";
import BookingConfirmation from "./pages/BookingConfirmation";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/termofservice" element={<TermsOfService />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/seats" element={<SeatSelection />} />
        <Route path="/passengers" element={<PassengerDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
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

        {/* User */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <ThemeProvider storageKey="user-theme">
                <Sidebar />
              </ThemeProvider>
            </UserRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="myprofile" element={<MyProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
