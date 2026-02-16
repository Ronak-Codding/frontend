import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    booking_id: "",
    amount: "",
    payment_status: "Success",
    payment_mode: "UPI",
  });

  // Fetch All
  const fetchPayments = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/payments/allpayments`,
    );
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings/allBookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/payments/updatePayment/${editId}`,
        formData,
      );
    } else {
      await axios.post(`http://localhost:5000/api/payments/`, formData);
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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this payment?")) {
      await axios.delete(
        `http://localhost:5000/api/payments/updatePayment/${id}`,
      );
      fetchPayments();
    }
  };

  const handleStatusFilter = async (status) => {
    setStatusFilter(status);

    if (status === "") {
      fetchPayments();
    } else {
      const res = await axios.get(
        `http://localhost:5000/api/payments/payments/status/${status}`,
      );
      setPayments(res.data);
    }
  };

  // ================= FILTER =================
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.booking_id?.bookingReference
          ?.toLowerCase()
          .includes(search.toLowerCase()) || false;

      const matchesStatus = statusFilter
        ? p.payment_status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  // ================= PAGINATION =================
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700">Payments Data</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          <i className="fas fa-plus mr-2"></i>Add Payment
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-colors">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>

              <input
                type="text"
                placeholder="Search by Booking REF..."
                className="w-full pl-9 pr-3 py-2 text-sm
                   border border-gray-300 dark:border-gray-700
                   rounded-md
                   bg-gray-50 dark:bg-neutral-100
                   text-black dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:bg-white dark:focus:bg-neutral-100
                   focus:ring-1 focus:ring-black dark:focus:ring-white
                   outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm
                     border border-gray-300 dark:border-gray-700
                     rounded-lg
                     bg-gray-50 dark:bg-neutral-100
                     text-black dark:text-white
                     focus:bg-white dark:focus:bg-neutral-100
                     focus:ring-1 focus:ring-black dark:focus:ring-white
                     outline-none transition"
              >
                <option value="">All Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Booking REF</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {currentPayments.map((p, index) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{p.booking_id?.bookingReference}</td>
                <td className="px-6 py-4 font-medium">₹ {p.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      p.payment_status === "Success"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">{p.payment_mode}</td>
                <td className="px-6 py-4">
                  {new Date(p.payment_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center space-x-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border"
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  currentPage === page ? "bg-indigo-600 text-white" : ""
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border"
          >
            Next ›
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="w-96 p-6 rounded-2xl shadow-2xl
      bg-white dark:bg-black
      border border-gray-200 dark:border-gray-700
      transition-all duration-300"
          >
            <h2
              className="text-xl font-semibold mb-6
        text-black dark:text-white"
            >
              {editId ? "Edit Payment" : "Add Payment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Booking Select */}
              <select
                name="booking_id"
                value={formData.booking_id}
                onChange={(e) => handleBookingSelect(e)}
                required
                className="w-full px-4 py-2 rounded-lg
            bg-white dark:bg-zinc-900
            text-black dark:text-white
            border border-gray-300 dark:border-gray-600
            "
              >
                <option value="">Select Booking</option>
                {bookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.bookingReference} | ₹{booking.total_amount}
                  </option>
                ))}
              </select>

              {/* Amount */}
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                readOnly
                className="w-full px-4 py-2 rounded-lg
            bg-gray-100 dark:bg-white-400
            text-black dark:text-white
            border border-gray-300 dark:border-gray-600
            cursor-not-allowed"
              />

              {/* Payment Status */}
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg
            bg-white dark:bg-zinc-900
            text-black dark:text-white
            border border-gray-300 dark:border-gray-600
            "
              >
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>

              {/* Payment Mode */}
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg
            bg-white dark:bg-zinc-900
            text-black dark:text-white
            border border-gray-300 dark:border-gray-600
            "
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg
              bg-gray-100 dark:bg-zinc-500
              text-black dark:text-white
              hover:opacity-80 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="
                px-4 py-2 rounded-lg
                bg-blue-600 dark:bg-blue-500
                text-white dark:text-black
                hover:opacity-80
              "
                >
                  {editId ? "Update" : "Save"}
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
