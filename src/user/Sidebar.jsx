import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const handleResize = () => setToggle(window.innerWidth <= 1024);
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
      if (matchedRoute) navigate(matchedRoute.path);
      else alert("No matching page found. Please try a different search term.");
    }, 400);
  };

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    const titles = {
      dashboard: "Dashboard",
      flights: "Flight Search",
      "flight-details": "Flight Details",
      "change-password": "Change Password",
      bookings: "Booking",
      mybooking: "My Booking",
      payments: "Payment",
      settings: "System Settings",
      profile: "My Profile",
      myprofile: "My Profile",
    };
    return titles[path] || "Dashboard";
  };

  const navItems = [
    { to: "/user/dashboard", icon: "fas fa-th-large", label: "Dashboard" },
    { to: "/user/myprofile", icon: "fas fa-user-circle", label: "My Profile" },
    { to: "/user/mybooking", icon: "fas fa-ticket-alt", label: "My Booking" },
  ];

  const initials = currentUser?.fullname
    ? currentUser.fullname.charAt(0).toUpperCase()
    : "U";

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ard-bg: #070d1a;
      --ard-surface: #0f1629;
      --ard-surface2: #162038;
      --ard-border: rgba(255,255,255,0.07);
      --ard-accent: #3b82f6;
      --ard-accent2: #06b6d4;
      --ard-glow: rgba(59,130,246,0.3);
      --ard-text: #eef2ff;
      --ard-muted: #6b7fa3;
      --ard-danger: #ef4444;
      --ard-success: #22c55e;
      --ard-warning: #f59e0b;
      --ard-sidebar-w: 264px;
      --ard-nav-h: 66px;
      --ard-radius: 12px;
      --ard-font-h: 'Syne', sans-serif;
      --ard-font-b: 'DM Sans', sans-serif;
      --ard-ease: 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body { font-family: var(--ard-font-b); }

    /* ---- WRAPPER ---- */
    #ard-root {
      display: flex;
      min-height: 100vh;
      background: var(--ard-bg);
      color: var(--ard-text);
      position: relative;
    }

    /* ---- SIDEBAR ---- */
    #ard-sidebar {
      width: var(--ard-sidebar-w);
      height: 100vh;
      position: fixed;
      top: 0; left: 0;
      display: flex;
      flex-direction: column;
      background: var(--ard-surface);
      border-right: 1px solid var(--ard-border);
      z-index: 200;
      transition: transform var(--ard-ease);
      overflow: hidden;
    }

    #ard-sidebar::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--ard-accent), var(--ard-accent2));
    }

    /* Brand */
    .ard-brand {
      padding: 20px 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--ard-border);
    }

    .ard-brand-logo {
      width: 42px; height: 42px;
      border-radius: 11px;
      background: linear-gradient(135deg, var(--ard-accent), var(--ard-accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 19px;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 4px 18px var(--ard-glow);
    }

    .ard-brand-logo i {
      display: inline-block;
      animation: ard-rock 3s ease-in-out infinite;
    }

    .ard-brand-info h3 {
      font-family: var(--ard-font-h);
      font-size: 16px; font-weight: 800;
      color: var(--ard-text);
      letter-spacing: 0.01em;
      line-height: 1;
    }

    .ard-brand-info p {
      font-size: 10px;
      color: var(--ard-muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 3px;
    }

    /* Sidebar user */
    .ard-s-user {
      margin: 14px 14px 6px;
      padding: 13px 14px;
      background: var(--ard-surface2);
      border-radius: var(--ard-radius);
      border: 1px solid var(--ard-border);
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .ard-av {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ard-accent), var(--ard-accent2));
      display: flex; align-items: center; justify-content: center;
      font-family: var(--ard-font-h);
      font-size: 15px; font-weight: 700;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 2px 10px var(--ard-glow);
    }

    .ard-av-xs { width: 30px; height: 30px; font-size: 12px; }
    .ard-av-sm { width: 34px; height: 34px; font-size: 13px; }

    .ard-s-user-info h6 {
      font-family: var(--ard-font-h);
      font-size: 13px; font-weight: 700;
      color: var(--ard-text);
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 148px;
    }

    .ard-s-user-info span {
      font-size: 11px;
      color: var(--ard-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 148px;
      display: block;
    }

    /* Nav */
    .ard-nav {
      flex: 1;
      padding: 10px 10px 0;
      overflow-y: auto;
    }

    .ard-nav::-webkit-scrollbar { width: 3px; }
    .ard-nav::-webkit-scrollbar-thumb { background: var(--ard-surface2); border-radius: 3px; }

    .ard-nav-sec-label {
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ard-muted);
      padding: 10px 12px 6px;
    }

    .ard-link {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 12px;
      border-radius: 9px;
      color: var(--ard-muted);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      transition: all var(--ard-ease);
      margin-bottom: 2px;
      position: relative;
    }

    .ard-link:hover {
      color: var(--ard-text);
      background: var(--ard-surface2);
    }

    .ard-link.active {
      color: #fff;
      background: linear-gradient(90deg, rgba(59,130,246,0.22), rgba(6,182,212,0.08));
      border: 1px solid rgba(59,130,246,0.25);
    }

    .ard-link.active::before {
      content: '';
      position: absolute;
      left: 0; top: 20%; bottom: 20%;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: linear-gradient(180deg, var(--ard-accent), var(--ard-accent2));
    }

    .ard-link i {
      width: 18px;
      text-align: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .ard-link.active i { color: var(--ard-accent2); }
    .ard-link:hover i { color: var(--ard-accent); }

    .ard-link-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--ard-accent2);
      box-shadow: 0 0 5px var(--ard-accent2);
      margin-left: auto;
    }

    /* Sidebar footer */
    .ard-s-footer {
      padding: 12px 14px 18px;
      border-top: 1px solid var(--ard-border);
    }

    .ard-s-logout {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 14px;
      background: transparent;
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 9px;
      color: var(--ard-danger);
      font-family: var(--ard-font-b);
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--ard-ease);
    }

    .ard-s-logout:hover {
      background: rgba(239,68,68,0.1);
      border-color: var(--ard-danger);
    }

    /* ---- MAIN AREA ---- */
    #ard-main {
      flex: 1;
      margin-left: var(--ard-sidebar-w);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left var(--ard-ease);
    }

    /* ---- TOPNAV ---- */
    #ard-topnav {
      height: var(--ard-nav-h);
      background: var(--ard-surface);
      border-bottom: 1px solid var(--ard-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 22px;
      position: sticky;
      top: 0;
      z-index: 100;
      gap: 14px;
    }

    .ard-topnav-l {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
      min-width: 0;
    }

    .ard-ham {
      width: 36px; height: 36px;
      border-radius: 9px;
      background: var(--ard-surface2);
      border: 1px solid var(--ard-border);
      color: var(--ard-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 14px;
      transition: all var(--ard-ease);
      flex-shrink: 0;
    }

    .ard-ham:hover { color: var(--ard-text); border-color: var(--ard-accent); background: rgba(59,130,246,0.08); }

    .ard-ptitle {
      font-family: var(--ard-font-h);
      font-size: 17px;
      font-weight: 700;
      color: var(--ard-text);
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .ard-ptitle i { color: var(--ard-accent2); font-size: 15px; }

    /* Search */
    .ard-search {
      display: flex;
      align-items: center;
      background: var(--ard-surface2);
      border: 1px solid var(--ard-border);
      border-radius: 9px;
      padding: 0 11px;
      max-width: 260px;
      flex: 1;
      transition: border-color var(--ard-ease), box-shadow var(--ard-ease);
    }

    .ard-search:focus-within {
      border-color: var(--ard-accent);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    }

    .ard-search i { color: var(--ard-muted); font-size: 12px; flex-shrink: 0; }

    .ard-search input {
      background: transparent; border: none; outline: none;
      color: var(--ard-text);
      font-family: var(--ard-font-b);
      font-size: 13px;
      padding: 9px 8px;
      width: 100%;
    }

    .ard-search input::placeholder { color: var(--ard-muted); }

    .ard-search-x {
      background: none; border: none;
      color: var(--ard-muted);
      cursor: pointer;
      font-size: 11px;
      flex-shrink: 0;
      transition: color var(--ard-ease);
    }
    .ard-search-x:hover { color: var(--ard-text); }

    /* Topnav right */
    .ard-topnav-r {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      position: relative;
    }

    /* Icon btn */
    .ard-icon-btn {
      position: relative;
      width: 36px; height: 36px;
      background: var(--ard-surface2);
      border: 1px solid var(--ard-border);
      border-radius: 9px;
      color: var(--ard-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 14px;
      transition: all var(--ard-ease);
    }

    .ard-icon-btn:hover { color: var(--ard-text); border-color: var(--ard-accent); background: rgba(59,130,246,0.08); }

    .ard-badge {
      position: absolute;
      top: -4px; right: -4px;
      min-width: 17px; height: 17px;
      background: var(--ard-danger);
      border-radius: 9px;
      font-size: 10px; font-weight: 700;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid var(--ard-surface);
      padding: 0 3px;
    }

    /* Dropdowns */
    .ard-drop {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: var(--ard-surface);
      border: 1px solid var(--ard-border);
      border-radius: var(--ard-radius);
      box-shadow: 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.05);
      z-index: 400;
      animation: ard-fd 0.18s ease;
      overflow: hidden;
    }

    .ard-notif-drop { width: 300px; right: 44px; }
    .ard-prof-drop { width: 230px; }

    .ard-drop-head {
      padding: 13px 15px;
      border-bottom: 1px solid var(--ard-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ard-drop-head h6 {
      font-family: var(--ard-font-h);
      font-size: 13px; font-weight: 700;
      color: var(--ard-text);
      display: flex; align-items: center; gap: 7px;
    }

    .ard-drop-head h6 i { color: var(--ard-accent2); }

    .ard-mark-all {
      background: none; border: none;
      color: var(--ard-accent);
      font-size: 11.5px;
      cursor: pointer;
      font-family: var(--ard-font-b);
      font-weight: 500;
    }

    .ard-notif-empty {
      padding: 30px 15px;
      text-align: center;
      color: var(--ard-muted);
      font-size: 13px;
    }

    .ard-notif-empty i { font-size: 26px; display: block; margin-bottom: 10px; opacity: 0.35; }

    .ard-drop-foot {
      padding: 11px 15px;
      border-top: 1px solid var(--ard-border);
      text-align: center;
    }

    .ard-drop-foot a {
      color: var(--ard-accent);
      font-size: 12.5px;
      text-decoration: none;
      font-weight: 500;
    }

    /* Profile button */
    .ard-prof-btn {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 4px 10px 4px 4px;
      background: var(--ard-surface2);
      border: 1px solid var(--ard-border);
      border-radius: 30px;
      cursor: pointer;
      transition: all var(--ard-ease);
      user-select: none;
    }

    .ard-prof-btn:hover, .ard-prof-btn.open {
      border-color: var(--ard-accent);
      background: rgba(59,130,246,0.07);
    }

    .ard-prof-name {
      font-size: 13px; font-weight: 500;
      color: var(--ard-text);
      max-width: 110px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .ard-prof-chevron {
      font-size: 10px; color: var(--ard-muted);
      transition: transform var(--ard-ease);
    }

    .ard-prof-btn.open .ard-prof-chevron { transform: rotate(180deg); }

    /* Dropdown items */
    .ard-di {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 15px;
      color: var(--ard-muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all var(--ard-ease);
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-family: var(--ard-font-b);
    }

    .ard-di:hover { background: var(--ard-surface2); color: var(--ard-text); }
    .ard-di i { width: 15px; text-align: center; flex-shrink: 0; }

    .ard-di-danger { color: var(--ard-danger) !important; }
    .ard-di-danger:hover { background: rgba(239,68,68,0.09) !important; }

    .ard-divider { height: 1px; background: var(--ard-border); margin: 3px 0; }

    .ard-drop-user {
      padding: 13px 15px;
      border-bottom: 1px solid var(--ard-border);
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .ard-drop-user-info h6 {
      font-family: var(--ard-font-h);
      font-size: 13.5px; font-weight: 700;
      color: var(--ard-text);
    }

    .ard-drop-user-info span {
      font-size: 11px; color: var(--ard-muted);
    }

    /* ---- CONTENT ---- */
    #ard-content {
      flex: 1;
      padding: 26px;
      background: var(--ard-bg);
    }

    /* ---- TOGGLED STATE ---- */
    #ard-root.toggled #ard-sidebar { transform: translateX(-100%); }
    #ard-root.toggled #ard-main { margin-left: 0; }

    /* Mobile overlay */
    .ard-mob-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 150;
      backdrop-filter: blur(3px);
      cursor: pointer;
    }

    @media (max-width: 1024px) {
      #ard-root:not(.toggled) .ard-mob-overlay { display: block; }
    }

    @media (max-width: 768px) {
      .ard-ptitle span { display: none; }
      .ard-search { max-width: 180px; }
      .ard-prof-name { display: none; }
      #ard-content { padding: 16px; }
      .ard-notif-drop { right: 0; width: 280px; }
    }

    @media (max-width: 480px) {
      #ard-topnav { padding: 0 12px; }
      .ard-search { display: none; }
      .ard-notif-drop { width: 260px; }
    }

    /* ---- LOADING ---- */
    .ard-loader {
      position: fixed; inset: 0;
      background: rgba(7,13,26,0.82);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
    }

    .ard-spin {
      width: 46px; height: 46px;
      border: 3px solid rgba(59,130,246,0.18);
      border-top-color: var(--ard-accent);
      border-radius: 50%;
      animation: ard-spin 0.75s linear infinite;
    }

    .ard-loader-txt {
      margin-top: 14px;
      color: var(--ard-muted);
      font-size: 13px;
      letter-spacing: 0.06em;
    }

    /* ---- ANIMATIONS ---- */
    @keyframes ard-rock {
      0%, 100% { transform: rotate(-15deg) translateX(0); }
      50%       { transform: rotate(-15deg) translateX(3px); }
    }

    @keyframes ard-fd {
      from { opacity: 0; transform: translateY(-7px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes ard-spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div
        id="ard-root"
        className={toggle ? "toggled" : ""}
        onClick={(e) => {
          if (profileOpen && !e.target.closest(".ard-topnav-r"))
            setProfileOpen(false);
          if (notificationsOpen && !e.target.closest(".ard-topnav-r"))
            setNotificationsOpen(false);
        }}
      >
        {/* ===== SIDEBAR ===== */}
        <div id="ard-sidebar">
          {/* Brand */}
          <div className="ard-brand">
            <div className="ard-brand-logo">
              <i className="fas fa-plane"></i>
            </div>
            <div className="ard-brand-info">
              <h3>SkyReserve</h3>
              <p>Airlines Portal</p>
            </div>
          </div>

          {/* User card */}
          <div className="ard-s-user">
            <div className="ard-av">{initials}</div>
            <div className="ard-s-user-info">
              <h6>{currentUser?.fullname || "User Name"}</h6>
              <span>{currentUser?.email || "user@gmail.com"}</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="ard-nav">
            <div className="ard-nav-sec-label">Main Menu</div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `ard-link${isActive ? " active" : ""}`
                }
                onClick={() => {
                  if (window.innerWidth <= 1024) setToggle(true);
                }}
              >
                <i className={item.icon}></i>
                {item.label}
                {location.pathname.endsWith(item.to.split("/").pop()) && (
                  <span className="ard-link-dot"></span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <div className="ard-s-footer">
            <button className="ard-s-logout" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        <div className="ard-mob-overlay" onClick={() => setToggle(true)} />

        {/* ===== MAIN ===== */}
        <div id="ard-main">
          {/* Topnav */}
          <nav id="ard-topnav">
            <div className="ard-topnav-l">
              <button
                className="ard-ham"
                onClick={() => setToggle(!toggle)}
                aria-label="Toggle sidebar"
              >
                <i className={`fas fa-${toggle ? "bars" : "times"}`}></i>
              </button>

              <div className="ard-ptitle">
                <i className="fas fa-plane-departure"></i>
                <span>{getPageTitle()}</span>
              </div>

              <form className="ard-search" onSubmit={handleSearch}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search flights, bookings…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="ard-search-x"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </form>
            </div>

            <div className="ard-topnav-r">
              {/* Bell */}
              <button
                className="ard-icon-btn"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="ard-badge">{unreadCount}</span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="ard-drop ard-notif-drop">
                  <div className="ard-drop-head">
                    <h6>
                      <i className="fas fa-bell"></i>
                      Notifications
                    </h6>
                    {unreadCount > 0 && (
                      <button className="ard-mark-all" onClick={markAllAsRead}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="ard-notif-empty">
                      <i className="fas fa-bell-slash"></i>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: "11px 15px",
                          background: !n.read
                            ? "rgba(59,130,246,0.06)"
                            : "transparent",
                          cursor: "pointer",
                          borderBottom: "1px solid var(--ard-border)",
                        }}
                        onClick={() => handleNotificationClick(n.id)}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--ard-text)",
                            marginBottom: 3,
                          }}
                        >
                          {n.message}
                        </p>
                        <span
                          style={{ fontSize: 11, color: "var(--ard-muted)" }}
                        >
                          {n.time}
                        </span>
                      </div>
                    ))
                  )}

                  <div className="ard-drop-foot">
                    <NavLink
                      to="/user/notifications"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all notifications
                    </NavLink>
                  </div>
                </div>
              )}

              {/* Profile button */}
              <div
                className={`ard-prof-btn${profileOpen ? " open" : ""}`}
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="ard-av ard-av-xs">{initials}</div>
                <span className="ard-prof-name">
                  {currentUser?.fullname || "User"}
                </span>
                <i className="fas fa-chevron-down ard-prof-chevron"></i>
              </div>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="ard-drop ard-prof-drop">
                  <div className="ard-drop-user">
                    <div className="ard-av ard-av-sm">{initials}</div>
                    <div className="ard-drop-user-info">
                      <h6>{currentUser?.fullname || "User"}</h6>
                      <span>{currentUser?.email || "user@gmail.com"}</span>
                    </div>
                  </div>

                  <NavLink
                    to="/user/myprofile"
                    className="ard-di"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-user-circle"></i>My Profile
                  </NavLink>
                  <NavLink
                    to="/user/change-password"
                    className="ard-di"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-key"></i>Change Password
                  </NavLink>
                  <NavLink
                    to="/user/settings"
                    className="ard-di"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-cog"></i>Settings
                  </NavLink>

                  <div className="ard-divider"></div>

                  <button className="ard-di ard-di-danger" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Page content */}
          <div id="ard-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="ard-loader">
          <div className="ard-spin"></div>
          <p className="ard-loader-txt">Searching…</p>
        </div>
      )}
    </>
  );
};

export default Sidebar;
