import React, { useEffect, useState } from "react";
import {
  Ticket,
  Search,
  Eye,
  XCircle,
  Plane,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import "./UserLayout.css";
import "./UserPages.css";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const perPage = 8;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/booking/my-bookings/${user.email}`,
      );
      if (res.ok) setBookings(await res.json());
    } catch {
      showNotification("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email) fetchBookings();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      !search ||
      (b.bookingId || b._id)?.toLowerCase().includes(search.toLowerCase()) ||
      b.flightNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.from?.toLowerCase().includes(search.toLowerCase()) ||
      b.to?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      b.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / perPage);
  const current = filteredBookings.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/booking/cancel/${bookingId}`,
        { method: "PUT" },
      );
      if (res.ok) {
        showNotification("Booking cancelled");
        fetchBookings();
      } else showNotification("Failed to cancel", "error");
    } catch {
      showNotification("Failed to cancel", "error");
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";
  const STATUS_CLASS = {
    confirmed: "up-badge-confirmed",
    Confirmed: "up-badge-confirmed",
    cancelled: "up-badge-cancelled",
    Cancelled: "up-badge-cancelled",
    pending: "up-badge-pending",
    Pending: "up-badge-pending",
  };

  return (
    <div>
      {/* Notification */}
      {notification.show && (
        <div
          className={`up-notification ${notification.type === "error" ? "up-notification-error" : "up-notification-success"}`}
        >
          {notification.message}
        </div>
      )}

      {/* View Modal */}
      {viewBooking && (
        <div className="pax-modal-overlay" onClick={() => setViewBooking(null)}>
          <div
            className="pax-modal pax-modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pax-modal-header">
              <div>
                <h2 className="pax-modal-title">Booking Details</h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  {viewBooking.bookingId ||
                    viewBooking._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                className="pax-modal-close"
                onClick={() => setViewBooking(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="pax-modal-body">
              <div className="ub-detail-grid">
                {[
                  [
                    "Booking ID",
                    viewBooking.bookingId ||
                      viewBooking._id?.slice(-8).toUpperCase(),
                  ],
                  ["Status", viewBooking.status],
                  ["Flight Number", viewBooking.flightNumber],
                  ["From", viewBooking.from || viewBooking.seats?.[0]],
                  ["To", viewBooking.to],
                  ["Passengers", viewBooking.passengers?.length || 1],
                  [
                    "Total Price",
                    `₹${viewBooking.totalPrice?.toLocaleString("en-IN") || "—"}`,
                  ],
                  ["Booked On", formatDate(viewBooking.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} className="ub-detail-row">
                    <span className="ub-detail-label">{label}</span>
                    <span className="ub-detail-value">{value || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Passengers List */}
              {viewBooking.passengers?.length > 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Passengers
                  </p>
                  <div className="ub-pax-list">
                    {viewBooking.passengers.map((p, i) => (
                      <div key={i} className="ub-pax-item">
                        <div className="ub-pax-avatar">
                          {p.fullName?.charAt(0) || i + 1}
                        </div>
                        <div>
                          <p className="ub-pax-name">{p.fullName}</p>
                          <p className="ub-pax-meta">
                            {p.gender} · {p.nationality}
                          </p>
                        </div>
                        <span className="ub-pax-seat">{p.seat || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="pax-modal-footer">
              {(viewBooking.status === "confirmed" ||
                viewBooking.status === "Confirmed") && (
                <button
                  className="up-btn-danger"
                  onClick={() => {
                    handleCancel(viewBooking._id);
                    setViewBooking(null);
                  }}
                >
                  <XCircle size={15} /> Cancel Booking
                </button>
              )}
              <button
                className="up-btn-secondary"
                onClick={() => setViewBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="up-header">
        <h1 className="up-title">My Bookings</h1>
        <p className="up-subtitle">Total: {bookings.length} bookings</p>
      </div>

      {/* Filters */}
      <div className="up-card" style={{ marginBottom: "1.25rem" }}>
        <div className="up-card-body" style={{ padding: "1rem 1.25rem" }}>
          <div className="ub-filter-row">
            <div className="ub-search-wrapper">
              <Search size={15} className="ub-search-icon" />
              <input
                type="text"
                placeholder="Search by booking ID, flight, route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ub-search-input"
              />
            </div>
            <select
              className="ub-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="up-card">
          <div className="up-empty">
            <div className="up-spinner" style={{ margin: "0 auto" }} />
            <p style={{ marginTop: "0.75rem" }}>Loading bookings...</p>
          </div>
        </div>
      ) : current.length === 0 ? (
        <div className="up-card">
          <div className="up-empty">
            <Ticket size={48} className="up-empty-icon" />
            <p>No bookings found</p>
          </div>
        </div>
      ) : (
        <div className="ub-list">
          {current.map((b, i) => (
            <div key={b._id || i} className="ub-card">
              <div className="ub-card-left">
                <div className="ub-plane-icon">
                  <Plane size={18} />
                </div>
                <div className="ub-card-info">
                  <div className="ub-card-route">
                    <span className="ub-route-city">{b.from || "—"}</span>
                    <span className="ub-route-arrow">→</span>
                    <span className="ub-route-city">{b.to || "—"}</span>
                  </div>
                  <div className="ub-card-meta">
                    <span>{b.bookingId || b._id?.slice(-8).toUpperCase()}</span>
                    <span>·</span>
                    <span>{b.flightNumber || "—"}</span>
                    <span>·</span>
                    <span>
                      {b.passengers?.length || 1} passenger
                      {(b.passengers?.length || 1) > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ub-card-right">
                <div style={{ textAlign: "right" }}>
                  <p className="ub-card-price">
                    ₹{b.totalPrice?.toLocaleString("en-IN") || "—"}
                  </p>
                  <p className="ub-card-date">{formatDate(b.createdAt)}</p>
                </div>
                <span
                  className={`up-badge ${STATUS_CLASS[b.status] || "up-badge-pending"}`}
                >
                  {b.status}
                </span>
                <div className="ub-actions">
                  <button
                    className="ub-action-btn ub-view-btn"
                    onClick={() => setViewBooking(b)}
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                  {(b.status === "confirmed" || b.status === "Confirmed") && (
                    <button
                      className="ub-action-btn ub-cancel-btn"
                      onClick={() => handleCancel(b._id)}
                      title="Cancel"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ub-pagination">
          <p className="ub-page-info">
            Showing {(currentPage - 1) * perPage + 1}–
            {Math.min(currentPage * perPage, filteredBookings.length)} of{" "}
            {filteredBookings.length}
          </p>
          <div className="ub-page-btns">
            <button
              className="ub-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`ub-page-btn ${currentPage === i + 1 ? "ub-page-btn-active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="ub-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
