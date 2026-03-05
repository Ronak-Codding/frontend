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
  const [viewAirport, setViewAirport] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "airport_name",
    direction: "asc",
  });
  const [exportFormat, setExportFormat] = useState("csv");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    country: "",
    city: "",
  });

  const [formData, setFormData] = useState({
    airport_name: "",
    city: "",
    country: "",
    airport_code: "",
    status: "Publish",
  });

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    toast(message, { type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/airports/allAirports",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAirports(response.data);
    } catch (error) {
      toast.error("Failed to fetch airports");
      showNotification("Failed to fetch airports", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SORTING FUNCTION ================= */
  const sortedAirports = () => {
    const filtered = filteredAirports();
    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and search logic
  const filteredAirports = () => {
    return airports.filter((airport) => {
      const matchesSearch =
        airport.airport_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        airport.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.airport_code?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        airport.status?.toLowerCase() === filter.toLowerCase();

      const matchesCountry =
        !advancedFilters.country ||
        airport.country
          ?.toLowerCase()
          .includes(advancedFilters.country.toLowerCase());

      const matchesCity =
        !advancedFilters.city ||
        airport.city
          ?.toLowerCase()
          .includes(advancedFilters.city.toLowerCase());

      return matchesSearch && matchesFilter && matchesCountry && matchesCity;
    });
  };

  const filteredAndSortedAirports = sortedAirports();

  // Pagination logic
  const indexOfLastAirport = currentPage * airportsPerPage;
  const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
  const currentAirports = filteredAndSortedAirports.slice(
    indexOfFirstAirport,
    indexOfLastAirport,
  );
  const totalPages = Math.ceil(
    filteredAndSortedAirports.length / airportsPerPage,
  );

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
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        // Update
        await axios.put(
          `http://localhost:5000/api/airports/updateAirport/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        showNotification("Airport updated successfully", "success");
      } else {
        // Create
        await axios.post("http://localhost:5000/api/airports", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Airport added successfully", "success");
      }
      setShowModal(false);
      fetchAirports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save airport");
      showNotification(
        error.response?.data?.message || "Failed to save airport",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this airport?")) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:5000/api/airports/deleteAirport/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        showNotification("Airport deleted successfully", "success");
        fetchAirports();
      } catch (error) {
        toast.error("Failed to delete airport");
        showNotification("Failed to delete airport", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Publish" ? "Draft" : "Publish";
      await axios.patch(
        `http://localhost:5000/api/airports/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showNotification(`Status changed to ${newStatus}`, "success");
      fetchAirports();
    } catch (error) {
      toast.error("Failed to update status");
      showNotification("Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedAirports.length} selected airports?`))
      return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedAirports.map((id) =>
          axios.delete(
            `http://localhost:5000/api/airports/deleteAirport/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ),
      );

      setAirports(airports.filter((a) => !selectedAirports.includes(a._id)));
      setSelectedAirports([]);
      setShowBulkActions(false);
      showNotification(
        `${selectedAirports.length} airports deleted successfully`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to delete airports", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK STATUS UPDATE ================= */
  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedAirports.map((id) =>
          axios.patch(
            `http://localhost:5000/api/airports/${id}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ),
      );

      await fetchAirports();
      setSelectedAirports([]);
      setShowBulkActions(false);
      showNotification(
        `${selectedAirports.length} airports updated to ${newStatus}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update airports", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT AIRPORTS ================= */
  const exportAirports = () => {
    const dataToExport = filteredAndSortedAirports;

    if (exportFormat === "csv") {
      const headers = [
        "Airport Code",
        "Airport Name",
        "City",
        "Country",
        "Status",
        "Created Date",
      ];
      const csvData = dataToExport.map((airport) => [
        airport.airport_code,
        airport.airport_name,
        airport.city,
        airport.country,
        airport.status,
        new Date(airport.createdAt).toLocaleDateString(),
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `airports_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `airports_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} airports`, "success");
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = () => {
    if (selectedAirports.length === currentAirports.length) {
      setSelectedAirports([]);
    } else {
      setSelectedAirports(currentAirports.map((a) => a._id));
    }
  };

  /* ================= TOGGLE SELECTION ================= */
  const toggleAirportSelection = (airportId) => {
    if (selectedAirports.includes(airportId)) {
      setSelectedAirports(selectedAirports.filter((id) => id !== airportId));
    } else {
      setSelectedAirports([...selectedAirports, airportId]);
    }
  };

  const Detail = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );

  if (loading && !airports.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="airports-container p-6 min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 z-[10000] flex items-center justify-center">
          <div className="bg-white dark:bg-black p-4 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-[10001] px-4 py-2 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* View Airport Modal */}
      {viewAirport && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-black border border-black dark:border-white/20 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black dark:border-white/20">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Airport Details
              </h2>
              <button
                onClick={() => setViewAirport(null)}
                className="text-2xl text-black dark:text-white hover:opacity-70 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-2 text-sm text-black dark:text-white">
              <Detail label="Airport Code" value={viewAirport.airport_code} />
              <Detail label="Airport Name" value={viewAirport.airport_name} />
              <Detail label="City" value={viewAirport.city} />
              <Detail label="Country" value={viewAirport.country} />
              <Detail label="Status" value={viewAirport.status} />
              {viewAirport.createdAt && (
                <Detail
                  label="Created"
                  value={new Date(viewAirport.createdAt).toLocaleDateString()}
                />
              )}
              {viewAirport.updatedAt &&
                viewAirport.updatedAt !== viewAirport.createdAt && (
                  <Detail
                    label="Last Updated"
                    value={new Date(viewAirport.updatedAt).toLocaleDateString()}
                  />
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-black dark:border-white/20">
              <button
                onClick={() => setViewAirport(null)}
                className="px-5 py-2 rounded-lg border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Airports Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Airports: {airports.length} | Filtered:{" "}
            {filteredAndSortedAirports.length}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Export Button */}
          <div className="relative flex items-center">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-l-lg bg-white text-sm focus:outline-none"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={exportAirports}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg font-medium"
            >
              <i className="fas fa-download mr-2"></i>Export
            </button>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center"
            onClick={openAddModal}
          >
            <i className="fas fa-plus mr-2"></i>Add New Airport
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-colors">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>

              <input
                type="text"
                placeholder="Search airports by name, city, country, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Status Filter */}
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm
                     border border-gray-300 dark:border-gray-700
                     rounded-lg
                     bg-gray-50 dark:bg-neutral-100
                     text-black dark:text-white
                     focus:bg-white dark:focus:bg-neutral-100
                     focus:ring-1 focus:ring-black dark:focus:ring-white
                     outline-none transition"
              >
                <option value="all">All Status</option>
                <option value="publish">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <input
                type="text"
                placeholder="Filter by country..."
                value={advancedFilters.country}
                onChange={(e) =>
                  setAdvancedFilters({
                    ...advancedFilters,
                    country: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm
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
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAirports.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedAirports.length} airport(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("Publish")}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Set Publish
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("Draft")}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
            >
              Set Draft
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedAirports([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Airports Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedAirports.length === currentAirports.length &&
                        currentAirports.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("airport_code")}
                  >
                    Code{" "}
                    {sortConfig.key === "airport_code" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("airport_name")}
                  >
                    Airport Name{" "}
                    {sortConfig.key === "airport_name" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("city")}
                  >
                    City{" "}
                    {sortConfig.key === "city" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("country")}
                  >
                    Country{" "}
                    {sortConfig.key === "country" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("status")}
                  >
                    Status{" "}
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort("createdAt")}
                  >
                    Created{" "}
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                        <input
                          type="checkbox"
                          checked={selectedAirports.includes(airport._id)}
                          onChange={() => toggleAirportSelection(airport._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
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
                          {/* <button
                            className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                            onClick={() => handleView(airport._id)}
                            title="View"
                          >
                            <i className="fas fa-eye"></i>
                          </button> */}
                          <button
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            onClick={() => openEditModal(airport)}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
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
                    <td colSpan="8" className="px-6 py-12 text-center">
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
            <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
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
                  disabled={loading}
                  className="
                    px-4 py-2 rounded-md
                    border border-black dark:border-white
                    bg-blue-600 dark:bg-blue-500
                    text-white dark:text-black
                    hover:opacity-80
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Processing..." : editingId ? "Update" : "Save"}{" "}
                  Airport
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
