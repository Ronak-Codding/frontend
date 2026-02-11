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
        const res = await axios.get(
          "http://localhost:5000/api/bookings/allBookings",
        );
        setBookings(res.data);
      } catch (error) {
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
          `http://localhost:5000/api/passengers/updatePassenger/${passenger._id}`,
          formData,
        );
        toast.success("Passenger updated");
      } else {
        await axios.post("http://localhost:5000/api/passengers", formData);
        toast.success("Passenger added");
      }
      refresh();
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-black border border-black dark:border-white rounded-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-black dark:border-white pb-3">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {isEdit ? "Edit Passenger" : "Add Passenger"}
          </h2>
          <button
            onClick={onClose}
            className="text-black dark:text-white hover:opacity-70 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Booking Dropdown */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Booking *
              </label>
              <select
                name="booking_id"
                value={formData.booking_id}
                onChange={handleChange}
                required
                className="
                w-full px-3 py-2
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                rounded-lg
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
              >
                <option value="">Select Booking</option>
                {bookings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.bookingReference} — {b.user_id?.firstName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Passenger Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="
              w-full px-3 py-2
              border border-black dark:border-white
              bg-white dark:bg-black
              text-black dark:text-white
              rounded-lg
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none
            "
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="
              w-full px-3 py-2
              border border-black dark:border-white
              bg-white dark:bg-black
              text-black dark:text-white
              rounded-lg
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none
            "
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="
              w-full px-3 py-2
              border border-black dark:border-white
              bg-white dark:bg-black
              text-black dark:text-white
              rounded-lg
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none
            "
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-black dark:border-white">
            <button
              type="button"
              onClick={onClose}
              className="
              px-4 py-2 rounded-lg
              border border-black dark:border-white
              bg-gray-200 dark:bg-gray-500
              text-black dark:text-white
              hover:opacity-70
            "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
              px-5 py-2 rounded-lg
              bg-blue-600 dark:bg-blue-500
              text-white dark:text-black
              hover:opacity-80
            "
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerModal;
