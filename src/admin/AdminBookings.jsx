import React, { useEffect, useState } from "react";
import AddBookingModal from "./AddBookingModal";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
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

  // Notification helper
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
      setFilteredBookings(data);
    } catch (error) {
      showNotification("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= SORTING FUNCTION ================= */
  const sortedBookings = () => {
    const filtered = filteredBookingsData();
    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "booking_date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.key === "total_amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.key === "user") {
        aValue = `${a.user_id?.firstName} ${a.user_id?.lastName}`;
        bValue = `${b.user_id?.firstName} ${b.user_id?.lastName}`;
      } else if (sortConfig.key === "flight") {
        aValue = a.flight_id?.flight_number || "";
        bValue = b.flight_id?.flight_number || "";
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = async (searchValue) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/search?q=${searchValue}`,
      );
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      showNotification("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookingsData = () => {
    return bookings.filter((b) => {
      // Search filter
      const matchesSearch =
        !query ||
        b.bookingReference?.toLowerCase().includes(query.toLowerCase()) ||
        `${b.user_id?.firstName} ${b.user_id?.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        b.user_id?.email?.toLowerCase().includes(query.toLowerCase()) ||
        b.flight_id?.flight_number?.toLowerCase().includes(query.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;

      // Date range filter
      const matchesDateRange =
        !dateRange.start ||
        !dateRange.end ||
        (new Date(b.booking_date) >= new Date(dateRange.start) &&
          new Date(b.booking_date) <= new Date(dateRange.end));

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  };

  const filteredAndSortedBookings = sortedBookings();

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
        method: "PUT",
      });
      showNotification("Booking cancelled successfully", "success");
      fetchBookings();
    } catch (error) {
      showNotification("Failed to cancel booking", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (booking) => {
    setViewBooking(booking);
    setShowViewModal(true);
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
          body: JSON.stringify({
            total_passengers: Number(newPassengers),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message, "error");
      } else {
        showNotification("Booking updated successfully", "success");
        fetchBookings();
      }
    } catch (error) {
      showNotification("Failed to update booking", "error");
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
      showNotification("Booking deleted successfully", "success");
      fetchBookings();
    } catch (error) {
      showNotification("Failed to delete booking", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedBookings.length} selected bookings?`))
      return;

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
      setFilteredBookings(
        filteredBookings.filter((b) => !selectedBookings.includes(b._id)),
      );
      setSelectedBookings([]);
      showNotification(
        `${selectedBookings.length} bookings deleted successfully`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to delete bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK STATUS UPDATE ================= */
  const handleBulkStatusUpdate = async (newStatus) => {
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
        "success",
      );
    } catch (error) {
      showNotification("Failed to update bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT BOOKINGS ================= */
  const exportBookings = () => {
    const dataToExport = filteredAndSortedBookings;

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

      const csvData = dataToExport.map((booking) => [
        booking.bookingReference,
        `${booking.user_id?.firstName || ""} ${booking.user_id?.lastName || ""}`,
        booking.user_id?.email || "",
        booking.flight_id?.flight_number || "",
        `${booking.flight_id?.from_airport?.airport_code || ""} → ${booking.flight_id?.to_airport?.airport_code || ""}`,
        booking.total_passengers,
        booking.total_amount,
        booking.status,
        new Date(booking.booking_date).toLocaleDateString(),
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} bookings`, "success");
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = () => {
    if (selectedBookings.length === currentBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(currentBookings.map((b) => b._id));
    }
  };

  /* ================= TOGGLE SELECTION ================= */
  const toggleBookingSelection = (bookingId) => {
    if (selectedBookings.includes(bookingId)) {
      setSelectedBookings(selectedBookings.filter((id) => id !== bookingId));
    } else {
      setSelectedBookings([...selectedBookings, bookingId]);
    }
  };

  const totalPages = Math.ceil(
    filteredAndSortedBookings.length / bookingsPerPage,
  );
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredAndSortedBookings.slice(
    indexOfFirst,
    indexOfLast,
  );

  useEffect(() => {
    if (!query.trim()) {
      fetchBookings();
    } else {
      handleSearch(query);
    }
  }, [query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, dateRange]);

  const Detail = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-[10001] px-5 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white font-medium`}
        >
          <div className="flex items-center space-x-2">
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Booking Details: {viewBooking.bookingReference}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-2xl text-gray-600 dark:text-gray-300 hover:opacity-70 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3 text-sm text-gray-800 dark:text-gray-200">
              <Detail
                label="Booking Reference"
                value={viewBooking.bookingReference}
              />
              <Detail
                label="User Name"
                value={`${viewBooking.user_id?.firstName} ${viewBooking.user_id?.lastName}`}
              />
              <Detail label="Email" value={viewBooking.user_id?.email} />
              <Detail label="Phone" value={viewBooking.user_id?.phone} />
              <Detail
                label="Flight Number"
                value={viewBooking.flight_id?.flight_number}
              />
              <Detail
                label="Route"
                value={`${viewBooking.flight_id?.from_airport?.city} (${viewBooking.flight_id?.from_airport?.airport_code}) → ${viewBooking.flight_id?.to_airport?.city} (${viewBooking.flight_id?.to_airport?.airport_code})`}
              />
              <Detail
                label="Departure"
                value={new Date(
                  viewBooking.flight_id?.departure_time,
                ).toLocaleString()}
              />
              <Detail
                label="Arrival"
                value={new Date(
                  viewBooking.flight_id?.arrival_time,
                ).toLocaleString()}
              />
              <Detail
                label="Total Passengers"
                value={viewBooking.total_passengers}
              />
              <Detail
                label="Total Amount"
                value={`₹${viewBooking.total_amount?.toLocaleString()}`}
              />

              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    viewBooking.status === "Confirmed"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {viewBooking.status}
                </span>
              </div>

              <Detail
                label="Booking Date"
                value={new Date(viewBooking.booking_date).toLocaleString()}
              />
              {viewBooking.payment_status && (
                <Detail
                  label="Payment Status"
                  value={viewBooking.payment_status}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bookings Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Bookings:{" "}
            <span className="font-semibold">{bookings.length}</span> | Filtered:{" "}
            <span className="font-semibold">
              {filteredAndSortedBookings.length}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Export Button */}
          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={exportBookings}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Booking
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Reference / Name / Email / Flight"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedBookings.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedBookings.length} booking(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <select
              onChange={(e) => handleBulkStatusUpdate(e.target.value)}
              className="px-3 py-1 border border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              defaultValue=""
            >
              <option value="" disabled>
                Change Status
              </option>
              <option value="Confirmed">Set Confirmed</option>
              <option value="Cancelled">Set Cancelled</option>
              <option value="Pending">Set Pending</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedBookings([])}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length === currentBookings.length &&
                      currentBookings.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("bookingReference")}
                >
                  Booking Ref{" "}
                  {sortConfig.key === "bookingReference" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("user")}
                >
                  User{" "}
                  {sortConfig.key === "user" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">Email</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("flight")}
                >
                  Flight{" "}
                  {sortConfig.key === "flight" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">Route</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("total_passengers")}
                >
                  Passengers{" "}
                  {sortConfig.key === "total_passengers" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("total_amount")}
                >
                  Amount{" "}
                  {sortConfig.key === "total_amount" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("booking_date")}
                >
                  Booked On{" "}
                  {sortConfig.key === "booking_date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {currentBookings.length > 0 ? (
                currentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(b._id)}
                        onChange={() => toggleBookingSelection(b._id)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {b.bookingReference}
                    </td>
                    <td className="px-4 py-3">
                      {b.user_id?.firstName} {b.user_id?.lastName}
                    </td>
                    <td className="px-4 py-3">{b.user_id?.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded font-bold text-xs text-blue-800 dark:text-blue-300">
                        {b.flight_id?.flight_number || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.flight_id?.from_airport?.airport_code} →{" "}
                      {b.flight_id?.to_airport?.airport_code}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full font-bold text-xs">
                        {b.total_passengers}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{b.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          b.status === "Confirmed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : b.status === "Cancelled"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(b.booking_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {/* <button
                          onClick={() => handleView(b)}
                          className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded transition"
                          title="View"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button> */}
                        {b.status === "Confirmed" && (
                          <button
                            onClick={() => cancelBooking(b._id)}
                            className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded transition"
                            title="Cancel"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteBooking(b._id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p>No bookings found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`
                px-4 py-2 text-sm rounded-lg border transition-all
                ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-10 h-10 text-sm rounded-lg transition-all
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`
                px-4 py-2 text-sm rounded-lg border transition-all
                ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      {showAdd && (
        <AddBookingModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            fetchBookings();
            showNotification("Booking added successfully", "success");
          }}
        />
      )}
    </div>
  );
};

export default AdminBookings;
