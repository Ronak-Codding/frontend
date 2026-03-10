import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useTheme } from "../components/ThemeContext";

const Sidebar = () => {
  const [toggle, setToggle] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    const demoNotifications = [];

    setNotifications(demoNotifications);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setToggle(true);
      } else {
        setToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    setLoading(true);

    const routes = [
      { keywords: ["flight", "flights"], path: "/user/flights" },
      { keywords: ["booking", "bookings"], path: "/user/bookings" },
      { keywords: ["passenger", "passengers"], path: "/user/passengers" },
      { keywords: ["payment", "payments"], path: "/user/payments" },
    ];

    const matchedRoute = routes.find((route) =>
      route.keywords.some((key) => query.includes(key)),
    );

    setTimeout(() => {
      setLoading(false);
      setSearchQuery("");

      if (matchedRoute) {
        navigate(matchedRoute.path);
      } else {
        alert("No matching page found. Please try a different search term.");
      }
    }, 400);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);
  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    const titles = {
      dashboard: "Dashboard",
      flights: "Flight Search",
      "flight-details": "Flight Details",
      "change-password": "Change Password",
      bookings: "Booking",
      payments: "Payment",
      settings: "System Settings",
      profile: "My Profile",
    };
    return titles[path] || "Dashboard";
  };

  return (
    <>
      <div
        className={`d-flex ${toggle ? "toggled" : ""} ${darkMode ? "user-dark" : "user-light"}`}
        id="wrapper"
      >
        {/* ========== SIDEBAR ========== */}
        <div id="user-sidebar">
          <div className="user-sidebar-heading text-center py-3">
            {/* <h2>User Panel</h2> */}
            {/* <small className="text-muted">Management System</small> */}
          </div>
          <div className="user-sidebar-profile">
            <div className="sidebar-profile-avatar">
              {currentUser?.fullname
                ? currentUser.fullname.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="sidebar-profile-info">
              <h6>{currentUser?.fullname || "User Name"}</h6>
              <span>{currentUser?.email || "user@gmail.com"}</span>
            </div>
          </div>

          <div className="user-list-group list-group-flush">
            <NavLink to="/user/dashboard" className="user-list-group-item">
              <i className="fas fa-tachometer-alt"></i>Dashboard
            </NavLink>

            <NavLink to="/user/myprofile" className="user-list-group-item">
              <i className="fas fa-user"></i> My Profile
            </NavLink>
            <NavLink to="/user/mybooking" className="user-list-group-item">
              <i className="fas fa-ticket-alt"></i> My Booking
            </NavLink>

            {/* <NavLink to="/user/passenger" className="user-list-group-item">
              <i className="fas fa-user"></i> Passenger
            </NavLink> */}
            {/* <NavLink to="/user/profile" className="user-list-group-item">
              <i className="fas fa-user"></i> Profile
            </NavLink> */}
            {/* <NavLink to="/user/seat-selection" className="user-list-group-item">
                 <i className="fas fa-chair"></i> Seat Selection
            </NavLink> */}
            {/* <NavLink to="/user/bookings" className="user-list-group-item">
              <i className="fas fa-ticket-alt"></i> Booking
            </NavLink> */}

            {/* <NavLink to="/user/payments" className="user-list-group-item">
              <i className="fas fa-money-bill-wave"></i>Payment
            </NavLink> */}

            {/* <NavLink to="/user/settings" className="user-list-group-item">
              <i className="fas fa-cog"></i>Setting
            </NavLink> */}

            <div className="mt-auto p-3 border-top">
              {/* <div className="d-flex align-items-center justify-content-between mb-2">
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
              </div> */}
              <button
                className="w-full py-2 px-4 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>

        {/* ========== PAGE CONTENT ========== */}
        <div id="page-content-wrapper">
          {/* UPDATED TOP NAV */}
          <nav className="navbar user-navbar">
            {/* LEFT SECTION */}
            <div className="user-navbar-left">
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
                    placeholder="Search flights, bookings..."
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
            <div className="user-navbar-right">
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
                      {notifications.length === 0 ? (
                        <div className="text-center p-3 text-muted">
                          No notifications available
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`notification-item ${
                              !notification.read ? "unread" : ""
                            }`}
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
                        ))
                      )}
                    </div>

                    <div className="notifications-footer">
                      <NavLink
                        to="/user/notifications"
                        className="view-all-link"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div
                className={`user-top-profile ${profileOpen ? "active" : ""}`}
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="user-profile-img">
                  {currentUser?.fullname
                    ? currentUser.fullname.charAt(0).toUpperCase()
                    : "U"}
                </div>

                {/* <div className="user-profile-info">
                  <span className="user-profile-name">Guest</span>
                  <span className="user-profile-role">Super Guest</span>
                </div>
                <i className="fas fa-chevron-down user-profile-arrow"></i> */}
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="user-profile-dropdown-right">
                  <div className="dropdown-header">
                    <div className="user-profile-img">
                      {currentUser?.fullname
                        ? currentUser.fullname.charAt(0).toUpperCase()
                        : "U"}
                    </div>

                    <div className="dropdown-header-info">
                      <h6>{currentUser?.fullname || "User"}</h6>
                      <span>{currentUser?.email || "user@gmail.com"}</span>
                    </div>
                  </div>
                  <NavLink
                    to="/user/profile"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-user me-2"></i>My Profile
                  </NavLink>
                  <NavLink
                    to="/user/change-password"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-key me-2"></i>Change Password
                  </NavLink>
                  <NavLink
                    to="/user/settings"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-cog me-2"></i>Settings
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <button
                    className={`flex items-center px-5 py-3 w-full text-left text-md font-medium text-red-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border-none bg-transparent`}
                    onClick={logout}
                  >
                    <i className="fas fa-sign-out-alt w-5 mr-3 text-red-500"></i>
                    Logout
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

export default Sidebar;
