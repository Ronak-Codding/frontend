import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const [toggle, setToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((c) => c.status === "new").length;
        setUnreadCount(unread);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    window.location.href = "/admin-login";
  };

  
//   const navigate = useNavigate();

// const logout = () => {
//   localStorage.removeItem("adminToken");
//   localStorage.removeItem("admin");
//   navigate("/admin-login", { replace: true });
// };

  return (
    <div
      className={`d-flex ${toggle ? "toggled" : ""} ${
        darkMode ? "dark" : "light"
      }`}
      id="wrapper"
    >
      {/* ========== SIDEBAR ========== */}
      <div id="sidebar-wrapper">
        <div className="sidebar-heading text-center py-3">
          <h2 className="">Admin Panel</h2>
        </div>

        <div className="list-group list-group-flush">
          <NavLink to="/admin/dashboard" className="list-group-item">
            <i className="fas fa-tachometer-alt me-2"></i>Dashboard
          </NavLink>

          <NavLink to="/admin/flights" className="list-group-item">
            <i className="fas fa-plane me-2"></i>All Flights
          </NavLink>

          <NavLink to="/admin/bookings" className="list-group-item">
            <i className="fas fa-ticket-alt me-2"></i>All Bookings
          </NavLink>

          <NavLink to="/admin/passengers" className="list-group-item">
            <i className="fas fa-users me-2"></i>Passengers
          </NavLink>

          <NavLink to="/admin/payments" className="list-group-item">
            <i className="fas fa-money-bill-wave me-2"></i>Payments
          </NavLink>

          {/* <NavLink to="/admin/aircrafts" className="list-group-item">
            <i className="fas fa-fighter-jet me-2"></i>Aircraft
          </NavLink> */}

          <NavLink to="/admin/airlines" className="list-group-item">
            <i className="fas fa-plane-departure me-2"></i>Airlines
          </NavLink>

          <NavLink to="/admin/airports" className="list-group-item">
            <i className="fas fa-map-marker-alt me-2"></i>Airports
          </NavLink>

          <NavLink to="/admin/users" className="list-group-item">
            <i className="fas fa-users me-2"></i>Users
          </NavLink>

          <NavLink
            to="/admin/contacts"
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fas fa-envelope me-2"></i>Contact Messages
            </span>

            {unreadCount > 0 && (
              <span className="badge bg-danger rounded-pill">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/admin/settings" className="list-group-item">
            <i className="fas fa-cog me-2"></i>Settings
          </NavLink>

          <span
            className="list-group-item text-danger"
            onClick={logout}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </span>
        </div>
      </div>

      {/* ========== PAGE CONTENT ========== */}
      <div id="page-content-wrapper">
        {/* TOP NAV */}
        <nav className="navbar px-4 border-bottom d-flex justify-content-between position-relative admin-navbar">
          {/* LEFT SIDE */}
          <div className="d-flex align-items-center gap-3">
            <i
              className="fas fa-bars fs-4 text-black"
              onClick={() => setToggle(!toggle)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3">
            {/* ADMIN PROFILE */}
            <div
              className="admin-top-profile d-flex align-items-center gap-2"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <i className="fas fa-user-circle fs-4"></i>
              <span>Admin</span>
              <i className="fas fa-chevron-down"></i>
            </div>

            {/* DARK MODE / SETTINGS */}
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setDarkMode(!darkMode)}
            >
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>
          </div>

          {/* PROFILE DROPDOWN */}
          {profileOpen && (
            <div className="admin-profile-dropdown-right">
              <NavLink to="/admin/profile" className="dropdown-item">
                <i className="fas fa-id-badge me-2"></i>My Profile
              </NavLink>

              <NavLink to="/admin/change-password" className="dropdown-item">
                <i className="fas fa-key me-2"></i>Change Password
              </NavLink>

              <NavLink to="/admin/change-password" className="dropdown-item">
                <i className="fas fa-bell me-2"></i>Notification
              </NavLink>

              <div className="dropdown-divider"></div>

              <span className="dropdown-item text-danger" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </span>
            </div>
          )}
        </nav>

        {/* MAIN CONTENT */}
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
