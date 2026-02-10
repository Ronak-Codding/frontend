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
      try {
        const userRes = await fetch("http://localhost:5000/api/user/allUsers");
        const flightRes = await fetch(
          "http://localhost:5000/api/flights/allFlights",
        );

        if (!userRes.ok || !flightRes.ok)
          throw new Error("Failed to load data");

        setUsers(await userRes.json());
        setFlights(await flightRes.json());
      } catch (err) {
        setError("Failed to load users or flights");
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
        updated.total_amount =
          flight.price * updated.total_passengers;
    }

    if (name === "total_passengers") {
      const flight = flights.find((f) => f._id === formData.flight_id);
      if (flight)
        updated.total_amount = flight.price * value;
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Booking
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User *
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flight *
            </label>
            <select
              name="flight_id"
              value={formData.flight_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Flight</option>
              {flights.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.flight_number} |{" "}
                  {f.from_airport?.airport_code} →
                  {f.to_airport?.airport_code} | ₹{f.price}
                </option>
              ))}
            </select>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <input
              type="number"
              min="1"
              name="total_passengers"
              value={formData.total_passengers}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <input
              type="number"
              readOnly
              value={formData.total_amount}
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingModal;
