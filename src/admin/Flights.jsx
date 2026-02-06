import React, { useState, useEffect } from "react";
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
      const flightsRes = await fetch("http://localhost:5000/api/flights");
      const flightsData = await flightsRes.json();
      setFlights(flightsData);
      setFilteredFlights(flightsData);

      const airlinesRes = await fetch("http://localhost:5000/api/airlines");
      const airlinesData = await airlinesRes.json();
      setAirlines(
        Array.isArray(airlinesData)
          ? airlinesData
          : airlinesData.airlines || [],
      );

      const airportsRes = await fetch("http://localhost:5000/api/airports");
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

    //   alert("Flight added successfully");
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
    await fetch(`http://localhost:5000/api/flights/${currentFlight._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editFlight),
    });
    setShowEditModal(false);
    fetchAllData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;
    await fetch(`http://localhost:5000/api/flights/${id}`, {
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flights-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Flights Management</h2>
          <p className="text-muted">Manage all flights in the system</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus me-2"></i>Add New Flight
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="text-muted">Total Flights</h5>
                  <h3>{flights.length}</h3>
                </div>
                <i className="fas fa-plane fa-2x text-primary"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="text-muted">Published</h5>
                  <h3>{publishedCount}</h3>
                </div>
                <i className="fas fa-globe fa-2x text-success"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="text-muted">Draft</h5>
                  <h3>{draftCount}</h3>
                </div>
                <i className="fas fa-file-alt fa-2x text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search flights by flight number, airline, or airport code..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="fs-6">
                <tr>
                  <th>Flight Number</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Admin Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight) => {
                  // Calculate duration hours and minutes
                  const hours = Math.floor(flight.duration / 60);
                  const minutes = flight.duration % 60;

                  return (
                    <tr key={flight._id}>
                      <td>
                        <strong>{flight.flight_number}</strong>
                      </td>
                      <td>
                        {flight.airline?.airline_name}
                        <br />
                        <small className="text-muted">
                          ({flight.airline?.airline_code})
                        </small>
                      </td>

                      <td className="route-cell">
                        <span className="route-airport">
                          {flight.from_airport?.city}
                        </span>

                        <span className="route-arrow">→</span>

                        <span className="route-airport">
                          {flight.to_airport?.city}
                        </span>
                      </td>

                      <td>
                        {new Date(flight.departure_time).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          {new Date(flight.departure_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </small>
                      </td>
                      <td>
                        {new Date(flight.arrival_time).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          {new Date(flight.arrival_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </small>
                      </td>
                      <td>
                        {hours}h {minutes}m
                      </td>
                      <td>${flight.price}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            className={`badge ${
                              flight.seats_available < 10
                                ? "bg-danger"
                                : "bg-success"
                            } me-2`}
                          >
                            {flight.seats_available}
                          </span>
                          / {flight.total_seats}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            flight.status === "Scheduled"
                              ? "primary"
                              : flight.status === "Delayed"
                                ? "warning"
                                : flight.status === "Cancelled"
                                  ? "danger"
                                  : "success"
                          }`}
                        >
                          {flight.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            flight.admin_status === "Publish"
                              ? "success"
                              : "secondary"
                          } cursor-pointer`}
                          onClick={() =>
                            toggleFlightStatus(flight._id, flight.admin_status)
                          }
                          title="Click to toggle status"
                        >
                          {flight.admin_status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEditClick(flight)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(flight._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredFlights.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-plane fa-3x text-muted mb-3"></i>
                <h5>No flights found</h5>
                <p className="text-muted">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Flight</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddModal(false)}
              ></button>
            </div>
            <form onSubmit={handleAddFlight}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Flight Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="flight_number"
                      value={newFlight.flight_number}
                      onChange={handleNewFlightInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Airline *</label>
                    <select
                      className="form-control"
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">From Airport *</label>
                    <select
                      className="form-control"
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">To Airport *</label>
                    <select
                      className="form-control"
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
                              disabled={airport._id === newFlight.from_airport}
                            >
                              {airport.iata_code} - {airport.city}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Departure Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="departure_time"
                      value={newFlight.departure_time}
                      onChange={handleNewFlightInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Arrival Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="arrival_time"
                      value={newFlight.arrival_time}
                      onChange={handleNewFlightInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={newFlight.price}
                      onChange={handleNewFlightInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Total Seats *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="total_seats"
                      value={newFlight.total_seats}
                      onChange={handleNewFlightInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seats Available</label>
                    <input
                      type="number"
                      className="form-control"
                      name="seats_available"
                      value={newFlight.seats_available}
                      onChange={handleNewFlightInputChange}
                      min="0"
                      max={newFlight.total_seats}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Aircraft Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="aircraft_type"
                      value={newFlight.aircraft_type}
                      onChange={handleNewFlightInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Admin Status</label>
                    <select
                      className="form-control"
                      name="admin_status"
                      value={newFlight.admin_status}
                      onChange={handleNewFlightInputChange}
                    >
                      <option value="Publish">Publish</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {showEditModal && currentFlight && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Flight {currentFlight.flight_number}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Flight Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="flight_number"
                      value={editFlight.flight_number}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Admin Status</label>
                    <select
                      className="form-control"
                      name="admin_status"
                      value={editFlight.admin_status}
                      onChange={handleEditInputChange}
                    >
                      <option value="Publish">Publish</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={editFlight.price}
                      onChange={handleEditInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seats Available</label>
                    <input
                      type="number"
                      className="form-control"
                      name="seats_available"
                      value={editFlight.seats_available}
                      onChange={handleEditInputChange}
                      min="0"
                      max={currentFlight.total_seats}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
