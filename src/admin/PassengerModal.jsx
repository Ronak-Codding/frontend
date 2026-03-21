import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";
import "./AdminTables.css";
// import "./AdminUsers.css";
import "./AdminPassengers.css";

const PassengerModal = ({ passenger, onClose, refresh }) => {
  const isEdit = Boolean(passenger);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_id: "",
    name: "",
    age: "",
    gender: "Male",
    seat_number: "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/bookings/allBookings",
        );
        setBookings(res.data);
      } catch {
        console.error("Failed to load bookings");
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (passenger) {
      setFormData({
        booking_id: passenger.booking_id?._id || "",
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        seat_number: passenger.seat_number || "",
      });
    }
  }, [passenger]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/passengers/updatePassenger/${passenger._id}`,
          formData,
        );
      } else {
        await axios.post("http://localhost:5000/api/passengers", formData);
      }
      refresh();
      onClose();
    } catch (err) {
      console.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pax-modal-overlay" onClick={onClose}>
      <div
        className="pax-modal pax-modal-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pax-modal-header">
          <h2 className="pax-modal-title">
            {isEdit ? "Edit Passenger" : "Add New Passenger"}
          </h2>
          <button className="pax-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pax-modal-body">
            <div className="pax-form-stack">
              {/* Booking - Add mode only */}
              {!isEdit && (
                <div className="pax-form-group">
                  <label className="pax-form-label">
                    Booking <span className="pax-required">*</span>
                  </label>
                  <select
                    name="booking_id"
                    value={formData.booking_id}
                    onChange={handleChange}
                    required
                    className="pax-form-select"
                  >
                    <option value="">Select Booking</option>
                    {bookings.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.bookingReference} — {b.user_id?.firstName}{" "}
                        {b.user_id?.lastName} ({b.flight_id?.flight_number})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div className="pax-form-group">
                <label className="pax-form-label">
                  Passenger Name <span className="pax-required">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter passenger name"
                  className="pax-form-input"
                />
              </div>

              {/* Age + Gender */}
              <div className="pax-form-row">
                <div className="pax-form-group">
                  <label className="pax-form-label">
                    Age <span className="pax-required">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="0"
                    max="120"
                    placeholder="e.g., 25"
                    className="pax-form-input"
                  />
                </div>
                <div className="pax-form-group">
                  <label className="pax-form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="pax-form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Seat */}
              <div className="pax-form-group">
                <label className="pax-form-label">
                  Seat Number <span className="pax-optional">(optional)</span>
                </label>
                <input
                  name="seat_number"
                  value={formData.seat_number}
                  onChange={handleChange}
                  placeholder="e.g., 12A"
                  className="pax-form-input"
                />
              </div>
            </div>
          </div>

          <div className="pax-modal-footer">
            <button type="button" className="btn-export" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add-user" disabled={loading}>
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
                  <Save size={16} />{" "}
                  {isEdit ? "Update Passenger" : "Add Passenger"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerModal;
