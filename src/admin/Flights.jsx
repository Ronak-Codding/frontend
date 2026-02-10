import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "./Flights.css";

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

  const [publishedCount, setPublishedCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

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

      setPublishedCount(
        flightsData.filter((f) => f.admin_status === "Publish").length,
      );
      setDraftCount(
        flightsData.filter((f) => f.admin_status === "Draft").length,
      );

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

  const columns = [
    {
      name: "Flight No",
      selector: (row) => row.flight_number,
      sortable: true,
    },
    {
      name: "Airline",
      cell: (row) => (
        <div>
          <div>{row.airline?.airline_name}</div>
          <div className="text-gray-500 text-sm">
            ({row.airline?.airline_code})
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Route",
      cell: (row) => (
        <span>
          {row.from_airport?.city} → {row.to_airport?.city}
        </span>
      ),
    },
    {
      name: "Departure",
      cell: (row) => (
        <div>
          <div>{new Date(row.departure_time).toLocaleDateString()}</div>
          <div className="text-gray-500 text-sm">
            {new Date(row.departure_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      name: "Arrival",
      cell: (row) => (
        <div>
          <div>{new Date(row.arrival_time).toLocaleDateString()}</div>
          <div className="text-gray-500 text-sm">
            {new Date(row.arrival_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      name: "Duration",
      selector: (row) => {
        const h = Math.floor(row.duration / 60);
        const m = row.duration % 60;
        return `${h}h ${m}m`;
      },
    },
    {
      name: "Price",
      selector: (row) => `$${row.price}`,
      sortable: true,
    },
    {
      name: "Seats",
      cell: (row) => (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
              row.seats_available < 10
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {row.seats_available}
          </span>
          <span>/ {row.total_seats}</span>
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Scheduled"
              ? "bg-blue-100 text-blue-800"
              : row.status === "Delayed"
                ? "bg-yellow-100 text-yellow-800"
                : row.status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Admin",
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
            row.admin_status === "Publish"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => toggleFlightStatus(row._id, row.admin_status)}
        >
          {row.admin_status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            onClick={() => handleEditClick(row)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            onClick={() => handleDelete(row._id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    //  bg-gray-50
    <div className="flights-container p-6  min-h-screen"> 
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Flights Management
          </h2>
          <p className="text-gray-600">Manage all flights in the system</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus mr-2"></i>Add New Flight
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search flights by flight number, airline, or airport code..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredFlights}
              pagination
              highlightOnHover
              striped
              responsive
              persistTableHead
              noDataComponent={
                <div className="py-12 text-center">
                  <i className="fas fa-plane text-5xl text-gray-300 mb-4"></i>
                  <h5 className="text-lg font-medium text-gray-800">
                    No flights found
                  </h5>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your search criteria
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowAddModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-lg  w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Flight</h3>
              <button onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
           
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <form onSubmit={handleAddFlight}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flight Number *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="flight_number"
                        value={newFlight.flight_number}
                        onChange={handleNewFlightInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Airline *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="airline"
                        value={newFlight.airline}
                        onChange={handleNewFlightInputChange}
                        required
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Airport *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="from_airport"
                        value={newFlight.from_airport}
                        onChange={handleNewFlightInputChange}
                        required
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Airport *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="to_airport"
                        value={newFlight.to_airport}
                        onChange={handleNewFlightInputChange}
                        required
                      >
                        <option value="">Select Airport</option>
                        {Array.isArray(airports) &&
                          airports
                            .filter((a) => a.status === "Publish")
                            .map((airport) => (
                              <option
                                key={airport._id}
                                value={airport._id}
                                disabled={
                                  airport._id === newFlight.from_airport
                                }
                              >
                                {airport.iata_code} - {airport.city}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Time *
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="departure_time"
                        value={newFlight.departure_time}
                        onChange={handleNewFlightInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Time *
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="arrival_time"
                        value={newFlight.arrival_time}
                        onChange={handleNewFlightInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="price"
                        value={newFlight.price}
                        onChange={handleNewFlightInputChange}
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Seats *
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="total_seats"
                        value={newFlight.total_seats}
                        onChange={handleNewFlightInputChange}
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seats Available
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="seats_available"
                        value={newFlight.seats_available}
                        onChange={handleNewFlightInputChange}
                        min="0"
                        max={newFlight.total_seats}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aircraft Type
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="aircraft_type"
                        value={newFlight.aircraft_type}
                        onChange={handleNewFlightInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="status"
                        value={newFlight.status}
                        onChange={handleNewFlightInputChange}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="admin_status"
                        value={newFlight.admin_status}
                        onChange={handleNewFlightInputChange}
                      >
                        <option value="Publish">Publish</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3 gap-3">
                    <button
                      type="button"
                      className="px-4 py-2  bg-gray-400 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 "
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Flight
                    </button>
                  </div>
                </form>
              </div>
            
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {showEditModal && currentFlight && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Edit Flight {currentFlight.flight_number}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowEditModal(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flight Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="flight_number"
                        value={editFlight.flight_number}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="status"
                        value={editFlight.status}
                        onChange={handleEditInputChange}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="admin_status"
                        value={editFlight.admin_status}
                        onChange={handleEditInputChange}
                      >
                        <option value="Publish">Publish</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="price"
                        value={editFlight.price}
                        onChange={handleEditInputChange}
                        required
                        min="0"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seats Available
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        name="seats_available"
                        value={editFlight.seats_available}
                        onChange={handleEditInputChange}
                        min="0"
                        max={currentFlight.total_seats}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Update Flight
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;
