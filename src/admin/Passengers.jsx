import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PassengerModal from "./PassengerModal";

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPassenger, setViewPassenger] = useState(null);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [genderFilter, setGenderFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });

  const passengersPerPage = 5;

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    toast(message, { type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  // ================= FETCH =================
  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/passengers/allPassengers",
      );
      setPassengers(res.data);
      setFilteredPassengers(res.data);
    } catch (error) {
      toast.error("Failed to load passengers");
      showNotification("Failed to load passengers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  /* ================= SORTING FUNCTION ================= */
  const sortedPassengers = () => {
    const filtered = filteredPassengersData();
    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "age") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.key === "bookingRef") {
        aValue = a.booking_id?.bookingReference || "";
        bValue = b.booking_id?.bookingReference || "";
      } else if (sortConfig.key === "seat_number") {
        aValue = a.seat_number || "";
        bValue = b.seat_number || "";
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

  // ================= FILTER =================
  const filteredPassengersData = () => {
    return passengers.filter((p) => {
      // Search filter
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking_id?.bookingReference
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        p.seat_number?.toLowerCase().includes(search.toLowerCase()) ||
        p.gender?.toLowerCase().includes(search.toLowerCase());

      // Gender filter
      const matchesGender = genderFilter === "All" || p.gender === genderFilter;

      // Age range filter
      const matchesAgeRange =
        (!ageRange.min || p.age >= Number(ageRange.min)) &&
        (!ageRange.max || p.age <= Number(ageRange.max));

      return matchesSearch && matchesGender && matchesAgeRange;
    });
  };

  const filteredAndSortedPassengers = sortedPassengers();

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete passenger?")) return;
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/passengers/deletePassenger/${id}`,
      );
      toast.success("Passenger deleted");
      showNotification("Passenger deleted successfully", "success");
      fetchPassengers();
    } catch (error) {
      toast.error("Delete failed");
      showNotification("Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= VIEW =================
  const handleView = (passenger) => {
    setViewPassenger(passenger);
    setShowViewModal(true);
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Delete ${selectedPassengers.length} selected passengers?`,
      )
    )
      return;

    setLoading(true);
    try {
      await Promise.all(
        selectedPassengers.map((id) =>
          axios.delete(
            `http://localhost:5000/api/passengers/deletePassenger/${id}`,
          ),
        ),
      );

      setPassengers(
        passengers.filter((p) => !selectedPassengers.includes(p._id)),
      );
      setSelectedPassengers([]);
      showNotification(
        `${selectedPassengers.length} passengers deleted successfully`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to delete passengers", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK GENDER UPDATE ================= */
  const handleBulkGenderUpdate = async (newGender) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedPassengers.map((id) =>
          axios.put(
            `http://localhost:5000/api/passengers/updatePassenger/${id}`,
            {
              gender: newGender,
            },
          ),
        ),
      );

      await fetchPassengers();
      setSelectedPassengers([]);
      showNotification(
        `${selectedPassengers.length} passengers updated to ${newGender}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update passengers", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT PASSENGERS ================= */
  const exportPassengers = () => {
    const dataToExport = filteredAndSortedPassengers;

    if (exportFormat === "csv") {
      const headers = [
        "Name",
        "Age",
        "Gender",
        "Seat Number",
        "Booking Reference",
        "Booking Date",
      ];
      const csvData = dataToExport.map((passenger) => [
        passenger.name,
        passenger.age,
        passenger.gender,
        passenger.seat_number || "N/A",
        passenger.booking_id?.bookingReference || "N/A",
        passenger.booking_id?.booking_date
          ? new Date(passenger.booking_id.booking_date).toLocaleDateString()
          : "N/A",
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `passengers_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `passengers_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} passengers`, "success");
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = () => {
    if (selectedPassengers.length === currentPassengers.length) {
      setSelectedPassengers([]);
    } else {
      setSelectedPassengers(currentPassengers.map((p) => p._id));
    }
  };

  /* ================= TOGGLE SELECTION ================= */
  const togglePassengerSelection = (passengerId) => {
    if (selectedPassengers.includes(passengerId)) {
      setSelectedPassengers(
        selectedPassengers.filter((id) => id !== passengerId),
      );
    } else {
      setSelectedPassengers([...selectedPassengers, passengerId]);
    }
  };

  // ================= PAGINATION =================
  const indexOfLast = currentPage * passengersPerPage;
  const indexOfFirst = indexOfLast - passengersPerPage;
  const currentPassengers = filteredAndSortedPassengers.slice(
    indexOfFirst,
    indexOfLast,
  );
  const totalPages = Math.ceil(
    filteredAndSortedPassengers.length / passengersPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, genderFilter, ageRange]);

  const Detail = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <span className="text-gray-800 dark:text-gray-200">{value || "-"}</span>
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

      {/* View Passenger Modal */}
      {showViewModal && viewPassenger && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Passenger Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-2xl text-gray-600 dark:text-gray-300 hover:opacity-70 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3 text-sm text-gray-800 dark:text-gray-200">
              <Detail label="Name" value={viewPassenger.name} />
              <Detail label="Age" value={viewPassenger.age} />
              <Detail label="Gender" value={viewPassenger.gender} />
              <Detail
                label="Seat Number"
                value={viewPassenger.seat_number || "N/A"}
              />
              <Detail
                label="Booking Reference"
                value={viewPassenger.booking_id?.bookingReference}
              />
              <Detail
                label="Booking Date"
                value={
                  viewPassenger.booking_id?.booking_date
                    ? new Date(
                        viewPassenger.booking_id.booking_date,
                      ).toLocaleDateString()
                    : "N/A"
                }
              />
              <Detail
                label="Flight Number"
                value={viewPassenger.booking_id?.flight_id?.flight_number}
              />
              <Detail
                label="Route"
                value={
                  viewPassenger.booking_id?.flight_id
                    ? `${viewPassenger.booking_id.flight_id.from_airport?.city} → ${viewPassenger.booking_id.flight_id.to_airport?.city}`
                    : "N/A"
                }
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
            Passengers Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Passengers:{" "}
            <span className="font-semibold">{passengers.length}</span> |
            Filtered:{" "}
            <span className="font-semibold">
              {filteredAndSortedPassengers.length}
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
              onClick={exportPassengers}
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
              setSelectedPassenger(null);
              setShowModal(true);
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
            Add Passenger
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
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
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Search by Name, Booking Ref, Seat, or Gender"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age Range Filter */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Age"
              value={ageRange.min}
              onChange={(e) =>
                setAgeRange({ ...ageRange, min: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              min="0"
              max="120"
            />
            <input
              type="number"
              placeholder="Max Age"
              value={ageRange.max}
              onChange={(e) =>
                setAgeRange({ ...ageRange, max: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              min="0"
              max="120"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPassengers.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedPassengers.length} passenger(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <select
              onChange={(e) => handleBulkGenderUpdate(e.target.value)}
              className="px-3 py-1 border border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              defaultValue=""
            >
              <option value="" disabled>
                Change Gender
              </option>
              <option value="Male">Set Male</option>
              <option value="Female">Set Female</option>
              <option value="Other">Set Other</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedPassengers([])}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Passengers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedPassengers.length === currentPassengers.length &&
                      currentPassengers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("name")}
                >
                  NO{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("name")}
                >
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("age")}
                >
                  Age{" "}
                  {sortConfig.key === "age" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("gender")}
                >
                  Gender{" "}
                  {sortConfig.key === "gender" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("seat_number")}
                >
                  Seat{" "}
                  {sortConfig.key === "seat_number" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("bookingRef")}
                >
                  Booking Ref{" "}
                  {sortConfig.key === "bookingRef" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span>Loading passengers...</span>
                    </div>
                  </td>
                </tr>
              ) : currentPassengers.length > 0 ? (
                currentPassengers.map((row, index) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPassengers.includes(row._id)}
                        onChange={() => togglePassengerSelection(row._id)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">
                          {row.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.age}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                        {row.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded font-bold text-xs text-purple-700 dark:text-purple-300">
                        {row.seat_number || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded font-bold text-xs text-blue-700 dark:text-blue-300">
                        {row.booking_id?.bookingReference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded transition"
                          onClick={() => handleView(row)}
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
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"
                          onClick={() => {
                            setSelectedPassenger(row);
                            setShowModal(true);
                          }}
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
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                          onClick={() => handleDelete(row._id)}
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p>No passengers found</p>
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

      {/* Passenger Modal */}
      {showModal && (
        <PassengerModal
          passenger={selectedPassenger}
          onClose={() => setShowModal(false)}
          refresh={() => {
            fetchPassengers();
            showNotification(
              selectedPassenger
                ? "Passenger updated successfully"
                : "Passenger added successfully",
              "success",
            );
          }}
        />
      )}
    </div>
  );
};

export default Passengers;
