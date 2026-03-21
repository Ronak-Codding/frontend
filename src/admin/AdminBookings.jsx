import React, { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  Download,
  Search,
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import AddBookingModal from "./AddBookingModal";
import "./AdminTables.css";
import "./AdminUsers.css";
import "./AdminContacts.css";
import "./Bookings.css";

const BOOKING_STATUS_CLASS = {
  confirmed: "badge-confirmed",
  Confirmed: "badge-confirmed",
  cancelled: "badge-cancelled",
  Cancelled: "badge-cancelled",
  pending: "badge-pending",
  Pending: "badge-pending",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ── Export format state ──
  const [exportFormat, setExportFormat] = useState("csv");

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: bookingsPerPage,
        search: query,
        status: statusFilter,
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      const res = await fetch(
        `http://localhost:5000/api/booking?${params.toString()}`,
      );
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.pages || 1);
      setSelectedBookings([]);
      setSelectAll(false);
    } catch {
      showNotification("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, query, statusFilter, dateRange]);

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/booking/${id}`, {
        method: "DELETE",
      });
      showNotification("Booking deleted");
      fetchBookings(currentPage);
    } catch {
      showNotification("Failed to delete", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Checkbox handlers ──
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBookings([]);
      setSelectAll(false);
    } else {
      setSelectedBookings(bookings.map((b) => b._id));
      setSelectAll(true);
    }
  };

  const toggleBookingSelection = (id) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ── Bulk Delete ──
  const handleBulkDelete = async () => {
    if (!window.confirm(`${selectedBookings.length} bookings delete karo?`))
      return;
    setLoading(true);
    try {
      await Promise.all(
        selectedBookings.map((id) =>
          fetch(`http://localhost:5000/api/booking/${id}`, {
            method: "DELETE",
          }),
        ),
      );
      setSelectedBookings([]);
      setSelectAll(false);
      showNotification(`${selectedBookings.length} bookings deleted`);
      fetchBookings(currentPage);
    } catch {
      showNotification("Bulk delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Bulk Status Update ──
  const handleBulkStatus = async (status) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedBookings.map((id) =>
          fetch(`http://localhost:5000/api/booking/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          }),
        ),
      );
      setSelectedBookings([]);
      setSelectAll(false);
      showNotification(
        `${selectedBookings.length} bookings updated to ${status}`,
      );
      fetchBookings(currentPage);
    } catch {
      showNotification("Bulk update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Export (CSV + JSON) ──
  const exportBookings = async () => {
    if (exportFormat === "csv") {
      try {
        const res = await fetch("http://localhost:5000/api/booking/export/csv");
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        showNotification("CSV exported successfully");
      } catch {
        showNotification("Export failed", "error");
      }
    } else {
      // JSON export — current fetched bookings data
      const blob = new Blob([JSON.stringify(bookings, null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `bookings_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      showNotification(`${bookings.length} bookings exported as JSON`);
    }
  };

  const indexOfFirst = (currentPage - 1) * bookingsPerPage + 1;
  const indexOfLast = Math.min(currentPage * bookingsPerPage, totalCount);

  return (
    <div>
      {/* Loading */}
      {loading && (
        <div className="users-loading-overlay">
          <div className="users-loading-box">
            <div className="users-spinner" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`users-notification ${notification.type === "error" ? "users-notification-error" : "users-notification-success"}`}
        >
          {notification.message}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewBooking && (
        <div
          className="pax-modal-overlay"
          onClick={() => setShowViewModal(false)}
        >
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
                  {viewBooking.bookingRef}
                </p>
              </div>
              <button
                className="pax-modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="pax-modal-body">
              <div className="pax-detail-grid">
                {[
                  ["Booking Ref", viewBooking.bookingRef],
                  ["Passenger Name", viewBooking.userName],
                  ["Email", viewBooking.email],
                  ["Phone", viewBooking.phone],
                  ["Flight", viewBooking.flightNumber],
                  ["Route", `${viewBooking.from} → ${viewBooking.to}`],
                  ["Seats", viewBooking.seats?.join(", ") || "—"],
                  ["Passengers", viewBooking.passengersCount],
                  [
                    "Amount",
                    `₹${viewBooking.totalPrice?.toLocaleString("en-IN")}`,
                  ],
                  ["Status", viewBooking.status],
                  [
                    "Booked On",
                    new Date(viewBooking.createdAt).toLocaleString("en-IN"),
                  ],
                ].map(([label, value]) => (
                  <div className="pax-detail-row" key={label}>
                    <span className="pax-detail-label">{label}</span>
                    <span className="pax-detail-value">{value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pax-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings Management</h1>
          <p className="admin-page-subtitle">
            Total: <strong>{totalCount}</strong> | Filtered:{" "}
            <strong>{totalCount}</strong>
          </p>
        </div>
        <div className="admin-header-actions">
          {/* Export Format Select */}
          <select
            className="btn-export-select"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>

          {/* Export Button */}
          <button className="btn-export" onClick={exportBookings}>
            <Download size={16} /> Export
          </button>

          {/* Add Booking Button */}
          <button className="btn-add-user" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Booking
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="users-filter-card">
        <div className="contacts-filter-grid">
          <div
            className="admin-search-wrapper"
            style={{ gridColumn: "span 2" }}
          >
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by Reference / Name / Email / Flight..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="admin-input admin-input-search"
            />
          </div>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
          <div className="contacts-date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="admin-input"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedBookings.length > 0 && (
        <div className="users-bulk-bar">
          <span className="users-bulk-count">
            {selectedBookings.length} booking(s) selected
          </span>
          <div className="users-bulk-actions">
            <select
              onChange={(e) => handleBulkStatus(e.target.value)}
              className="users-bulk-select"
              defaultValue=""
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "white",
                fontSize: "0.8rem",
              }}
            >
              <option value="" disabled>
                Change Status
              </option>
              <option value="confirmed">Set Confirmed</option>
              <option value="cancelled">Set Cancelled</option>
              <option value="pending">Set Pending</option>
            </select>
            <button
              className="users-bulk-btn users-bulk-blocked"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
            <button
              className="users-bulk-btn users-bulk-clear"
              onClick={() => {
                setSelectedBookings([]);
                setSelectAll(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-table-container">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                {/* Select All Checkbox */}
                <th>
                  <button
                    onClick={handleSelectAll}
                    className="passengers-check-btn"
                  >
                    {selectAll ? (
                      <CheckSquare size={16} style={{ color: "#667eea" }} />
                    ) : (
                      <Square
                        size={16}
                        style={{ color: "var(--text-secondary)" }}
                      />
                    )}
                  </button>
                </th>
                <th>Booking Ref</th>
                <th>User</th>
                <th>Email</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Passengers</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Booked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={11} className="admin-table-empty">
                    <BookOpen size={48} className="admin-table-empty-icon" />
                    <p>No bookings found</p>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const isSelected = selectedBookings.includes(b._id);
                  return (
                    <tr
                      key={b._id}
                      style={
                        isSelected
                          ? { background: "rgba(102,126,234,0.08)" }
                          : {}
                      }
                    >
                      {/* Row Checkbox */}
                      <td>
                        <button
                          onClick={() => toggleBookingSelection(b._id)}
                          className="passengers-check-btn"
                        >
                          {isSelected ? (
                            <CheckSquare
                              size={16}
                              style={{ color: "#667eea" }}
                            />
                          ) : (
                            <Square
                              size={16}
                              style={{ color: "var(--text-secondary)" }}
                            />
                          )}
                        </button>
                      </td>
                      <td className="cell-accent">{b.bookingRef}</td>
                      <td>
                        <div className="admin-avatar-info">
                          <p className="admin-avatar-name">{b.userName}</p>
                        </div>
                      </td>
                      <td
                        className="cell-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {b.email}
                      </td>
                      <td>
                        <span className="airline-code-tag">
                          {b.flightNumber || "—"}
                        </span>
                      </td>
                      <td className="cell-muted">
                        {b.from} → {b.to}
                      </td>
                      <td>
                        <span className="booking-passengers-badge">
                          {b.passengersCount}
                        </span>
                      </td>
                      <td className="cell-success">
                        ₹{b.totalPrice?.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={
                            BOOKING_STATUS_CLASS[b.status] || "badge-pending"
                          }
                        >
                          {b.status || "confirmed"}
                        </span>
                      </td>
                      <td
                        className="cell-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="cell-actions">
                          <button
                            className="users-action-btn users-action-view"
                            title="View"
                            onClick={() => {
                              setViewBooking(b);
                              setShowViewModal(true);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="users-action-btn users-action-delete"
                            title="Delete"
                            onClick={() => deleteBooking(b._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <p className="admin-pagination-info">
            Showing {indexOfFirst}–{indexOfLast} of {totalCount}
          </p>
          <div className="admin-pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? "pagination-btn-active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAdd && (
        <AddBookingModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            fetchBookings(1);
            showNotification("Booking added successfully");
          }}
        />
      )}
    </div>
  );
};

export default AdminBookings;
