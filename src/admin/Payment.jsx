import React, { useEffect, useState } from "react";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPayment, setViewPayment] = useState(null);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const paymentsPerPage = 5;

  const [bookings, setBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "payment_date",
    direction: "desc",
  });
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [formData, setFormData] = useState({
    booking_id: "",
    amount: "",
    payment_status: "Success",
    payment_mode: "UPI",
  });

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  // Fetch All
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/payments/allpayments`,
      );
      setPayments(res.data);
      setFilteredPayments(res.data);
    } catch (error) {
      showNotification("Failed to fetch payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings/allBookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      showNotification("Failed to fetch bookings", "error");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= SORTING FUNCTION ================= */
  const sortedPayments = () => {
    const filtered = filteredPaymentsData();
    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "payment_date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.key === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.key === "bookingReference") {
        aValue = a.booking_id?.bookingReference || "";
        bValue = b.booking_id?.bookingReference || "";
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

  const handleBookingSelect = (e) => {
    const selectedId = e.target.value;

    const selectedBooking = bookings.find(
      (booking) => booking._id === selectedId,
    );

    if (selectedBooking) {
      setFormData({
        ...formData,
        booking_id: selectedId,
        amount: selectedBooking.total_amount, // AUTO FILL
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/payments/updatePayment/${editId}`,
          formData,
        );
        showNotification("Payment updated successfully", "success");
      } else {
        await axios.post(`http://localhost:5000/api/payments/`, formData);
        showNotification("Payment added successfully", "success");
      }

      setShowModal(false);
      setEditId(null);
      setFormData({
        booking_id: "",
        amount: "",
        payment_status: "Success",
        payment_mode: "UPI",
      });

      fetchPayments();
    } catch (error) {
      showNotification("Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment) => {
    setEditId(payment._id);
    setFormData({
      booking_id: payment.booking_id?._id || "",
      amount: payment.amount,
      payment_status: payment.payment_status,
      payment_mode: payment.payment_mode,
    });
    setShowModal(true);
  };

  const handleView = (payment) => {
    setViewPayment(payment);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/payments/updatePayment/${id}`,
      );
      showNotification("Payment deleted successfully", "success");
      fetchPayments();
    } catch (error) {
      showNotification("Failed to delete payment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    setCurrentPage(1);

    if (status === "") {
      fetchPayments();
    } else {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/payments/payments/status/${status}`,
        );
        setPayments(res.data);
      } catch (error) {
        showNotification("Failed to filter payments", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // ================= FILTER =================
  const filteredPaymentsData = () => {
    return payments.filter((p) => {
      const matchesSearch =
        !search ||
        p.booking_id?.bookingReference
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        p.payment_mode?.toLowerCase().includes(search.toLowerCase()) ||
        p.payment_status?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !statusFilter || p.payment_status === statusFilter;
      const matchesMode = !modeFilter || p.payment_mode === modeFilter;

      const matchesDateRange =
        !dateRange.start ||
        !dateRange.end ||
        (new Date(p.payment_date) >= new Date(dateRange.start) &&
          new Date(p.payment_date) <= new Date(dateRange.end));

      return matchesSearch && matchesStatus && matchesMode && matchesDateRange;
    });
  };

  const filteredAndSortedPayments = sortedPayments();

  // ================= BULK OPERATIONS =================
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedPayments.length} selected payments?`))
      return;

    setLoading(true);
    try {
      await Promise.all(
        selectedPayments.map((id) =>
          axios.delete(
            `http://localhost:5000/api/payments/updatePayment/${id}`,
          ),
        ),
      );

      setPayments(payments.filter((p) => !selectedPayments.includes(p._id)));
      setSelectedPayments([]);
      showNotification(
        `${selectedPayments.length} payments deleted successfully`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to delete payments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedPayments.map((id) =>
          axios.put(`http://localhost:5000/api/payments/updatePayment/${id}`, {
            payment_status: newStatus,
          }),
        ),
      );

      await fetchPayments();
      setSelectedPayments([]);
      showNotification(
        `${selectedPayments.length} payments updated to ${newStatus}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update payments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkModeUpdate = async (newMode) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedPayments.map((id) =>
          axios.put(`http://localhost:5000/api/payments/updatePayment/${id}`, {
            payment_mode: newMode,
          }),
        ),
      );

      await fetchPayments();
      setSelectedPayments([]);
      showNotification(
        `${selectedPayments.length} payments updated to ${newMode}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update payments", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= EXPORT =================
  const exportPayments = () => {
    const dataToExport = filteredAndSortedPayments;

    if (exportFormat === "csv") {
      const headers = [
        "Booking Reference",
        "Amount",
        "Status",
        "Mode",
        "Date",
        "User",
      ];
      const csvData = dataToExport.map((payment) => [
        payment.booking_id?.bookingReference || "N/A",
        payment.amount,
        payment.payment_status,
        payment.payment_mode,
        new Date(payment.payment_date).toLocaleDateString(),
        `${payment.booking_id?.user_id?.firstName || ""} ${payment.booking_id?.user_id?.lastName || ""}`.trim() ||
          "N/A",
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} payments`, "success");
  };

  // ================= SELECT ALL =================
  const handleSelectAll = () => {
    if (selectedPayments.length === currentPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(currentPayments.map((p) => p._id));
    }
  };

  const togglePaymentSelection = (paymentId) => {
    if (selectedPayments.includes(paymentId)) {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    } else {
      setSelectedPayments([...selectedPayments, paymentId]);
    }
  };

  // ================= PAGINATION =================
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredAndSortedPayments.slice(
    indexOfFirst,
    indexOfLast,
  );
  const totalPages = Math.ceil(
    filteredAndSortedPayments.length / paymentsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, modeFilter, dateRange]);

  const Detail = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <span className="text-gray-800 dark:text-gray-200">{value || "-"}</span>
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

      {/* View Payment Modal */}
      {showViewModal && viewPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Details
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
                value={viewPayment.booking_id?.bookingReference}
              />
              <Detail
                label="User"
                value={`${viewPayment.booking_id?.user_id?.firstName || ""} ${viewPayment.booking_id?.user_id?.lastName || ""}`}
              />
              <Detail
                label="Email"
                value={viewPayment.booking_id?.user_id?.email}
              />
              <Detail
                label="Amount"
                value={`₹${viewPayment.amount?.toLocaleString()}`}
              />

              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    viewPayment.payment_status === "Success"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {viewPayment.payment_status}
                </span>
              </div>

              <Detail label="Payment Mode" value={viewPayment.payment_mode} />
              <Detail
                label="Payment Date"
                value={new Date(viewPayment.payment_date).toLocaleString()}
              />

              {viewPayment.booking_id?.flight_id && (
                <>
                  <Detail
                    label="Flight"
                    value={viewPayment.booking_id.flight_id.flight_number}
                  />
                  <Detail
                    label="Route"
                    value={`${viewPayment.booking_id.flight_id.from_airport?.city} → ${viewPayment.booking_id.flight_id.to_airport?.city}`}
                  />
                </>
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
            Payments Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Payments:{" "}
            <span className="font-semibold">{payments.length}</span> | Filtered:{" "}
            <span className="font-semibold">
              {filteredAndSortedPayments.length}
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
              onClick={exportPayments}
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
            onClick={() => {
              setEditId(null);
              setFormData({
                booking_id: "",
                amount: "",
                payment_status: "Success",
                payment_mode: "UPI",
              });
              setShowModal(true);
            }}
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
            Add Payment
          </button>
        </div>
      </div>

      {/* Search & Filter Card */}
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
              placeholder="Search by Booking Ref, Mode, or Status..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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
              <option value="">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <select
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">All Modes</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="md:col-span-4 flex gap-2">
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
      {selectedPayments.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedPayments.length} payment(s) selected
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
              <option value="Success">Set Success</option>
              <option value="Failed">Set Failed</option>
            </select>
            <select
              onChange={(e) => handleBulkModeUpdate(e.target.value)}
              className="px-3 py-1 border border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              defaultValue=""
            >
              <option value="" disabled>
                Change Mode
              </option>
              <option value="UPI">Set UPI</option>
              <option value="Card">Set Card</option>
              <option value="Net Banking">Set Net Banking</option>
              <option value="Wallet">Set Wallet</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedPayments([])}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedPayments.length === currentPayments.length &&
                      currentPayments.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("bookingReference")}
                >
                  Booking REF{" "}
                  {sortConfig.key === "bookingReference" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">User</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("amount")}
                >
                  Amount{" "}
                  {sortConfig.key === "amount" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("payment_status")}
                >
                  Status{" "}
                  {sortConfig.key === "payment_status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("payment_mode")}
                >
                  Mode{" "}
                  {sortConfig.key === "payment_mode" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("payment_date")}
                >
                  Date{" "}
                  {sortConfig.key === "payment_date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {currentPayments.length > 0 ? (
                currentPayments.map((p, index) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(p._id)}
                        onChange={() => togglePaymentSelection(p._id)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded font-bold text-xs text-blue-700 dark:text-blue-300">
                        {p.booking_id?.bookingReference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.booking_id?.user_id ? (
                        <div>
                          <div>{`${p.booking_id.user_id.firstName || ""} ${p.booking_id.user_id.lastName || ""}`}</div>
                          {/* <div className="text-xs text-gray-500 dark:text-gray-400">
                            {p.booking_id.user_id.email}
                          </div> */}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.payment_status === "Success"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {p.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-xs text-purple-700 dark:text-purple-300">
                        {p.payment_mode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(p.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(p)}
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
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
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
                          onClick={() => handleDelete(p._id)}
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
                    colSpan="8"
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <p>No payments found</p>
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

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editId ? "Edit Payment" : "Add New Payment"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Booking Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Booking <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="booking_id"
                    value={formData.booking_id}
                    onChange={(e) => handleBookingSelect(e)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select a booking</option>
                    {bookings.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        {booking.bookingReference} | ₹{booking.total_amount} |{" "}
                        {booking.user_id?.firstName} {booking.user_id?.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-filled from selected booking
                  </p>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_mode"
                    value={formData.payment_mode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Wallet">Wallet</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                      Processing...
                    </>
                  ) : editId ? (
                    "Update Payment"
                  ) : (
                    "Add Payment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
