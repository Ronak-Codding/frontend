import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CountrySelect from "./CountrySelect";

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
      const response = await axios.get(
        "http://localhost:5000/api/airports/allAirports",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
          `http://localhost:5000/api/airports/updateAirport/${editingId}`,
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
        await axios.delete(
          `http://localhost:5000/api/airports/deleteAirport/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="airports-container p-6  min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Airport Data
          </h2>
          {/* <p className="text-gray-600">Manage airports data</p> */}
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center"
          onClick={openAddModal}
        >
          <i className="fas fa-plus mr-2"></i>Add New Airport
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 placeholder-gray-500 rounded-lg  "
                  placeholder="Search airports by name, city, country, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full px-3 py-2.5 border border-gray-300  text-black dark:text-white rounded-lg  "
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
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Airport Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                {currentAirports.length > 0 ? (
                  currentAirports.map((airport) => (
                    <tr key={airport._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {airport.airport_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {airport.airport_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {airport.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        <span className="flag-icon">{airport.country}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            airport.status === "Publish"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {airport.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {new Date(airport.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            onClick={() => openEditModal(airport)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
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
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
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
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <i className="fas fa-inbox text-4xl mb-3"></i>
                        <p className="text-gray-600">No airports found</p>
                        <button
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
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
            <div className="mt-6 flex justify-end">
              <nav className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? "bg-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Box */}
          <div
            className="
      relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6
      bg-white dark:bg-black
      border border-black dark:border-white
      rounded-lg shadow-xl
    "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-black dark:border-white pb-3">
              <h3 className="text-lg font-medium text-black dark:text-white">
                {editingId ? "Edit Airport" : "Add New Airport"}
              </h3>
              <button
                className="text-black dark:text-white hover:opacity-70"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Airport Code */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Airport Code *
                  </label>
                  <input
                    type="text"
                    maxLength="3"
                    required
                    value={formData.airport_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        airport_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="
                h-9 w-full px-3 rounded-md
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="
                h-9 w-full px-3 rounded-md
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
                  >
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Airport Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Airport Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.airport_name}
                    onChange={(e) =>
                      setFormData({ ...formData, airport_name: e.target.value })
                    }
                    className="
                h-9 w-full px-3 rounded-md
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="
                h-9 w-full px-3 rounded-md
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                    Country *
                  </label>

                  <CountrySelect
                    value={formData.country}
                    onChange={(country) =>
                      setFormData({ ...formData, country })
                    }
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
              px-4 py-2 rounded-md
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
              px-4 py-2 rounded-md
              border border-black dark:border-white
              bg-blue-600 dark:bg-blue-500
              text-white dark:text-black
              hover:opacity-80
            "
                >
                  {editingId ? "Update" : "Save"} Airport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Airports;
