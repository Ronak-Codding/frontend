import React, { useState, useEffect } from "react";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 5;

  const [statusFilter, setStatusFilter] = useState("All");
  const [adminStatusFilter, setAdminStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "departure_time",
    direction: "asc",
  });
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");

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

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
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

      showNotification("Data loaded successfully", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SORTING FUNCTION ================= */
  const sortedFlights = () => {
    const filtered = filteredFlightsData();
    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (
        sortConfig.key === "departure_time" ||
        sortConfig.key === "arrival_time"
      ) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.key === "price") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredFlightsData = () => {
    return flights.filter((f) => {
      const matchesSearch =
        !searchTerm ||
        f.flight_number?.toLowerCase().includes(searchTerm) ||
        f.airline?.airline_name?.toLowerCase().includes(searchTerm) ||
        f.airline?.airline_code?.toLowerCase().includes(searchTerm) ||
        f.from_airport?.iata_code?.toLowerCase().includes(searchTerm) ||
        f.to_airport?.iata_code?.toLowerCase().includes(searchTerm) ||
        f.from_airport?.city?.toLowerCase().includes(searchTerm) ||
        f.to_airport?.city?.toLowerCase().includes(searchTerm);

      const matchesStatus = statusFilter === "All" || f.status === statusFilter;
      const matchesAdminStatus =
        adminStatusFilter === "All" || f.admin_status === adminStatusFilter;

      return matchesSearch && matchesStatus && matchesAdminStatus;
    });
  };

  const filteredAndSortedFlights = sortedFlights();

  const publishedCount = filteredAndSortedFlights.filter(
    (f) => f.admin_status === "Publish",
  ).length;
  const draftCount = filteredAndSortedFlights.filter(
    (f) => f.admin_status === "Draft",
  ).length;
  const scheduledCount = filteredAndSortedFlights.filter(
    (f) => f.status === "Scheduled",
  ).length;

  const indexOfLast = currentPage * flightsPerPage;
  const indexOfFirst = indexOfLast - flightsPerPage;
  const currentFlights = filteredAndSortedFlights.slice(
    indexOfFirst,
    indexOfLast,
  );
  const totalPages = Math.ceil(
    filteredAndSortedFlights.length / flightsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, adminStatusFilter]);

  const calculateDuration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    return diff > 0 ? Math.round(diff / 60000) : 0;
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();

    if (newFlight.from_airport === newFlight.to_airport) {
      showNotification("From and To airport cannot be same", "error");
      return;
    }

    setLoading(true);
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
        throw new Error(err.message || "Failed to add flight");
      }

      showNotification("Flight added successfully", "success");
      setShowAddModal(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlightStatus = async (id, status) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/flights/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_status: status === "Publish" ? "Draft" : "Publish",
        }),
      });
      showNotification(
        `Status changed to ${status === "Publish" ? "Draft" : "Publish"}`,
        "success",
      );
      fetchAllData();
    } catch (error) {
      showNotification("Failed to update status", "error");
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    try {
      await fetch(
        `http://localhost:5000/api/flights/updateFlight/${currentFlight._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editFlight),
        },
      );
      showNotification("Flight updated successfully", "success");
      setShowEditModal(false);
      fetchAllData();
    } catch (error) {
      showNotification("Failed to update flight", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/flights/deleteFlight/${id}`, {
        method: "DELETE",
      });
      showNotification("Flight deleted successfully", "success");
      fetchAllData();
    } catch (error) {
      showNotification("Failed to delete flight", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedFlights.length} selected flights?`))
      return;

    setLoading(true);
    try {
      await Promise.all(
        selectedFlights.map((id) =>
          fetch(`http://localhost:5000/api/flights/deleteFlight/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      setFlights(flights.filter((f) => !selectedFlights.includes(f._id)));
      setSelectedFlights([]);
      showNotification(
        `${selectedFlights.length} flights deleted successfully`,
        "success",
      );
      fetchAllData();
    } catch (error) {
      showNotification("Failed to delete flights", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK STATUS UPDATE ================= */
  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedFlights.map((id) =>
          fetch(`http://localhost:5000/api/flights/updateFlight/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }),
        ),
      );

      await fetchAllData();
      setSelectedFlights([]);
      showNotification(
        `${selectedFlights.length} flights updated to ${newStatus}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update flights", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK ADMIN STATUS UPDATE ================= */
  const handleBulkAdminStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedFlights.map((id) =>
          fetch(`http://localhost:5000/api/flights/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admin_status: newStatus }),
          }),
        ),
      );

      await fetchAllData();
      setSelectedFlights([]);
      showNotification(
        `${selectedFlights.length} flights admin status updated to ${newStatus}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update flights", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT FLIGHTS ================= */
  const exportFlights = () => {
    const dataToExport = filteredAndSortedFlights;

    if (exportFormat === "csv") {
      const headers = [
        "Flight Number",
        "Airline",
        "From",
        "To",
        "Departure",
        "Arrival",
        "Duration",
        "Price",
        "Seats Available",
        "Total Seats",
        "Status",
        "Admin Status",
      ];

      const escapeCSV = (value) => `"${value?.replace(/"/g, '""') || ""}"`;

      const csvData = dataToExport.map((flight) => [
        escapeCSV(flight.flight_number),
        escapeCSV(flight.airline?.airline_name || ""),
        escapeCSV(
          `${flight.from_airport?.city} (${flight.from_airport?.iata_code})`,
        ),
        escapeCSV(
          `${flight.to_airport?.city} (${flight.to_airport?.iata_code})`,
        ),
        escapeCSV(new Date(flight.departure_time).toLocaleString()),
        escapeCSV(new Date(flight.arrival_time).toLocaleString()),
        escapeCSV(
          `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`,
        ),
        escapeCSV(flight.price),
        escapeCSV(flight.seats_available),
        escapeCSV(flight.total_seats),
        escapeCSV(flight.status),
        escapeCSV(flight.admin_status),
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flights_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flights_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} flights`, "success");
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = () => {
    if (selectedFlights.length === currentFlights.length) {
      setSelectedFlights([]);
    } else {
      setSelectedFlights(currentFlights.map((f) => f._id));
    }
  };

  /* ================= TOGGLE SELECTION ================= */
  const toggleFlightSelection = (flightId) => {
    if (selectedFlights.includes(flightId)) {
      setSelectedFlights(selectedFlights.filter((id) => id !== flightId));
    } else {
      setSelectedFlights([...selectedFlights, flightId]);
    }
  };

  const handleNewFlightInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((p) => ({ ...p, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFlight((p) => ({ ...p, [name]: value }));
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Flights Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Flights:{" "}
            <span className="font-semibold">{flights.length}</span> | Filtered:{" "}
            <span className="font-semibold">
              {filteredAndSortedFlights.length}
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
              onClick={exportFlights}
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
            onClick={() => setShowAddModal(true)}
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
            Add New Flight
          </button>
        </div>
      </div>

      {/* Statistics Cards (Commented out but styled if needed) */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Flights</h5>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{flights.length}</h3>
            </div>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 dark:text-gray-400 text-xs font-medium">Published</h5>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{publishedCount}</h3>
            </div>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0c1.657 0 3 4.03 3 9s-1.343 9-3 9z" />
            </svg>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 dark:text-gray-400 text-xs font-medium">Draft</h5>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{draftCount}</h3>
            </div>
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-gray-500 dark:text-gray-400 text-xs font-medium">Scheduled</h5>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{scheduledCount}</h3>
            </div>
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div> */}

      {/* Search & Filter Card */}
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
              placeholder="Search flights by number, airline, or airport..."
              value={searchTerm}
              onChange={handleSearch}
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
              <option value="Scheduled">Scheduled</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Admin Status Filter */}
          <div>
            <select
              value={adminStatusFilter}
              onChange={(e) => {
                setAdminStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="All">All Admin Status</option>
              <option value="Publish">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedFlights.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedFlights.length} flight(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <select
              onChange={(e) => handleBulkStatusUpdate(e.target.value)}
              className="px-3 py-1 border border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              defaultValue=""
            >
              <option value="" disabled>
                Change Status
              </option>
              <option value="Scheduled">Set Scheduled</option>
              <option value="Delayed">Set Delayed</option>
              <option value="Cancelled">Set Cancelled</option>
              <option value="Completed">Set Completed</option>
            </select>
            <select
              onChange={(e) => handleBulkAdminStatusUpdate(e.target.value)}
              className="px-3 py-1 border border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              defaultValue=""
            >
              <option value="" disabled>
                Change Admin Status
              </option>
              <option value="Publish">Set Published</option>
              <option value="Draft">Set Draft</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedFlights([])}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Flights Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedFlights.length === currentFlights.length &&
                      currentFlights.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("flight_number")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Flight</span>
                    {sortConfig.key === "flight_number" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("airline")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Airline</span>
                    {sortConfig.key === "airline" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Route</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("departure_time")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Departure</span>
                    {sortConfig.key === "departure_time" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => requestSort("price")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    {sortConfig.key === "price" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Seats</th>
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
                  onClick={() => requestSort("admin_status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Admin</span>
                    {sortConfig.key === "admin_status" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300 text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {currentFlights.length > 0 ? (
                currentFlights.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedFlights.includes(row._id)}
                        onChange={() => toggleFlightSelection(row._id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-bold">{row.flight_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {row.airline?.airline_name}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        ({row.airline?.airline_code})
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {row.from_airport?.city} → {row.to_airport?.city}
                      </div>
                      {/* <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {row.from_airport?.iata_code} →{" "}
                        {row.to_airport?.iata_code}
                      </div> */}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {new Date(row.departure_time).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(row.departure_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₹{row.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.seats_available < 10
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {row.seats_available}
                      </span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">
                        / {row.total_seats}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === "Scheduled"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : row.status === "Delayed"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              : row.status === "Cancelled"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
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
                        className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium transition ${
                          row.admin_status === "Publish"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {row.admin_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(row)}
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
                          onClick={() => handleDelete(row._id)}
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
                    colSpan="10"
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
                    <p>No flights found</p>
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

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>

          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Flight
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddFlight} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flight Number */}
                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Flight Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="flight_number"
                    value={newFlight.flight_number}
                    onChange={handleNewFlightInputChange}
                    required
                    placeholder="e.g., AA123"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div> */}

                {/* Airline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Airline <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="airline"
                    value={newFlight.airline}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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

                {/* Aircraft Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aircraft Type
                  </label>
                  <input
                    type="text"
                    name="aircraft_type"
                    value={newFlight.aircraft_type}
                    onChange={handleNewFlightInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* From Airport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From Airport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="from_airport"
                    value={newFlight.from_airport}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                            {airport.iata_code} - {airport.city} (
                            {airport.country})
                          </option>
                        ))}
                  </select>
                </div>

                {/* To Airport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To Airport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="to_airport"
                    value={newFlight.to_airport}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                            {airport.iata_code} - {airport.city} (
                            {airport.country})
                          </option>
                        ))}
                  </select>
                </div>

                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departure Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="departure_time"
                    value={newFlight.departure_time}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Arrival Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Arrival Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="arrival_time"
                    value={newFlight.arrival_time}
                    onChange={handleNewFlightInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newFlight.price}
                    onChange={handleNewFlightInputChange}
                    required
                    min="0"
                    placeholder="e.g., 5000"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Total Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Seats <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_seats"
                    value={newFlight.total_seats}
                    onChange={handleNewFlightInputChange}
                    required
                    min="1"
                    placeholder="e.g., 180"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Seats Available */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Seats Available
                  </label>
                  <input
                    type="number"
                    name="seats_available"
                    value={newFlight.seats_available}
                    onChange={handleNewFlightInputChange}
                    min="0"
                    max={newFlight.total_seats}
                    placeholder="Leave empty to use total seats"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newFlight.status}
                    onChange={handleNewFlightInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Admin Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Admin Status
                  </label>
                  <select
                    name="admin_status"
                    value={newFlight.admin_status}
                    onChange={handleNewFlightInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  ) : (
                    "Add Flight"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      {showEditModal && currentFlight && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Flight {currentFlight.flight_number}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flight Number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Flight Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="flight_number"
                    value={editFlight.flight_number}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={editFlight.status}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Admin Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Admin Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="admin_status"
                    value={editFlight.admin_status}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFlight.price}
                    onChange={handleEditInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Seats Available */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Seats Available <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="seats_available"
                    value={editFlight.seats_available}
                    onChange={handleEditInputChange}
                    min="0"
                    max={currentFlight.total_seats}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Total seats: {currentFlight.total_seats}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                  ) : (
                    "Update Flight"
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

export default Flights;
