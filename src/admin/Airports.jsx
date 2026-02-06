import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CountrySelect from "./CountrySelect";
import "./Airports.css";

const Airports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const airportsPerPage = 10;

  // For add/edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    airport_name: "",
    city: "",
    country: "",
    airport_code: "",
    status: "Publish",
  });

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/airports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirports(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch airports");
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredAirports = airports.filter((airport) => {
    const matchesSearch =
      airport.airport_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" || airport.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastAirport = currentPage * airportsPerPage;
  const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
  const currentAirports = filteredAirports.slice(
    indexOfFirstAirport,
    indexOfLastAirport,
  );
  const totalPages = Math.ceil(filteredAirports.length / airportsPerPage);

  // Modal functions
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      airport_name: "",
      city: "",
      country: "",
      airport_code: "",
      status: "Publish",
    });
    setShowModal(true);
  };

  const openEditModal = (airport) => {
    setEditingId(airport._id);
    setFormData({
      airport_name: airport.airport_name,
      city: airport.city,
      country: airport.country,
      airport_code: airport.airport_code,
      status: airport.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        // Update
        await axios.put(
          `http://localhost:5000/api/airports/update/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Airport updated successfully");
      } else {
        // Create
        await axios.post("http://localhost:5000/api/airports", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Airport added successfully");
      }
      setShowModal(false);
      fetchAirports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save airport");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this airport?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/airports/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Airport deleted successfully");
        fetchAirports();
      } catch (error) {
        toast.error("Failed to delete airport");
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Publish" ? "Draft" : "Publish";
      await axios.patch(
        `http://localhost:5000/api/airports/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Status changed to ${newStatus}`);
      fetchAirports();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="airports-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Airport Management</h2>
          <p className="text-muted mb-0">Manage airports data</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="fas fa-plus me-2"></i>Add New Airport
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Total Airports</h5>
                  <h3 className="mb-0">{airports.length}</h3>
                </div>
                <div className="icon-circle bg-primary">
                  <i className="fas fa-plane"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Published</h5>
                  <h3 className="mb-0">
                    {airports.filter((a) => a.status === "Publish").length}
                  </h3>
                </div>
                <div className="icon-circle bg-success">
                  <i className="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Draft</h5>
                  <h3 className="mb-0">
                    {airports.filter((a) => a.status === "Draft").length}
                  </h3>
                </div>
                <div className="icon-circle bg-warning">
                  <i className="fas fa-pen"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Countries</h5>
                  <h3 className="mb-0">
                    {[...new Set(airports.map((a) => a.country))].length}
                  </h3>
                </div>
                <div className="icon-circle bg-info">
                  <i className="fas fa-globe"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search airports by name, city, country, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="publish">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Airports Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="font-bold fs-5">
                <tr>
                  <th>Code</th>
                  <th>Airport Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="w-10">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAirports.length > 0 ? (
                  currentAirports.map((airport) => (
                    <tr key={airport._id}>
                      <td>
                        <span className="badge bg-primary fs-6">
                          {airport.airport_code}
                        </span>
                      </td>
                      <td>{airport.airport_name}</td>
                      <td>{airport.city}</td>
                      <td>
                        <span className="flag-icon">{airport.country}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            airport.status === "Publish"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {airport.status}
                        </span>
                      </td>
                      <td>
                        {new Date(airport.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openEditModal(airport)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() =>
                              toggleStatus(airport._id, airport.status)
                            }
                            title="Toggle Status"
                          >
                            <i
                              className={`fas fa-${
                                airport.status === "Publish"
                                  ? "eye-slash"
                                  : "eye"
                              }`}
                            ></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(airport._id)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        <i className="fas fa-inbox fa-2x mb-3"></i>
                        <p>No airports found</p>
                        <button
                          className="btn btn-primary mt-2"
                          onClick={openAddModal}
                        >
                          Add Your First Airport
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-end">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? "Edit Airport" : "Add New Airport"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Airport Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.airport_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            airport_code: e.target.value.toUpperCase(),
                          })
                        }
                        maxLength="3"
                        minLength="3"
                        required
                      />
                      <small className="text-muted">
                        3-letter airport code (e.g., DEL, BOM)
                      </small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="Publish">Publish</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Airport Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.airport_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            airport_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Country *</label>
                      {/* 🌍 Country Dropdown */}
                      <CountrySelect
                        value={formData.country}
                        onChange={(country) => setFormData({ ...formData, country })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? "Update" : "Save"} Airport
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Backdrop WITHOUT click handler */}
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default Airports;
