import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./AdminTables.css";
import "./AdminUsers.css";
import "./AdminPassengers.css";

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

  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      try {
        const [userRes, flightRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/allUsers"),
          fetch("http://localhost:5000/api/flights/allFlights"),
        ]);
        if (!userRes.ok || !flightRes.ok)
          throw new Error("Failed to load data");
        setUsers(await userRes.json());
        setFlights(await flightRes.json());
      } catch {
        setError("Failed to load users or flights");
      } finally {
        setLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

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
    <div className="pax-modal-overlay" onClick={onClose}>
      <div
        className="pax-modal pax-modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pax-modal-header">
          <h2 className="pax-modal-title">Add New Booking</h2>
          <button className="pax-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && <div className="booking-error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="pax-modal-body">
            <div className="pax-form-stack">
              {/* User */}
              <div className="pax-form-group">
                <label className="pax-form-label">
                  User <span className="pax-required">*</span>
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  className="pax-form-select"
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
              <div className="pax-form-group">
                <label className="pax-form-label">
                  Flight <span className="pax-required">*</span>
                </label>
                <select
                  name="flight_id"
                  value={formData.flight_id}
                  onChange={handleChange}
                  required
                  className="pax-form-select"
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
              <div className="pax-form-group">
                <label className="pax-form-label">
                  Number of Passengers <span className="pax-required">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  name="total_passengers"
                  value={formData.total_passengers}
                  onChange={handleChange}
                  required
                  className="pax-form-input"
                />
              </div>

              {/* Total Amount */}
              <div className="pax-form-group">
                <label className="pax-form-label">Total Amount (₹)</label>
                <input
                  type="number"
                  readOnly
                  value={formData.total_amount}
                  className="pax-form-input pax-form-input-readonly"
                />
                <p className="pax-form-hint">
                  Auto-calculated based on flight price × passengers
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pax-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div
                    className="users-spinner"
                    style={{ width: 16, height: 16, borderWidth: 2 }}
                  />{" "}
                  Processing...
                </>
              ) : (
                <>
                  <Save size={16} /> Add Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingModal;
