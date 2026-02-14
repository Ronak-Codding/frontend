import React, { useEffect, useState } from "react";
import AddBookingModal from "./AddBookingModal";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const [query, setQuery] = useState("");

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings/allBookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = async (searchValue) => {
    const res = await fetch(
      `http://localhost:5000/api/bookings/search?q=${searchValue}`,
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

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  useEffect(() => {
    if (!query.trim()) {
      fetchBookings();
    } else {
      handleSearch(query);
    }
  }, [query]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">All Bookings</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
        <i className="fas fa-plus mr-2"></i>Add Booking
        </button>
      </div>

      {/* Search */}
      {/* Search & Filter Card */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 transition-colors">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
          </div>

          <input
            type="text"
            placeholder="Search by Ref / Name / Email"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-sm
                 border border-gray-300 dark:border-gray-700
                 rounded-lg
                 bg-gray-50 dark:bg-neutral-100
                 text-black dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500
                 focus:bg-white dark:focus:bg-neutral-100
                 focus:ring-1 focus:ring-black dark:focus:ring-white
                 outline-none transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Booking Ref</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
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
                <td className="px-4 py-3">
                  {b.user_id?.firstName} {b.user_id?.lastName}
                </td>
                <td className="px-4 py-3">{b.user_id?.email}</td>
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
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    onClick={() => handleEdit(b)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => deleteBooking(b._id)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
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
        <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`
        px-3 py-1.5 text-sm rounded-lg border
        transition-all duration-200
        ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed border-gray-300 bg-white text-gray-400"
            : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
        }
      `}
          >
            ‹ Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
            px-3 py-1.5 text-sm rounded-lg border transition-all duration-200
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }
          `}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`
        px-3 py-1.5 text-sm rounded-lg border
        transition-all duration-200
        ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed border-gray-300 bg-white text-gray-400"
            : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
        }
      `}
          >
            Next ›
          </button>
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
