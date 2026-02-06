import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NewLandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./admin/Admin";
import AdminRoute from "./pages/AdminRoute";
import UserRoute from "./pages/UserRoute";

import AdminDashboard from "./admin/AdminDashboard";
import Users from "./admin/AdminUsers";
import AdminContacts from "./admin/AdminContacts";

import User from "./user/User";

import Dashboard from "./user/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        </Route>

        {/* User */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <User />
            </UserRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
