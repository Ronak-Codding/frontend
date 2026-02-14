import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PassengerModal from "./PassengerModal";

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const passengersPerPage = 5;

  // ================= FETCH =================
  const fetchPassengers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/passengers/allPassengers",
      );
      setPassengers(res.data);
    } catch (error) {
      toast.error("Failed to load passengers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete passenger?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/passengers/deletePassenger/${id}`,
      );
      toast.success("Passenger deleted");
      fetchPassengers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredPassengers = useMemo(() => {
    return passengers.filter(
      (p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking_id?.bookingReference
          ?.toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [passengers, search]);

  // ================= PAGINATION =================
  const indexOfLast = currentPage * passengersPerPage;
  const indexOfFirst = indexOfLast - passengersPerPage;
  const currentPassengers = filteredPassengers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPassengers.length / passengersPerPage);

  return (
    <div className="p-6 min-h-screen">
      <div>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-800">
            Passengers Data
          </h2>

          <button
            onClick={() => {
              setSelectedPassenger(null);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center"
          >
            + Add Passenger
          </button>
        </div>
        {/* Search bar */}
        <div className="bg-white dark:bg-black rounded-md shadow-sm border border-gray-200 dark:border-gray-800 mb-5 transition-colors">
          <div className="p-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>

              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm
                   border border-gray-300 dark:border-gray-700
                   rounded-md
                   bg-gray-50 dark:bg-neutral-100
                   text-black dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:bg-white dark:focus:bg-neutral-100
                   focus:ring-1 focus:ring-black dark:focus:ring-white
                   outline-none transition"
                placeholder="Search by Name / Booking Ref"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">NO</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Seat</th>
                <th className="px-4 py-3">Booking Ref</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : currentPassengers.length > 0 ? (
                currentPassengers.map((row, index) => (
                  <tr key={row._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{indexOfFirst + index + 1}</td>
                    <td className="px-4 py-3 font-sm">{row.name}</td>
                    <td className="px-4 py-3">{row.age}</td>
                    <td className="px-4 py-3">{row.gender}</td>
                    <td className="px-4 py-3">{row.seat_number}</td>
                    <td className="px-4 py-3">
                      {row.booking_id?.bookingReference}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                          onClick={() => {
                            setSelectedPassenger(row);
                            setShowModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                          onClick={() => handleDelete(row._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    No passengers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
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
      </div>

      {showModal && (
        <PassengerModal
          passenger={selectedPassenger}
          onClose={() => setShowModal(false)}
          refresh={fetchPassengers}
        />
      )}
    </div>
  );
};

export default Passengers;
