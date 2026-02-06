import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PassengerModal = ({ passenger, onClose, refresh }) => {
  const isEdit = Boolean(passenger);

  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    booking_id: "",
    name: "",
    age: "",
    gender: "Male",
    seat_number: "",
  });

  /* ================= LOAD BOOKINGS ================= */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        setBookings(res.data);
      } catch {
        toast.error("Failed to load bookings");
      }
    };
    fetchBookings();
  }, []);

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (passenger) {
      setFormData({
        booking_id: passenger.booking_id?._id || "",
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        seat_number: passenger.seat_number,
      });
    }
  }, [passenger]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/passengers/${passenger._id}`,
          formData
        );
        toast.success("Passenger updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/passengers",
          formData
        );
        toast.success("Passenger added");
      }
      refresh();
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "#0008" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? "Edit Passenger" : "Add Passenger"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">

              {/* 🔽 BOOKING DROPDOWN */}
              {!isEdit && (
                <select
                  className="form-select mb-2"
                  name="booking_id"
                  value={formData.booking_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Booking</option>
                  {bookings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.bookingReference} — {b.user_id?.firstName}
                    </option>
                  ))}
                </select>
              )}

              <input
                className="form-control mb-2"
                name="name"
                placeholder="Passenger Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-2"
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <select
                className="form-select mb-2"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
              </select>

              {/* <input
                className="form-control"
                name="seat_number"
                placeholder="Seat Number"
                value={formData.seat_number}
                onChange={handleChange}
                required
              /> */}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary">
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassengerModal;
