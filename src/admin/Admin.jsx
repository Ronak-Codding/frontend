import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const [toggle, setToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("admin-dark-mode");
    return saved ? JSON.parse(saved) : false;
  });
  const [unreadCount, setUnreadCount] = useState(3);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Initialize theme
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("admin-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();

    // Auto-hide sidebar on mobile
    const handleResize = () => {
      if (window.innerWidth <= 1024 && !toggle) {
        setToggle(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  },  [toggle]);

  const fetchDashboardData = async () => {
    try {
      const contactsRes = await fetch("http://localhost:5000/api/contact/allContact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const contacts = await contactsRes.json();

      const unread = contacts.filter((c) => c.status === "new").length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setUnreadCount(3);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      // Implement search functionality
      setTimeout(() => {
        setLoading(false);
        console.log("Searching for:", searchQuery);
        // Here you would typically navigate to search results
      }, 1000);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/admin-login";
  };

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    const titles = {
      dashboard: "Dashboard",
      flights: "Flight Management",
      bookings: "Booking Management",
      passengers: "Passenger Management",
      payments: "Payment Management",
      airlines: "Airline Management",
      airports: "Airport Management",
      users: "User Management",
      contacts: "Contact Messages",
      reports: "Reports & Analytics",
      settings: "System Settings",
      profile: "My Profile",
    };
    return titles[path] || "Dashboard";
  };

  return (
    <>
      <div
        className={`d-flex ${toggle ? "toggled" : ""} ${darkMode ? "dark" : "light"}`}
        id="wrapper"
      >
        {/* ========== SIDEBAR ========== */}
        <div id="sidebar-wrapper">
          <div className="sidebar-heading text-center py-3">
            <h2> Admin Panel</h2>
            <small className="text-muted">Management System</small>
          </div>

          <div className="list-group list-group-flush">
            <NavLink to="/admin/dashboard" className="list-group-item">
              <i className="fas fa-tachometer-alt"></i>Dashboard
            </NavLink>

            <NavLink to="/admin/flights" className="list-group-item">
              <i className="fas fa-plane"></i> Flights
            </NavLink>

            <NavLink to="/admin/bookings" className="list-group-item">
              <i className="fas fa-ticket-alt"></i> Bookings
              <span className="badge bg-primary ms-auto">
                {/* {quickStats.totalBookings} */}
              </span>
            </NavLink>

            <NavLink to="/admin/passengers" className="list-group-item">
              <i className="fas fa-users"></i>Passengers
            </NavLink>

            <NavLink to="/admin/payments" className="list-group-item">
              <i className="fas fa-money-bill-wave"></i>Payments
            </NavLink>

            <NavLink to="/admin/airlines" className="list-group-item">
              <i className="fas fa-plane-departure"></i>Airlines
            </NavLink>

            <NavLink to="/admin/airports" className="list-group-item">
              <i className="fas fa-map-marker-alt"></i>Airports
            </NavLink>

            <NavLink to="/admin/users" className="list-group-item">
              <i className="fas fa-users"></i>Users
              <span className="badge bg-success ms-auto">
                {/* {quickStats.activeUsers} */}
              </span>
            </NavLink>

            <NavLink to="/admin/contacts" className="list-group-item">
              <i className="fas fa-envelope"></i>Contact Messages
              {unreadCount > 0 && (
                <span className="badge bg-danger ms-auto">{unreadCount}</span>
              )}
            </NavLink>

            <NavLink to="/admin/reports" className="list-group-item">
              <i className="fas fa-chart-bar"></i>Reports & Analytics
            </NavLink>

            <NavLink to="/admin/settings" className="list-group-item">
              <i className="fas fa-cog"></i>Settings
            </NavLink>

            <div className="mt-auto p-3 border-top">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <small className="text-muted">Dark Mode</small>
                <div
                  className="form-check form-switch"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => {}}
                  />
                </div>
              </div>
              <button className="btn btn-outline-danger w-100" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>

        {/* ========== PAGE CONTENT ========== */}
        <div id="page-content-wrapper">
          {/* UPDATED TOP NAV */}
          <nav className="navbar admin-navbar">
            {/* LEFT SECTION */}
            <div className="admin-navbar-left">
              {/* Sidebar Toggle */}
              <button
                className="sidebar-toggle"
                onClick={() => setToggle(!toggle)}
                aria-label="Toggle sidebar"
              >
                <i className="fas fa-bars"></i>
              </button>

              {/* Page Title */}
              <h1 className="page-title">
                <i className="fas fa-plane me-2"></i>
                <span>{getPageTitle()}</span>
              </h1>

              {/* Search Bar */}
              <div className="search-container">
                <form onSubmit={handleSearch} className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search flights, bookings, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="admin-navbar-right">
              {/* Notifications */}
              <div className="notification-container">
                <button
                  className="notification-bell"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="notifications-dropdown fade-in">
                    <div className="notifications-header">
                      <h6>
                        <i className="fas fa-bell me-2"></i>
                        Notifications
                      </h6>
                      {unreadCount > 0 && (
                        <button
                          className="mark-all-read"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.read ? "unread" : ""}`}
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                        >
                          <div className="notification-content">
                            <div
                              className={`notification-icon ${notification.type}`}
                            >
                              <i
                                className={`fas fa-${
                                  notification.type === "info"
                                    ? "info-circle"
                                    : notification.type === "success"
                                      ? "check-circle"
                                      : notification.type === "warning"
                                        ? "exclamation-triangle"
                                        : "times-circle"
                                }`}
                              ></i>
                            </div>
                            <div className="notification-details">
                              <p>{notification.message}</p>
                              <span className="notification-time">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="notifications-footer">
                      <NavLink
                        to="/admin/notifications"
                        className="view-all-link"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                className="theme-toggle-btn"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
              >
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              </button>

              {/* Admin Profile */}
              <div
                className={`admin-top-profile ${profileOpen ? "active" : ""}`}
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="admin-profile-img">A</div>
                <div className="admin-profile-info">
                  <span className="admin-profile-name">Administrator</span>
                  <span className="admin-profile-role">Super Admin</span>
                </div>
                <i className="fas fa-chevron-down admin-profile-arrow"></i>
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="admin-profile-dropdown-right">
                  <div className="dropdown-header">
                    <div className="admin-profile-img">A</div>
                    <div className="dropdown-header-info">
                      <h6>Administrator</h6>
                      <span>admin@flightmanagement.com</span>
                    </div>
                  </div>
                  <NavLink
                    to="/admin/profile"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-user me-2"></i>My Profile
                  </NavLink>
                  <NavLink
                    to="/admin/change-password"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-key me-2"></i>Change Password
                  </NavLink>
                  <NavLink
                    to="/admin/settings"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-cog me-2"></i>Settings
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item text-danger"
                    onClick={logout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* MAIN CONTENT */}
          <div className="container-fluid p-4">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="text-white mt-3">Processing...</div>
        </div>
      )}
    </>
  );
};

export default Admin;
