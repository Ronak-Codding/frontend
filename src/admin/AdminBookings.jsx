import React, { useEffect, useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Download,
  Search,
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
} from "lucide-react";
import AddBookingModal from "./AddBookingModal";
import "./AdminTables.css";
import "./AdminUsers.css";
import "./AdminContacts.css";
import "./Bookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "booking_date",
    direction: "desc",
  });
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

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
      const res = await fetch("http://localhost:5000/api/bookings/allBookings");
      const data = await res.json();
      setBookings(data);
    } catch {
      showNotification("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, dateRange]);

  useEffect(() => {
    if (!query.trim()) {
      fetchBookings();
      return;
    }
    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/search?q=${query}`,
        );
        setBookings(await res.json());
      } catch {
        showNotification("Search failed", "error");
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [query]);

  const filteredBookingsData = () =>
    bookings.filter((b) => {
      const matchesSearch =
        !query ||
        b.bookingReference?.toLowerCase().includes(query.toLowerCase()) ||
        `${b.user_id?.firstName} ${b.user_id?.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        b.user_id?.email?.toLowerCase().includes(query.toLowerCase()) ||
        b.flight_id?.flight_number?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      const matchesDate =
        !dateRange.start ||
        !dateRange.end ||
        (new Date(b.booking_date) >= new Date(dateRange.start) &&
          new Date(b.booking_date) <= new Date(dateRange.end));
      return matchesSearch && matchesStatus && matchesDate;
    });

  const sortedBookings = () => {
    return [...filteredBookingsData()].sort((a, b) => {
      let av = a[sortConfig.key],
        bv = b[sortConfig.key];
      if (sortConfig.key === "booking_date") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else if (sortConfig.key === "total_amount") {
        av = Number(av);
        bv = Number(bv);
      } else if (sortConfig.key === "user") {
        av = `${a.user_id?.firstName} ${a.user_id?.lastName}`;
        bv = `${b.user_id?.firstName} ${b.user_id?.lastName}`;
      } else if (sortConfig.key === "flight") {
        av = a.flight_id?.flight_number || "";
        bv = b.flight_id?.flight_number || "";
      }
      if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
      if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const requestSort = (key) =>
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  const SortIcon = ({ col }) =>
    sortConfig.key === col
      ? sortConfig.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const filteredAndSortedBookings = sortedBookings();
  const totalPages = Math.ceil(
    filteredAndSortedBookings.length / bookingsPerPage,
  );
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredAndSortedBookings.slice(
    indexOfFirst,
    indexOfLast,
  );

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
        method: "PUT",
      });
      showNotification("Booking cancelled");
      fetchBookings();
    } catch {
      showNotification("Failed to cancel", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (booking) => {
    const newPassengers = prompt(
      "Enter passenger count",
      booking.total_passengers,
    );
    if (!newPassengers) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/updateBooking/${booking._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total_passengers: Number(newPassengers) }),
        },
      );
      const data = await res.json();
      if (!res.ok) showNotification(data.message, "error");
      else {
        showNotification("Booking updated");
        fetchBookings();
      }
    } catch {
      showNotification("Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/bookings/deleteBooking/${id}`, {
        method: "DELETE",
      });
      showNotification("Booking deleted");
      fetchBookings();
    } catch {
      showNotification("Failed to delete", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedBookings.length} bookings?`)) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedBookings.map((id) =>
          fetch(`http://localhost:5000/api/bookings/deleteBooking/${id}`, {
            method: "DELETE",
          }),
        ),
      );
      setBookings(bookings.filter((b) => !selectedBookings.includes(b._id)));
      setSelectedBookings([]);
      showNotification(`${selectedBookings.length} bookings deleted`);
    } catch {
      showNotification("Failed to delete", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (!newStatus) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedBookings.map((id) =>
          fetch(`http://localhost:5000/api/bookings/updateBooking/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }),
        ),
      );
      await fetchBookings();
      setSelectedBookings([]);
      showNotification(
        `${selectedBookings.length} bookings updated to ${newStatus}`,
      );
    } catch {
      showNotification("Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  const exportBookings = () => {
    const data = filteredAndSortedBookings;
    if (exportFormat === "csv") {
      const headers = [
        "Booking Reference",
        "User Name",
        "Email",
        "Flight Number",
        "Route",
        "Passengers",
        "Total Amount",
        "Status",
        "Booking Date",
      ];
      const csv = [
        headers,
        ...data.map((b) => [
          b.bookingReference,
          `${b.user_id?.firstName || ""} ${b.user_id?.lastName || ""}`,
          b.user_id?.email || "",
          b.flight_id?.flight_number || "",
          `${b.flight_id?.from_airport?.airport_code || ""} → ${b.flight_id?.to_airport?.airport_code || ""}`,
          b.total_passengers,
          b.total_amount,
          b.status,
          new Date(b.booking_date).toLocaleDateString(),
        ]),
      ]
        .map((r) => r.map((c) => `"${c}"`).join(","))
        .join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }
    showNotification(`Exported ${data.length} bookings`);
  };

  const handleSelectAll = () =>
    setSelectedBookings(
      selectedBookings.length === currentBookings.length
        ? []
        : currentBookings.map((b) => b._id),
    );
  const toggleBookingSelection = (id) =>
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const BOOKING_STATUS_CLASS = {
    Confirmed: "badge-confirmed",
    Cancelled: "badge-cancelled",
    Pending: "badge-pending",
  };

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

      {/* ── View Booking Modal ── */}
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
                  {viewBooking.bookingReference}
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
                  ["Booking Reference", viewBooking.bookingReference],
                  [
                    "User Name",
                    `${viewBooking.user_id?.firstName} ${viewBooking.user_id?.lastName}`,
                  ],
                  ["Email", viewBooking.user_id?.email],
                  ["Phone", viewBooking.user_id?.phone],
                  ["Flight Number", viewBooking.flight_id?.flight_number],
                  [
                    "Route",
                    `${viewBooking.flight_id?.from_airport?.city} (${viewBooking.flight_id?.from_airport?.airport_code}) → ${viewBooking.flight_id?.to_airport?.city} (${viewBooking.flight_id?.to_airport?.airport_code})`,
                  ],
                  [
                    "Departure",
                    new Date(
                      viewBooking.flight_id?.departure_time,
                    ).toLocaleString("en-IN"),
                  ],
                  [
                    "Arrival",
                    new Date(
                      viewBooking.flight_id?.arrival_time,
                    ).toLocaleString("en-IN"),
                  ],
                  ["Total Passengers", viewBooking.total_passengers],
                  [
                    "Total Amount",
                    `₹${viewBooking.total_amount?.toLocaleString("en-IN")}`,
                  ],
                  ["Status", viewBooking.status],
                  [
                    "Booking Date",
                    new Date(viewBooking.booking_date).toLocaleString("en-IN"),
                  ],
                  ...(viewBooking.payment_status
                    ? [["Payment Status", viewBooking.payment_status]]
                    : []),
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

      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings Management</h1>
          <p className="admin-page-subtitle">
            Total: <strong>{bookings.length}</strong> | Filtered:{" "}
            <strong>{filteredAndSortedBookings.length}</strong>
          </p>
        </div>
        <div className="admin-header-actions">
          <select
            className="admin-select"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button className="btn-secondary" onClick={exportBookings}>
            <Download size={16} /> Export
          </button>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add New Booking
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
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
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
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

      {/* ── Bulk Actions Bar ── */}
      {selectedBookings.length > 0 && (
        <div className="users-bulk-bar">
          <span className="users-bulk-count">
            {selectedBookings.length} booking(s) selected
          </span>
          <div className="users-bulk-actions">
            <select
              className="admin-select"
              defaultValue=""
              onChange={(e) => handleBulkStatusUpdate(e.target.value)}
            >
              <option value="" disabled>
                Change Status
              </option>
              <option value="Confirmed">Set Confirmed</option>
              <option value="Cancelled">Set Cancelled</option>
              <option value="Pending">Set Pending</option>
            </select>
            <button
              className="users-bulk-btn users-bulk-blocked"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
            <button
              className="users-bulk-btn users-bulk-clear"
              onClick={() => setSelectedBookings([])}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="admin-table-container">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length === currentBookings.length &&
                      currentBookings.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("bookingReference")}
                >
                  Booking Ref
                  <SortIcon col="bookingReference" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("user")}
                >
                  User
                  <SortIcon col="user" />
                </th>
                <th>Email</th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("flight")}
                >
                  Flight
                  <SortIcon col="flight" />
                </th>
                <th>Route</th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("total_passengers")}
                >
                  Passengers
                  <SortIcon col="total_passengers" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("total_amount")}
                >
                  Amount
                  <SortIcon col="total_amount" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("status")}
                >
                  Status
                  <SortIcon col="status" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("booking_date")}
                >
                  Booked On
                  <SortIcon col="booking_date" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={11} className="admin-table-empty">
                    <BookOpen size={48} className="admin-table-empty-icon" />
                    <p>No bookings found</p>
                  </td>
                </tr>
              ) : (
                currentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(b._id)}
                        onChange={() => toggleBookingSelection(b._id)}
                      />
                    </td>
                    <td className="cell-accent">{b.bookingReference}</td>
                    <td>
                      <div className="admin-avatar-cell">
                        <div className="admin-avatar">
                          {b.user_id?.firstName?.charAt(0) || "?"}
                        </div>
                        <div className="admin-avatar-info">
                          <p className="admin-avatar-name">
                            {b.user_id?.firstName} {b.user_id?.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="cell-muted" style={{ fontSize: "0.75rem" }}>
                      {b.user_id?.email}
                    </td>
                    <td>
                      <span className="airline-code-tag">
                        {b.flight_id?.flight_number || "—"}
                      </span>
                    </td>
                    <td className="cell-muted">
                      {b.flight_id?.from_airport?.airport_code} →{" "}
                      {b.flight_id?.to_airport?.airport_code}
                    </td>
                    <td>
                      <span className="booking-passengers-badge">
                        {b.total_passengers}
                      </span>
                    </td>
                    <td className="cell-success">
                      ₹{b.total_amount?.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={
                          BOOKING_STATUS_CLASS[b.status] || "badge-pending"
                        }
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="cell-muted" style={{ fontSize: "0.75rem" }}>
                      {new Date(b.booking_date).toLocaleDateString("en-IN", {
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
                        {b.status === "Confirmed" && (
                          <button
                            title="Cancel"
                            onClick={() => cancelBooking(b._id)}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "0.5rem",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              background: "rgba(251,146,60,0.1)",
                              color: "#fb923c",
                            }}
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                        <button
                          className="users-action-btn users-action-edit"
                          title="Edit"
                          onClick={() => handleEdit(b)}
                        >
                          <Edit2 size={14} />
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <p className="admin-pagination-info">
            Showing {indexOfFirst + 1}–
            {Math.min(indexOfLast, filteredAndSortedBookings.length)} of{" "}
            {filteredAndSortedBookings.length}
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

      {/* ── Add Booking Modal ── */}
      {showAdd && (
        <AddBookingModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            fetchBookings();
            showNotification("Booking added successfully");
          }}
        />
      )}
    </div>
  );
};

export default AdminBookings;
