import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  CreditCard,
  Plane,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import "./UserLayout.css";
import "./UserPages.css";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, pRes] = await Promise.all([
          fetch(`http://localhost:5000/api/booking/my-bookings/${user.email}`),
          fetch(`http://localhost:5000/api/payments?email=${user.email}`),
        ]);
        if (bRes.ok) setBookings(await bRes.json());
        if (pRes.ok) setPayments(await pRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchData();
  }, []);

  const confirmed = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "Confirmed",
  ).length;
  const cancelled = bookings.filter(
    (b) => b.status === "cancelled" || b.status === "Cancelled",
  ).length;
  const totalSpent = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const STATS = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Ticket,
      color: "#667eea",
      bg: "rgba(102,126,234,0.1)",
      badge: "+new",
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: CheckCircle,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      badge: "active",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      badge: "total",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      icon: CreditCard,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      badge: "lifetime",
    },
  ];

  const STATUS_CLASS = {
    confirmed: "up-badge-confirmed",
    Confirmed: "up-badge-confirmed",
    cancelled: "up-badge-cancelled",
    Cancelled: "up-badge-cancelled",
    pending: "up-badge-pending",
    Pending: "up-badge-pending",
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div>
      {/* Welcome */}
      <div className="up-header">
        <h1 className="up-title">
          Welcome back, {user.firstName || "Traveller"} 
        </h1>
        <p className="up-subtitle">Here's your travel summary at a glance</p>
      </div>

      {/* Stats */}
      <div className="up-stats-grid">
        {STATS.map(({ label, value, icon: Icon, color, bg, badge }) => (
          <div key={label} className="up-stat-card">
            <div className="up-stat-top">
              <div className="up-stat-icon" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="up-stat-badge" style={{ background: bg, color }}>
                {badge}
              </span>
            </div>
            <div className="up-stat-value">{loading ? "—" : value}</div>
            <div className="up-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings + Quick Links */}
      <div className="up-grid-2">
        {/* Recent Bookings */}
        <div className="up-card">
          <div className="up-card-header">
            <h3 className="up-card-title">
              <Ticket size={16} /> Recent Bookings
            </h3>
            <Link to="/user/bookings" className="ud-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: "0.75rem 0" }}>
            {loading ? (
              <div className="up-empty">
                <div className="up-spinner" style={{ margin: "0 auto" }} />
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="up-empty">
                <Ticket size={40} className="up-empty-icon" />
                <p>No bookings yet</p>
                <Link to="/user/search" className="ud-cta-link">
                  Search Flights →
                </Link>
              </div>
            ) : (
              recentBookings.map((b, i) => (
                <div key={b._id || i} className="ud-booking-row">
                  <div className="ud-booking-icon">
                    <Plane size={16} style={{ color: "#667eea" }} />
                  </div>
                  <div className="ud-booking-info">
                    <p className="ud-booking-ref">
                      {b.bookingId || b._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="ud-booking-route">
                      {b.from || b.seats?.[0]} → {b.to}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      className={`up-badge ${STATUS_CLASS[b.status] || "up-badge-pending"}`}
                    >
                      {b.status}
                    </span>
                    <p className="ud-booking-date">{formatDate(b.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Quick Links */}
          <div className="up-card">
            <div className="up-card-header">
              <h3 className="up-card-title">
                <TrendingUp size={16} /> Quick Actions
              </h3>
            </div>
            <div className="up-card-body" style={{ padding: "1rem" }}>
              <div className="ud-quick-grid">
                {[
                  {
                    to: "/user/search",
                    icon: Plane,
                    label: "Search Flights",
                    color: "#667eea",
                    bg: "rgba(102,126,234,0.1)",
                  },
                  {
                    to: "/user/bookings",
                    icon: Ticket,
                    label: "My Bookings",
                    color: "#10b981",
                    bg: "rgba(16,185,129,0.1)",
                  },
                  {
                    to: "/user/payments",
                    icon: CreditCard,
                    label: "Payments",
                    color: "#f59e0b",
                    bg: "rgba(245,158,11,0.1)",
                  },
                  {
                    to: "/user/profile",
                    icon: Clock,
                    label: "Edit Profile",
                    color: "#a78bfa",
                    bg: "rgba(167,139,250,0.1)",
                  },
                ].map(({ to, icon: Icon, label, color, bg }) => (
                  <Link key={to} to={to} className="ud-quick-item">
                    <div className="ud-quick-icon" style={{ background: bg }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <span className="ud-quick-label">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Payment */}
          <div className="up-card">
            <div className="up-card-header">
              <h3 className="up-card-title">
                <CreditCard size={16} /> Recent Payments
              </h3>
              <Link to="/user/payments" className="ud-link">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ padding: "0.75rem 0" }}>
              {loading ? (
                <div className="up-empty">
                  <div className="up-spinner" style={{ margin: "0 auto" }} />
                </div>
              ) : payments.length === 0 ? (
                <div className="up-empty">
                  <p>No payments yet</p>
                </div>
              ) : (
                payments.slice(0, 3).map((p, i) => (
                  <div key={p._id || i} className="ud-payment-row">
                    <div className="ud-payment-info">
                      <p className="ud-payment-id">
                        {p.transactionId ||
                          "TXN-" + p._id?.slice(-6).toUpperCase()}
                      </p>
                      <p className="ud-payment-method">
                        {p.paymentMethod || p.method}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p className="ud-payment-amount">
                        ₹{p.amount?.toLocaleString("en-IN")}
                      </p>
                      <p className="ud-payment-date">
                        {formatDate(p.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
