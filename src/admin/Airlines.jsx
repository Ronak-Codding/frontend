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
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
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

  const filteredAirlines = () => {
    return airlines.filter((a) => {
      return (
        (a.airline_name?.toLowerCase().includes(search.toLowerCase()) ||
          a.airline_code?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "All" || a.status === statusFilter)
      );
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
      const csvData = dataToExport.map((airline) => [
        airline.airline_name,
        airline.airline_code,
        airline.status,
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
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
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

      {/* View Airline Modal */}
      {viewAirline && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-black border border-black dark:border-white/20 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black dark:border-white/20">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Airline Details
              </h2>
              <button
                onClick={() => setViewAirline(null)}
                className="text-2xl text-black dark:text-white hover:opacity-70 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-2 text-sm text-black dark:text-white">
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
            <div className="flex justify-end px-6 py-4 border-t border-black dark:border-white/20">
              <button
                onClick={() => setViewAirline(null)}
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
            Airlines Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Airlines: {airlines.length} | Filtered:{" "}
            {filteredAndSortedAirlines.length}
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
              onClick={exportAirlines}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg font-medium"
            >
              <i className="fas fa-download mr-2"></i>Export
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>Add Airline
          </button>
        </div>
      </div>

      {/* Search + Filter Card */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-colors">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
              </div>

              <input
                type="text"
                placeholder="Search airline by name or code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
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

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm
                     border border-gray-300 dark:border-gray-700
                     rounded-lg
                     bg-gray-50 dark:bg-neutral-100
                     text-black dark:text-white
                     focus:bg-white dark:focus:bg-neutral-100
                     focus:ring-1 focus:ring-black dark:focus:ring-white
                     outline-none transition"
              >
                <option value="All">All Status</option>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAirlines.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedAirlines.length} airline(s) selected
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
              onClick={() => setSelectedAirlines([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedAirlines.length === currentAirlines.length &&
                    currentAirlines.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("airline_name")}
              >
                Name{" "}
                {sortConfig.key === "airline_name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-3 text-center cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("airline_code")}
              >
                Code{" "}
                {sortConfig.key === "airline_code" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-3 text-center cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y text-gray-700">
            {currentAirlines.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(a._id)}
                    onChange={() => toggleAirlineSelection(a._id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{a.airline_name}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                    {a.airline_code}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      a.status === "Publish"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {currentAirlines.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  <i className="fas fa-plane-slash text-3xl mb-2"></i>
                  <p>No airlines found</p>
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
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed border-gray-300 bg-white text-gray-400"
                : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
            }`}
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
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed border-gray-300 bg-white text-gray-400"
                : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            Next ›
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
