import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Plane,
  Bell,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import "./UserLayout.css";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("userTheme") === "dark",
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    document.body.className = darkMode ? "user-dark" : "user-light";
    localStorage.setItem("userTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) navigate("/login");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const NAV_ITEMS = [
    { path: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/user/bookings", label: "My Bookings", icon: Ticket },
    { path: "/user/payments", label: "Payment History", icon: CreditCard },
    { path: "/user/search", label: "Search Flights", icon: Search },
    { path: "/user/profile", label: "Profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="ul-root">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div className="ul-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`ul-sidebar ${sidebarOpen ? "ul-sidebar-open" : ""}`}>
        {/* Logo */}
        <div className="ul-sidebar-logo">
          <div className="ul-logo-icon">
            <Plane size={20} />
          </div>
          <span className="ul-logo-text">SkyJet</span>
          <button
            className="ul-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="ul-user-card">
          <div className="ul-user-avatar">
            {user.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="ul-user-info">
            <p className="ul-user-name">
              {user.firstName} {user.lastName}
            </p>
            <p className="ul-user-email">{user.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="ul-nav">
          <p className="ul-nav-label">Menu</p>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`ul-nav-item ${isActive(path) ? "ul-nav-item-active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive(path) && (
                <ChevronRight size={14} className="ul-nav-chevron" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="ul-sidebar-bottom">
          <button
            className="ul-theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button className="ul-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="ul-main">
        {/* Topbar */}
        <header className="ul-topbar">
          <button className="ul-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="ul-topbar-title">
            {NAV_ITEMS.find((n) => n.path === location.pathname)?.label ||
              "Dashboard"}
          </div>
          <div className="ul-topbar-right">
            <button
              className="ul-icon-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="ul-icon-btn">
              <Bell size={18} />
            </button>
            <div className="ul-topbar-avatar">
              {user.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="ul-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
