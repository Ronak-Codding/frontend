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
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
        return sortConfig.direction === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter, advancedFilters]);

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
      const escapeCSV = (value) => `"${value?.replace(/"/g, '""') || ""}"`;

      const csvData = dataToExport.map((airport) => [
        escapeCSV(airport.airport_code),
        escapeCSV(airport.airport_name),
        escapeCSV(airport.city),
        escapeCSV(airport.country),
        escapeCSV(airport.status),
        escapeCSV(new Date(airport.createdAt).toLocaleDateString()),
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
    <div className="flex justify-between py-2">
      <span className="font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <span className="text-gray-900 dark:text-gray-100">{value || "-"}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-[10001] px-5 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white font-medium`}
        >
          <div className="flex items-center space-x-2">
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* View Airport Modal */}
      {viewAirport && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Airport Details
              </h2>
              <button
                onClick={() => setViewAirport(null)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-2 divide-y divide-gray-100 dark:divide-gray-700">
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
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewAirport(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Airports Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Airports:{" "}
            <span className="font-semibold">{airports.length}</span> | Filtered:{" "}
            <span className="font-semibold">
              {filteredAndSortedAirports.length}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Export Button */}
          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={exportAirports}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Airport
          </button>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, city, country, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAirports.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedAirports.length} airport(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("Publish")}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
            >
              Set Publish
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("Draft")}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition"
            >
              Set Draft
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedAirports([])}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Airports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedAirports.length === currentAirports.length &&
                      currentAirports.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("airport_code")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Code</span>
                    {sortConfig.key === "airport_code" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("airport_name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Airport Name</span>
                    {sortConfig.key === "airport_name" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("city")}
                >
                  <div className="flex items-center space-x-1">
                    <span>City</span>
                    {sortConfig.key === "city" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("country")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Country</span>
                    {sortConfig.key === "country" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortConfig.key === "status" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {sortConfig.key === "createdAt" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {currentAirports.length > 0 ? (
                currentAirports.map((airport) => (
                  <tr
                    key={airport._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedAirports.includes(airport._id)}
                        onChange={() => toggleAirportSelection(airport._id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded font-bold text-xs text-blue-800 dark:text-blue-300">
                        {airport.airport_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {airport.airport_name}
                    </td>
                    <td className="px-4 py-3">{airport.city}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center">
                        <span className="mr-1 text-lg">
                          {/* {getFlagEmoji(airport.country)} */}
                        </span>
                        {airport.country}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          airport.status === "Publish"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {airport.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(airport.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {/* <button
                          onClick={() => setViewAirport(airport)}
                          className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded transition"
                          title="View"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button> */}
                        <button
                          onClick={() => openEditModal(airport)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            toggleStatus(airport._id, airport.status)
                          }
                          className={`p-1.5 rounded transition ${
                            airport.status === "Publish"
                              ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                              : "text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                          }`}
                          title={
                            airport.status === "Publish"
                              ? "Set to Draft"
                              : "Set to Publish"
                          }
                        >
                          {airport.status === "Publish" ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(airport._id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No airports found
                    </p>
                    <button
                      onClick={openAddModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition inline-flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Your First Airport
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`
                px-4 py-2 text-sm rounded-lg border transition-all
                ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-10 h-10 text-sm rounded-lg transition-all
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`
                px-4 py-2 text-sm rounded-lg border transition-all
                ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }
              `}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? "Edit Airport" : "Add New Airport"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Airport Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Airport Code <span className="text-red-500">*</span>
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
                    placeholder="e.g., JFK"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Airport Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Airport Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.airport_name}
                    onChange={(e) =>
                      setFormData({ ...formData, airport_name: e.target.value })
                    }
                    placeholder="e.g., John F. Kennedy International Airport"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g., New York"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country <span className="text-red-500">*</span>
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
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                      Processing...
                    </>
                  ) : editingId ? (
                    "Update Airport"
                  ) : (
                    "Add Airport"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get flag emoji (you may want to move this to a separate utility)
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return "";

  // Convert country name to code mapping (simplified - you might want a proper mapping)
  const countryToCode = {
    "United States": "US",
    "United Kingdom": "GB",
    Canada: "CA",
    Australia: "AU",
    India: "IN",
    // Add more mappings as needed
  };

  const code = countryToCode[countryCode] || countryCode;

  if (code.length === 2) {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }
  return "";
};

export default Airports;
