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

  /* ================= FETCH USERS ================= */
  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/allUsers");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= FILTER ================= */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ================= ADD USER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server error");

      await loadUsers();
      closeForm();
    } catch (err) {
      console.error("Add user error:", err.message);
      alert(err.message);
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
      closeForm();
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    const res = await fetch(`http://localhost:5000/api/user/deleteUser/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  /* ================= VIEW USER ================= */
  const handleView = async (id) => {
    const res = await fetch(`http://localhost:5000/api/user/oneUser/${id}`);
    const data = await res.json();
    setViewUser(data);
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
                    required
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
                  className="
              px-4 py-2 rounded-lg
              bg-blue-600 dark:bg-blue-700
              text-white dark:text-black
              hover:opacity-80
            "
                >
                  {editId ? "Update" : "Add"}
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
              <Detail label="Phone" value={viewUser.phone} />
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
          <h2 className="text-sm font-semibold text-gray-800">Users Data</h2>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center"
        >
          <i className="fas fa-plus mr-2"></i>Add New User
        </button>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-3 text-left">No</th>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {currentUsers.map((user, i) => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{i + 1}</td>
              <td className="p-3">
                {user.firstName} {user.middleName} {user.lastName}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-sm rounded-full text-white ${
                    user.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-3 text-center space-x-2 ">
                <button
                  onClick={() => handleView(user._id)}
                  className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded "
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
          {/* Prev Button */}
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

          {/* Page Numbers */}
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

          {/* Next Button */}
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
