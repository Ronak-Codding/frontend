import React, { useEffect, useState } from "react";

const AddBookingModal = ({ onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    user_id: "",
    flight_id: "",
    total_passengers: 1,
    total_amount: 0,
  });

  /* ================= FETCH USERS & FLIGHTS ================= */
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      try {
        const userRes = await fetch("http://localhost:5000/api/user/allUsers");
        const flightRes = await fetch(
          "http://localhost:5000/api/flights/allFlights",
        );

        if (!userRes.ok || !flightRes.ok)
          throw new Error("Failed to load data");

        const usersData = await userRes.json();
        const flightsData = await flightRes.json();

        setUsers(usersData);
        setFlights(flightsData);
      } catch (err) {
        setError("Failed to load users or flights");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "flight_id") {
      const flight = flights.find((f) => f._id === value);
      if (flight)
        updated.total_amount = flight.price * updated.total_passengers;
    }

    if (name === "total_passengers") {
      const flight = flights.find((f) => f._id === formData.flight_id);
      if (flight) updated.total_amount = flight.price * value;
    }

    setFormData(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.message || "Booking failed");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Booking
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            ×
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User <span className="text-red-500">*</span>
              </label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Flight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Flight <span className="text-red-500">*</span>
              </label>
              <select
                name="flight_id"
                value={formData.flight_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select Flight</option>
                {flights.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.flight_number} | {f.from_airport?.airport_code} →{" "}
                    {f.to_airport?.airport_code} | ₹{f.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Passengers <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="total_passengers"
                value={formData.total_passengers}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Amount (₹)
              </label>
              <input
                type="number"
                readOnly
                value={formData.total_amount}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Auto-calculated based on flight price and passenger count
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
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
              ) : (
                "Add Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingModal;
