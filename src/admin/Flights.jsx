import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);

  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 5;

  // const [publishedCount, setPublishedCount] = useState(0);
  // const [draftCount, setDraftCount] = useState(0);

  const [newFlight, setNewFlight] = useState({
    flight_number: "",
    airline: "",
    from_airport: "",
    to_airport: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    seats_available: "",
    total_seats: "",
    aircraft_type: "Boeing 737",
    status: "Scheduled",
    admin_status: "Publish",
  });

  const [editFlight, setEditFlight] = useState({
    flight_number: "",
    status: "Scheduled",
    admin_status: "Publish",
    price: "",
    seats_available: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const flightsRes = await fetch(
        "http://localhost:5000/api/flights/allFlights",
      );
      const flightsData = await flightsRes.json();
      setFlights(flightsData);
      setFilteredFlights(flightsData);

      const airlinesRes = await fetch(
        "http://localhost:5000/api/airlines/allAirlines",
      );
      const airlinesData = await airlinesRes.json();
      setAirlines(
        Array.isArray(airlinesData)
          ? airlinesData
          : airlinesData.airlines || [],
      );

      const airportsRes = await fetch(
        "http://localhost:5000/api/airports/allAirports",
      );
      const airportsData = await airportsRes.json();
      setAirports(airportsData);

      // setPublishedCount(
      //   flightsData.filter((f) => f.admin_status === "Publish").length,
      // );
      // setDraftCount(
      //   flightsData.filter((f) => f.admin_status === "Draft").length,
      // );

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredFlights(flights);
      setCurrentPage(1);

      return;
    }

    setFilteredFlights(
      flights.filter(
        (f) =>
          f.flight_number?.toLowerCase().includes(value) ||
          f.airline?.airline_name?.toLowerCase().includes(value) ||
          f.from_airport?.iata_code?.toLowerCase().includes(value) ||
          f.to_airport?.iata_code?.toLowerCase().includes(value),
      ),
    );
  };

  const calculateDuration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    return diff > 0 ? Math.round(diff / 60000) : 0;
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();

    if (newFlight.from_airport === newFlight.to_airport) {
      alert("From and To airport cannot be same");
      return;
    }

    const flightData = {
      ...newFlight,
      duration: calculateDuration(
        newFlight.departure_time,
        newFlight.arrival_time,
      ),
      price: Number(newFlight.price),
      total_seats: Number(newFlight.total_seats),
      seats_available: Number(
        newFlight.seats_available || newFlight.total_seats,
      ),
    };

    try {
      const res = await fetch("http://localhost:5000/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to add flight");
        return;
      }

      setShowAddModal(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFlightStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/flights/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_status: status === "Publish" ? "Draft" : "Publish",
      }),
    });
    fetchAllData();
  };

  const handleEditClick = (f) => {
    setCurrentFlight(f);
    setEditFlight({
      flight_number: f.flight_number,
      status: f.status,
      admin_status: f.admin_status,
      price: f.price,
      seats_available: f.seats_available,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await fetch(
      `http://localhost:5000/api/flights/updateFlight/${currentFlight._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFlight),
      },
    );
    setShowEditModal(false);
    fetchAllData();
  };

  const indexOfLast = currentPage * flightsPerPage;
  const indexOfFirst = indexOfLast - flightsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;
    await fetch(`http://localhost:5000/api/flights/deleteFlight/${id}`, {
      method: "DELETE",
    });
    fetchAllData();
  };

  const handleNewFlightInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((p) => ({ ...p, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFlight((p) => ({ ...p, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    //  bg-gray-50
    <div className="flights-container p-6  min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Flights Data
          </h2>
          {/* <p className="text-gray-600">Manage all flights in the system</p> */}
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus mr-2"></i>Add New Flight
        </button>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 text-sm font-medium">
                Total Flights
              </h5>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {flights.length}
              </h3>
            </div>
            <i className="fas fa-plane text-3xl text-blue-500"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 text-sm font-medium">Published</h5>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {publishedCount}
              </h3>
            </div>
            <i className="fas fa-globe text-3xl text-green-500"></i>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 text-sm font-medium">Draft</h5>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {draftCount}
              </h3>
            </div>
            <i className="fas fa-file-alt text-3xl text-yellow-500"></i>
          </div>
        </div>
      </div> */}

      {/* Search Bar */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-colors">
        <div className="p-4">
          <div className="relative">
            {/* Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
            </div>

            <input
              type="text"
              className="w-full pl-9 pr-3 py-2 text-sm
                   border border-gray-300 dark:border-gray-700
                   rounded-lg
                   bg-gray-50 dark:bg-neutral-100
                   text-black dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:bg-white dark:focus:bg-neutral-100
                   focus:ring-1 focus:ring-black dark:focus:ring-white
                   outline-none transition"
              placeholder="Search flights by flight number, airline, or airport code..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="bg-white rounded-lg shadow">                          
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Flight</th>
                <th className="px-4 py-3">Airline</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Departure</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y text-gray-700">
              {currentFlights.length > 0 ? (
                currentFlights.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-bold">{row.flight_number}</td>

                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {row.airline?.airline_name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        ({row.airline?.airline_code})
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {row.from_airport?.city} → {row.to_airport?.city}
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        {new Date(row.departure_time).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(row.departure_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {Math.floor(row.duration / 60)}h {row.duration % 60}m
                    </td>

                    <td className="px-4 py-3 font-medium">${row.price}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.seats_available < 10
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.seats_available}
                      </span>
                      <span className="ml-1 text-gray-500 text-xs font-medium">
                        / {row.total_seats}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === "Scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : row.status === "Delayed"
                              ? "bg-yellow-100 text-yellow-700"
                              : row.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        onClick={() =>
                          toggleFlightStatus(row._id, row.admin_status)
                        }
                        className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium ${
                          row.admin_status === "Publish"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {row.admin_status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(row)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-10">
                    <div className="text-gray-400">
                      <i className="fas fa-plane text-4xl mb-3"></i>
                      <p>No flights found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>

          {/* Modal */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6
                    bg-white dark:bg-black
                    border border-black dark:border-white
                    rounded-lg shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Add New Flight
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-black dark:text-white text-xl hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFlight}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flight Number */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Flight Number *
                  </label>
                  <input
                    type="text"
                    name="flight_number"
                    value={newFlight.flight_number}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Airline */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Airline *
                  </label>
                  <select
                    name="airline"
                    value={newFlight.airline}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="">Select Airline</option>
                    {Array.isArray(airlines) &&
                      airlines
                        .filter((airline) => airline.status === "Publish")
                        .map((airline) => (
                          <option key={airline._id} value={airline._id}>
                            {airline.airline_name} ({airline.airline_code})
                          </option>
                        ))}
                  </select>
                </div>

                {/* From Airport */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    From Airport *
                  </label>
                  <select
                    name="from_airport"
                    value={newFlight.from_airport}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="">Select Airport</option>
                    {Array.isArray(airports) &&
                      airports
                        .filter((a) => a.status === "Publish")
                        .map((airport) => (
                          <option
                            key={airport._id}
                            value={airport._id}
                            disabled={airport._id === newFlight.to_airport}
                          >
                            {airport.iata_code} - {airport.city}
                          </option>
                        ))}
                  </select>
                </div>

                {/* To Airport */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    To Airport *
                  </label>
                  <select
                    name="to_airport"
                    value={newFlight.to_airport}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="">Select Airport</option>
                    {Array.isArray(airports) &&
                      airports
                        .filter((a) => a.status === "Publish")
                        .map((airport) => (
                          <option
                            key={airport._id}
                            value={airport._id}
                            disabled={airport._id === newFlight.from_airport}
                          >
                            {airport.iata_code} - {airport.city}
                          </option>
                        ))}
                  </select>
                </div>

                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Departure Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="departure_time"
                    value={newFlight.departure_time}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Arrival Time */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Arrival Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="arrival_time"
                    value={newFlight.arrival_time}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newFlight.price}
                    onChange={handleNewFlightInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Total Seats */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    name="total_seats"
                    value={newFlight.total_seats}
                    onChange={handleNewFlightInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Seats Available */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Seats Available
                  </label>
                  <input
                    type="number"
                    name="seats_available"
                    value={newFlight.seats_available}
                    onChange={handleNewFlightInputChange}
                    min="0"
                    max={newFlight.total_seats}
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Aircraft Type */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Aircraft Type
                  </label>
                  <input
                    type="text"
                    name="aircraft_type"
                    value={newFlight.aircraft_type}
                    onChange={handleNewFlightInputChange}
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newFlight.status}
                    onChange={handleNewFlightInputChange}
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Admin Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Admin Status
                  </label>
                  <select
                    name="admin_status"
                    value={newFlight.admin_status}
                    onChange={handleNewFlightInputChange}
                    className="w-full px-3 py-2 border rounded-md
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-md
                       border-black dark:border-white
                       text-black dark:text-white
                       hover:bg-black hover:text-white
                       dark:hover:bg-white dark:hover:text-black
                       transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-md
                       bg-blue-600 dark:bg-blue-500
                       text-white dark:text-black
                       hover:opacity-80 transition"
                >
                  Add Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {showEditModal && currentFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          ></div>

          {/* Modal Box */}
          <div
            className="relative z-50 w-full max-w-lg mx-4 rounded-2xl shadow-2xl p-6
                    bg-white dark:bg-black
                    border border-black dark:border-white
                    animate-fadeIn"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Edit Flight {currentFlight.flight_number}
              </h3>

              <button
                onClick={() => setShowEditModal(false)}
                className="text-black dark:text-white text-xl transition hover:scale-110"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flight Number */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    name="flight_number"
                    value={editFlight.flight_number}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFlight.status}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 rounded-lg border
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Admin Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Admin Status
                  </label>
                  <select
                    name="admin_status"
                    value={editFlight.admin_status}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 rounded-lg border
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  >
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFlight.price}
                    onChange={handleEditInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 rounded-lg border
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>

                {/* Seats Available */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Seats Available
                  </label>
                  <input
                    type="number"
                    name="seats_available"
                    value={editFlight.seats_available}
                    onChange={handleEditInputChange}
                    min="0"
                    max={currentFlight.total_seats}
                    className="w-full px-3 py-2 rounded-lg border
                         bg-white dark:bg-black
                         text-black dark:text-white
                         border-black dark:border-white
                         outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border
                       border-black dark:border-white
                       text-black dark:text-white
                       hover:bg-black hover:text-white
                       dark:hover:bg-white dark:hover:text-black
                       transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500
                       text-white dark:text-black
                       rounded-lg transition shadow-md
                       hover:opacity-80"
                >
                  Update Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;
