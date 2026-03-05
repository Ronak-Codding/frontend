import React, { useState, useEffect } from "react";
// import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "asc",
  });
  const [exportFormat, setExportFormat] = useState("csv");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    role: "",
    dateJoined: "",
    lastActive: "",
  });

  const usersPerPage = 5;

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    status: "active",
  });

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  /* ================= FETCH USERS ================= */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/allUsers");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= SORTING FUNCTION ================= */
  const sortedUsers = () => {
    const filtered = filteredUsers();

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

  /* ================= FILTER ================= */
  const filteredUsers = () => {
    return users.filter((user) => {
      const matchesSearch =
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || user.status === statusFilter;
      const matchesRole =
        advancedFilters.role === "" || user.role === advancedFilters.role;

      // Add more advanced filters here if needed

      return matchesSearch && matchesStatus && matchesRole;
    });
  };

  const filteredAndSortedUsers = sortedUsers();
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(
    indexOfFirstUser,
    indexOfLastUser,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, advancedFilters]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ================= ADD USER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server error");

      await loadUsers();
      showNotification("User added successfully", "success");
      closeForm();
    } catch (err) {
      console.error("Add user error:", err.message);
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT USER ================= */
  const handleEdit = (user) => {
    setEditId(user._id);
    setShowForm(true);

    setFormData({
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "user",
      status: user.status ?? "active",
    });
  };

  /* ================= UPDATE USER ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/user/updateUser/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        await loadUsers();
        showNotification("User updated successfully", "success");
        closeForm();
      }
    } catch (error) {
      showNotification("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/deleteUser/${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        showNotification("User deleted successfully", "success");
      }
    } catch (error) {
      showNotification("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedUsers.length} selected users?`))
      return;

    setLoading(true);
    try {
      // Assuming you have a bulk delete endpoint
      await Promise.all(
        selectedUsers.map((id) =>
          fetch(`http://localhost:5000/api/user/deleteUser/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      setUsers(users.filter((u) => !selectedUsers.includes(u._id)));
      setSelectedUsers([]);
      setShowBulkActions(false);
      showNotification(
        `${selectedUsers.length} users deleted successfully`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to delete users", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK STATUS UPDATE ================= */
  const handleBulkStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((id) =>
          fetch(`http://localhost:5000/api/user/updateUser/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }),
        ),
      );

      await loadUsers();
      setSelectedUsers([]);
      setShowBulkActions(false);
      showNotification(
        `${selectedUsers.length} users updated to ${newStatus}`,
        "success",
      );
    } catch (error) {
      showNotification("Failed to update users", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VIEW USER ================= */
  const handleView = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/user/oneUser/${id}`);
      const data = await res.json();
      setViewUser(data);
    } catch (error) {
      showNotification("Failed to load user details", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT USERS ================= */
  const exportUsers = () => {
    const dataToExport = filteredAndSortedUsers;

    if (exportFormat === "csv") {
      const headers = [
        "First Name",
        "Middle Name",
        "Last Name",
        "Username",
        "Email",
        "Phone",
        "Role",
        "Status",
      ];
      const escapeCSV = (value) => `"${value?.replace(/"/g, '""') || ""}"`;

      const csvData = dataToExport.map((user) => [
        escapeCSV(user.firstName),
        escapeCSV(user.middleName),
        escapeCSV(user.lastName),
        escapeCSV(user.username),
        escapeCSV(user.email),
        escapeCSV(user.phone),
        escapeCSV(user.role),
        escapeCSV(user.status),
      ]);
      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else if (exportFormat === "json") {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }

    showNotification(`Exported ${dataToExport.length} users`, "success");
  };

  /* ================= SELECT ALL ================= */
  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((u) => u._id));
    }
  };

  /* ================= TOGGLE USER SELECTION ================= */
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
      status: "active",
    });
  };

  const Detail = ({ label, value }) => (
    <div className="flex justify-between">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );

  return (
    <>
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

      {/* ================= ADD / EDIT MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="bg-white dark:bg-black w-full max-w-4xl rounded-xl shadow-lg border border-black dark:border-white">
            <form
              onSubmit={editId ? handleUpdate : handleSubmit}
              className="p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-black dark:border-white pb-3">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  {editId ? "Edit User" : "Add User"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-black dark:text-white hover:opacity-70 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[
                  "firstName",
                  "middleName",
                  "lastName",
                  "username",
                  "phone",
                  "email",
                ].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={field === "email" && editId}
                    required={field !== "middleName" && field !== "phone"}
                    className="
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                placeholder:text-gray-500 dark:placeholder:text-gray-400
                rounded-lg px-3 py-2
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
                  />
                ))}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editId}
                  className="
              border border-black dark:border-white
              bg-white dark:bg-black
              text-black dark:text-white
              placeholder:text-gray-500 dark:placeholder:text-gray-400
              rounded-lg px-3 py-2
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none
            "
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="
              border border-black dark:border-white
              bg-white dark:bg-black
              text-black dark:text-white
              rounded-lg px-3 py-2
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="
              border border-black dark:border-white
              bg-white dark:bg-black
              text-black dark:text-white
              rounded-lg px-3 py-2
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="
              px-4 py-2 rounded-lg
              border border-black dark:border-white
              bg-white dark:bg-black
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
              px-4 py-2 rounded-lg
              bg-blue-600 dark:bg-blue-700
              text-white dark:text-black
              hover:opacity-80
              disabled:opacity-50 disabled:cursor-not-allowed
            "
                >
                  {loading ? "Processing..." : editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW USER MODAL ================= */}
      {viewUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div
            className="relative w-full max-w-md mx-4 
                    bg-white dark:bg-black 
                    border border-black dark:border-white/20
                    rounded-2xl shadow-xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 
                      border-b border-black dark:border-white/20"
            >
              <h2
                className="text-lg font-semibold 
                       text-black dark:text-white"
              >
                User Details
              </h2>

              <button
                onClick={() => setViewUser(null)}
                className="text-2xl 
                     text-black dark:text-white
                     hover:opacity-70 transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div
              className="px-6 py-5 space-y-3 text-sm 
                      text-black dark:text-white"
            >
              <Detail label="First Name" value={viewUser.firstName} />
              <Detail label="Middle Name" value={viewUser.middleName || "-"} />
              <Detail label="Last Name" value={viewUser.lastName} />
              <Detail label="Username" value={viewUser.username} />
              <Detail label="Email" value={viewUser.email} />
              <Detail label="Phone" value={viewUser.phone || "-"} />
              <Detail label="Role" value={viewUser.role} />

              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-black dark:text-white">
                  Status
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white
              ${viewUser.status === "active" ? "bg-green-600" : "bg-red-600"}`}
                >
                  {viewUser.status}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex justify-end px-6 py-4 
                      border-t border-black dark:border-white/20"
            >
              <button
                onClick={() => setViewUser(null)}
                className="px-5 py-2 rounded-lg 
                     border border-black dark:border-white
                     text-black dark:text-white
                     hover:bg-black hover:text-white
                     dark:hover:bg-white dark:hover:text-black
                     transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= USERS TABLE ================= */}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Users: {users.length} | Filtered:{" "}
            {filteredAndSortedUsers.length}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Export Button */}
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm mr-2"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={exportUsers}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <i className="fas fa-download mr-2"></i>Export
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>Add New User
          </button>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm"></i>
            </div>

            <input
              type="text"
              placeholder="Search users..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm
                   border border-gray-300 dark:border-gray-700
                   rounded-lg
                   bg-gray-50 dark:bg-neutral-100
                   text-black dark:text-white
                   focus:bg-white dark:focus:bg-neutral-100
                   focus:ring-1 focus:ring-black dark:focus:ring-white
                   outline-none transition"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={advancedFilters.role}
              onChange={(e) =>
                setAdvancedFilters({ ...advancedFilters, role: e.target.value })
              }
              className="w-full px-3 py-2 text-sm
                   border border-gray-300 dark:border-gray-700
                   rounded-lg
                   bg-gray-50 dark:bg-neutral-100
                   text-black dark:text-white
                   focus:bg-white dark:focus:bg-neutral-100
                   focus:ring-1 focus:ring-black dark:focus:ring-white
                   outline-none transition"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("active")}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("blocked")}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Set Blocked
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedUsers([])}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === currentUsers.length &&
                    currentUsers.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("firstName")}
              >
                No{" "}
                {sortConfig.key === "firstName" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("lastName")}
              >
                Full Name{" "}
                {sortConfig.key === "lastName" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("email")}
              >
                Email{" "}
                {sortConfig.key === "email" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 text-left">Phone</th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("role")}
              >
                Role{" "}
                {sortConfig.key === "role" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, i) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-3">{indexOfFirstUser + i + 1}</td>
                  <td className="p-3">
                    {user.firstName} {user.middleName} {user.lastName}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${
                        user.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleView(user._id)}
                      className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No users found
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
    </>
  );
};

export default AdminUsers;
