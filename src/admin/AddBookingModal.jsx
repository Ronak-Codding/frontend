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
        const userRes = await fetch("http://localhost:5000/api/auth");
        if (!userRes.ok) throw new Error("Failed to fetch users");

        const flightRes = await fetch("http://localhost:5000/api/flights");
        if (!flightRes.ok) throw new Error("Failed to fetch flights");

        const usersData = await userRes.json();
        const flightsData = await flightRes.json();

        setUsers(usersData);
        setFlights(flightsData);
      } catch (err) {
        console.error(err);
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
      if (flight) {
        updated.total_amount = flight.price * updated.total_passengers;
      }
    }

    if (name === "total_passengers") {
      const flight = flights.find((f) => f._id === formData.flight_id);
      if (flight) {
        updated.total_amount = flight.price * value;
      }
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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5>Add Booking</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              {/* USER */}
              <label>User</label>
              <select
                className="form-select mb-3"
                name="user_id"
                value={formData.user_id}
                required
                onChange={handleChange}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>

              {/* FLIGHT */}
              <label>Flight</label>
              <select
                className="form-select mb-3"
                name="flight_id"
                value={formData.flight_id}
                required
                onChange={handleChange}
              >
                <option value="">Select Flight</option>
                {flights.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.flight_number} |{f.from_airport?.iata_code} →{" "}
                    {f.to_airport?.iata_code} | ₹{f.price}
                  </option>
                ))}
              </select>

              {/* PASSENGERS */}
              <label>Passengers</label>
              <input
                type="number"
                min="1"
                className="form-control mb-3"
                name="total_passengers"
                value={formData.total_passengers}
                onChange={handleChange}
              />

              {/* AMOUNT */}
              <label>Total Amount</label>
              <input
                type="number"
                className="form-control"
                value={formData.total_amount}
                readOnly
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;
