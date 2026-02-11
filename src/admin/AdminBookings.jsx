import React, { useEffect, useState } from "react";
import AddBookingModal from "./AddBookingModal";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [query, setQuery] = useState("");

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings/allBookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res = await fetch(
      `http://localhost:5000/api/bookings/search?q=${query}`,
    );
    const data = await res.json();
    setBookings(data);
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
      method: "PUT",
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
      `http://localhost:5000/api/bookings/updateBooking/${booking._id}`,
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

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    await fetch(`http://localhost:5000/api/bookings/deleteBooking/${id}`, {
      method: "DELETE",
    });
    fetchBookings();
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">All Bookings</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Booking
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="w-72 px-4 py-2 border rounded-lg  placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          placeholder="Search by Ref / Name / Email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Ref</th>
              {/* <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th> */}
              <th className="px-4 py-3">Flight</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Passengers</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Booked On</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-700 font-medium">
            {currentBookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.bookingReference}</td>
                {/* <td className="px-4 py-3">
                  {b.user_id?.firstName} {b.user_id?.lastName}
                </td>
                <td className="px-4 py-3">{b.user_id?.email}</td> */}
                <td className="px-4 py-3">
                  {b.flight_id?.flight_number || "-"}
                </td>
                <td className="px-4 py-3">
                  {b.flight_id?.from_airport?.airport_code} →
                  {b.flight_id?.to_airport?.airport_code}
                </td>
                <td className="px-4 py-3">{b.total_passengers}</td>
                <td className="px-4 py-3 font-semibold">₹{b.total_amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(b.booking_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {b.status === "Confirmed" && (
                    <button
                      onClick={() => cancelBooking(b._id)}
                      className="px-3 py-1 text-xs rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleEdit(b)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => deleteBooking(b._id)}
                    className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

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
