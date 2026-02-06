import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./User.css";

const User = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // FIX HERE
  // const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((c) => c.status === "new").length;
        setUnreadCount(unread);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      className={`admin-layout ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : ""}`}
    >
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`admin-sidebar 
    ${mobileOpen ? "mobile-open" : ""}`}
        onMouseEnter={() => window.innerWidth > 768}
        onMouseLeave={() => window.innerWidth > 768}
      >
        {mobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="sidebar-top">
          <div className="logo">
            <i className="fas fa-plane"></i>
          </div>
          {!collapsed && <h4>SkyJet</h4>}
          <i
            className="fas fa-angle-left collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          ></i>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/user/dashboard">
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/user/flights">
            <i className="fas fa-plane"></i>
            <span>Flights</span>
          </NavLink>

          <NavLink to="/user/bookings">
            <i className="fas fa-ticket-alt"></i>
            <span>Bookings</span>
          </NavLink>
          <NavLink to="/user/payments">
            <i className="fas fa-credit-card"></i>
            <span>Payments</span>
          </NavLink>
          <NavLink to="/user/certificates">
            <i className="fas fa-certificate"></i>
            <span>Certificates</span>
          </NavLink>

          <NavLink to="/user/notifications">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="notify-badge">{unreadCount}</span>
            )}
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            <span>Theme</span>
          </button>

          <button className="logout-btn" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="top-header">
          <h2 className="page-title">Dashboard</h2>

          <div className="header-actions">
            {/* SEARCH */}
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>

            {/* NOTIFICATION */}
            <div className="header-icon">
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="icon-badge">{unreadCount}</span>
              )}
            </div>

            {/* PROFILE */}
            <div
              className="header-profile"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <img src="https://i.pravatar.cc/40" alt="profile" />

              {profileOpen && (
                <div className="header-dropdown">
                  <NavLink to="/user/profile">
                    <i className="fas fa-user"></i> Profile
                  </NavLink>

                  <NavLink to="/user/settings">
                    <i className="fas fa-cog"></i> Settings
                  </NavLink>

                  <button onClick={logout} className="dropdown-logout">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <i className="fas fa-bars"></i>
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default User;
