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
  RefreshCw,
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

  // ✅ Refund modal state
  const [refundModal, setRefundModal] = useState(false);
  const [refundBooking, setRefundBooking] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

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

  // ── Cancel Booking ──
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/booking/cancel/${bookingId}`,
        { method: "PUT" },
      );
      if (res.ok) {
        showNotification("Booking cancelled successfully");
        fetchBookings();
      } else showNotification("Failed to cancel", "error");
    } catch {
      showNotification("Failed to cancel", "error");
    }
  };

  // ── Open Refund Modal ──
  const openRefundModal = (booking) => {
    setRefundBooking(booking);
    setRefundReason("");
    setRefundModal(true);
    setViewBooking(null);
  };

  // ── Submit Refund Request ──
  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      showNotification("Refund reason required hai", "error");
      return;
    }
    setRefundLoading(true);
    try {
      // Payment find karo is booking ke liye
      const payRes = await fetch(
        `http://localhost:5000/api/payment?email=${encodeURIComponent(user.email)}&limit=100`,
      );
      const payData = await payRes.json();
      const payments = payData.payments || [];

      // Booking ID se match karo
      const matchedPayment = payments.find(
        (p) =>
          p.bookingId?.toString() === refundBooking._id?.toString() &&
          p.status === "success",
      );

      if (!matchedPayment) {
        showNotification("Is booking ka successful payment nahi mila", "error");
        setRefundLoading(false);
        return;
      }

      // Refund request submit karo
      const res = await fetch(
        `http://localhost:5000/api/payment/refund/${matchedPayment._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: refundReason,
            requestedBy: user.email,
          }),
        },
      );

      if (res.ok) {
        showNotification("✅ Refund request submitted! Admin review karega.");
        setRefundModal(false);
        setRefundBooking(null);
        fetchBookings();
      } else {
        showNotification("Refund request failed", "error");
      }
    } catch {
      showNotification("Refund request failed", "error");
    } finally {
      setRefundLoading(false);
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

  const REFUND_REASONS = [
    "Flight cancelled by airline",
    "Medical emergency",
    "Visa rejected",
    "Change of travel plans",
    "Duplicate booking",
    "Other",
  ];

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

      {/* ── Refund Request Modal ── */}
      {refundModal && refundBooking && (
        <div
          className="pax-modal-overlay"
          onClick={() => setRefundModal(false)}
        >
          <div
            className="pax-modal pax-modal-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pax-modal-header">
              <div>
                <h2 className="pax-modal-title">Request Refund</h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  {refundBooking.flightNumber} · {refundBooking.from} →{" "}
                  {refundBooking.to}
                </p>
              </div>
              <button
                className="pax-modal-close"
                onClick={() => setRefundModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="pax-modal-body">
              {/* Booking Info */}
              <div
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Amount
                  </span>
                  <span style={{ fontWeight: 700, color: "#f59e0b" }}>
                    ₹{refundBooking.totalPrice?.toLocaleString("en-IN") || "—"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Booked On
                  </span>
                  <span style={{ fontSize: "0.85rem" }}>
                    {formatDate(refundBooking.createdAt)}
                  </span>
                </div>
              </div>

              {/* Reason Select */}
              <div className="pax-form-group">
                <label className="pax-form-label">
                  Refund Reason <span className="pax-required">*</span>
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="pax-form-select"
                >
                  <option value="">Select reason...</option>
                  {REFUND_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom reason if Other */}
              {refundReason === "Other" && (
                <div
                  className="pax-form-group"
                  style={{ marginTop: "0.75rem" }}
                >
                  <label className="pax-form-label">Describe your reason</label>
                  <textarea
                    rows={3}
                    placeholder="Apna reason likho..."
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="pax-form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>
              )}

              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.75rem",
                  padding: "0.6rem",
                  background: "rgba(102,126,234,0.08)",
                  borderRadius: "0.5rem",
                }}
              >
                ℹ️ Refund request admin. It will take 3-5 business days to process. After approval, the amount will be automatically returned to the original payment method.
              </p>
            </div>

            <div className="pax-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setRefundModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleRefundRequest}
                disabled={refundLoading || !refundReason}
                style={{ background: "#f59e0b", borderColor: "#f59e0b" }}
              >
                {refundLoading ? (
                  <>
                    <div
                      className="users-spinner"
                      style={{ width: 16, height: 16, borderWidth: 2 }}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} /> Submit Refund Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Booking Modal ── */}
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
                  ["From", viewBooking.from],
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
              {/* Cancel button */}
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
              {/* Refund button - cancelled booking pe */}
              {(viewBooking.status === "cancelled" ||
                viewBooking.status === "Cancelled") && (
                <button
                  onClick={() => openRefundModal(viewBooking)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(245,158,11,0.15)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245,158,11,0.4)",
                    borderRadius: "0.6rem",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  <RefreshCw size={15} /> Request Refund
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
                  {/* View */}
                  <button
                    className="ub-action-btn ub-view-btn"
                    onClick={() => setViewBooking(b)}
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                  {/* Cancel - confirmed booking pe */}
                  {(b.status === "confirmed" || b.status === "Confirmed") && (
                    <button
                      className="ub-action-btn ub-cancel-btn"
                      onClick={() => handleCancel(b._id)}
                      title="Cancel Booking"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                  {/*  Refund - cancelled booking pe */}
                  {(b.status === "cancelled" || b.status === "Cancelled") && (
                    <button
                      className="ub-action-btn"
                      onClick={() => openRefundModal(b)}
                      title="Request Refund"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        color: "#f59e0b",
                        border: "1px solid rgba(245,158,11,0.3)",
                      }}
                    >
                      <RefreshCw size={15} />
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
