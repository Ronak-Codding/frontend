import React, { useEffect, useState } from "react";
import axios from "axios";
import AirlineModal from "./AirlineModal";

const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const airlinesPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewAirline, setViewAirline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "airline_name",
    direction: "asc",
  });
  const [exportFormat, setExportFormat] = useState("csv");
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [form, setForm] = useState({
    airline_name: "",
    airline_code: "",
    status: "Publish",
  });

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/airlines/allAirlines",
      );
      setAirlines(res.data.airlines || []);
    } catch (error) {
      console.error("Fetch airlines error:", error);
      showNotification("Failed to load airlines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  /* ================= SORTING FUNCTION ================= */
  const sortedAirlines = () => {
    const filtered = filteredAirlines();
    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

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

  const filteredAirlines = () => {
    return airlines.filter((a) => {
      const matchesSearch =
        a.airline_name?.toLowerCase().includes(search.toLowerCase()) ||
        a.airline_code?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || a.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredAndSortedAirlines = sortedAirlines();
  const totalPages = Math.ceil(
    filteredAndSortedAirlines.length / airlinesPerPage,
  );
  const indexOfLast = currentPage * airlinesPerPage;
  const indexOfFirst = indexOfLast - airlinesPerPage;
  const currentAirlines = filteredAndSortedAirlines.slice(
    indexOfFirst,
    indexOfLast,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/airlines/updateAirline/${editId}`,
          form,
        );
        showNotification("Airline updated successfully", "success");
      } else {
        await axios.post("http://localhost:5000/api/airlines", form);
        showNotification("Airline added successfully", "success");
      }

      setShowModal(false);
      setEditId(null);
      setForm({ airline_name: "", airline_code: "", status: "Publish" });
      fetchAirlines();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Operation failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (airline) => {
    setForm({
      airline_name: airline.airline_name,
      airline_code: airline.airline_code,
      status: airline.status,
    });
    setEditId(airline._id);
    setShowModal(true);
  };

  const handleView = (airline) => {
    setViewAirline(airline);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this airline?"))
      return;

    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/airlines/deleteAirline/${id}`,
      );
      showNotification("Airline deleted successfully", "success");
      fetchAirlines();
    } catch (error) {
      showNotification("Failed to delete airline", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedAirlines.length} selected airlines?`))
      return;

    setLoading(true);
    try {
      await Promise.all(
        selectedAirlines.map((id) =>
          axios.delete(
            `http://localhost:5000/api/airlines/deleteAirline/${id}`,
          ),
        ),
      );

      setAirlines(airlines.filter((a) => !selectedAirlines.includes(a._id)));
      setSelectedAirlines([]);
      setShowBulkActions(false);
      showNotification(
        `${selectedAirlines.length} airlines deleted successfully`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to delete airlines", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK STATUS UPDATE ================= */
  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedAirlines.map((id) =>
          axios.put(`http://localhost:5000/api/airlines/updateAirline/${id}`, {
            status: newStatus,
          }),
        ),
      );

      await fetchAirlines();
      setSelectedAirlines([]);
      setShowBulkActions(false);
      showNotification(
        `${selectedAirlines.length} airlines updated to ${newStatus}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update airlines", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT AIRLINES ================= */
  const exportAirlines = () => {
    const dataToExport = filteredAndSortedAirlines;

    if (exportFormat === "csv") {
      const headers = ["Airline Name", "Airline Code", "Status"];
      const escapeCSV = (value) => `"${value?.replace(/"/g, '""') || ""}"`;

      const csvData = dataToExport.map((airline) => [
        escapeCSV(airline.airline_name),
        escapeCSV(airline.airline_code),
        escapeCSV(airline.status),
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `airlines_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `airlines_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} airlines`, "success");
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = () => {
    if (selectedAirlines.length === currentAirlines.length) {
      setSelectedAirlines([]);
    } else {
      setSelectedAirlines(currentAirlines.map((a) => a._id));
    }
  };

  /* ================= TOGGLE SELECTION ================= */
  const toggleAirlineSelection = (airlineId) => {
    if (selectedAirlines.includes(airlineId)) {
      setSelectedAirlines(selectedAirlines.filter((id) => id !== airlineId));
    } else {
      setSelectedAirlines([...selectedAirlines, airlineId]);
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

      {/* View Airline Modal */}
      {viewAirline && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Airline Details
              </h2>
              <button
                onClick={() => setViewAirline(null)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-2 divide-y divide-gray-100 dark:divide-gray-700">
              <Detail label="Airline Name" value={viewAirline.airline_name} />
              <Detail label="Airline Code" value={viewAirline.airline_code} />
              <Detail label="Status" value={viewAirline.status} />
              {viewAirline.createdAt && (
                <Detail
                  label="Created"
                  value={new Date(viewAirline.createdAt).toLocaleDateString()}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewAirline(null)}
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
            Airlines Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Airlines:{" "}
            <span className="font-semibold">{airlines.length}</span> | Filtered:{" "}
            <span className="font-semibold">
              {filteredAndSortedAirlines.length}
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
              onClick={exportAirlines}
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
            onClick={() => {
              setShowModal(true);
              setEditId(null);
              setForm({
                airline_name: "",
                airline_code: "",
                status: "Publish",
              });
            }}
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
            Add Airline
          </button>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Search airline by name or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="All">All Status</option>
              <option value="Publish">Publish</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAirlines.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedAirlines.length} airline(s) selected
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
              onClick={() => setSelectedAirlines([])}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Airlines Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedAirlines.length === currentAirlines.length &&
                      currentAirlines.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("airline_name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {sortConfig.key === "airline_name" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("airline_code")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Code</span>
                    {sortConfig.key === "airline_code" && (
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
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {currentAirlines.map((airline) => (
                <tr
                  key={airline._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline._id)}
                      onChange={() => toggleAirlineSelection(airline._id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {airline.airline_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded font-bold text-sm text-blue-600 dark:text-gray-200">
                      {airline.airline_code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        airline.status === "Publish"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {airline.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleView(airline)}
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
                      </button>
                      <button
                        onClick={() => handleEdit(airline)}
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
                        onClick={() => handleDelete(airline._id)}
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
              ))}

              {currentAirlines.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <p>No airlines found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
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

      <AirlineModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditId(null);
          setForm({ airline_name: "", airline_code: "", status: "Publish" });
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editId={editId}
        loading={loading}
      />
    </div>
  );
};

export default Airlines;
