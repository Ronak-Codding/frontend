import React, { useEffect, useState } from "react";
import AddBookingModal from "./AddBookingModal";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    const res = await fetch(
      `http://localhost:5000/api/bookings/search?q=${query}`,
    );

    if (!res.ok) {
      alert("No booking found");
      return;
    }

    const data = await res.json();
    setBookings(data);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Booking fetch error:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    const res = await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
      method: "PUT",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
    } else {
      fetchBookings();
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "DELETE",
    });
    fetchBookings();
  };

  const handleEdit = async (booking) => {
    const newPassengers = prompt(
      "Enter passenger count",
      booking.total_passengers,
    );

    if (!newPassengers) return;

    const res = await fetch(
      `http://localhost:5000/api/bookings/${booking._id}`,
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
      alert(data.message);
    } else {
      fetchBookings();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>All Bookings</h3>
        <button className="btn btn-success" onClick={() => setShowAdd(true)}>
          + Add Booking
        </button>
      </div>

      <input
        type="text"
        className="form-control w-50 d-inline-block"
        placeholder="Search by Ref / Name / Email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch} className="btn btn-primary ms-2 mb-2">
        Search
      </button>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Booking Ref</th>
            <th>User</th>
            <th>Email</th>
            <th>Flight</th>
            <th>Route</th>
            <th>Passengers</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Booked On</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.bookingReference}</td>
              <td>
                {b.user_id?.firstName} {b.user_id?.lastName}
              </td>
              <td>{b.user_id?.email}</td>

              <td>{b.flight_id?.flight_number || "-"}</td>

              <td>
                {b.flight_id?.from_airport?.airport_code} →
                {b.flight_id?.to_airport?.airport_code}
              </td>

              <td>{b.total_passengers}</td>
              <td>₹{b.total_amount}</td>

              <td>
                <span
                  className={`badge ${
                    b.status === "Confirmed" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {b.status}
                </span>
              </td>

              <td>{new Date(b.booking_date).toLocaleDateString()}</td>

              <td>
                {b.status === "Confirmed" && (
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                )}

                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(b)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBooking(b._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && (
        <AddBookingModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
};

export default AdminBookings;
