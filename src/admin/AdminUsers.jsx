import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg">
            <form
              onSubmit={editId ? handleUpdate : handleSubmit}
              className="p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold">
                  {editId ? "Edit User" : "Add User"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-500 hover:text-black text-xl"
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
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ))}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editId}
                  className="border rounded-lg px-3 py-2"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
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
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
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
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                User Details
              </h2>
              <button
                onClick={() => setViewUser(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3 text-sm text-gray-700">
              <Detail label="First Name" value={viewUser.firstName} />
              <Detail label="Middle Name" value={viewUser.middleName || "-"} />
              <Detail label="Last Name" value={viewUser.lastName} />
              <Detail label="Username" value={viewUser.username} />
              <Detail label="Email" value={viewUser.email} />
              <Detail label="Phone" value={viewUser.phone} />
              <Detail label="Role" value={viewUser.role} />

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white
              ${viewUser.status === "active" ? "bg-green-600" : "bg-red-600"}`}
                >
                  {viewUser.status}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t">
              <button
                onClick={() => setViewUser(null)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= USERS TABLE ================= */}
      <h3 className="mt-4">Users Data</h3>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="border rounded-lg px-3 py-2 w-full placeholder-gray-500  md:w-1/3"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        <div className="flex-1 text-right">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            + Add User
          </button>
        </div>
      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
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
        <tbody className="text-gray-600">
          {filteredUsers.map((user, i) => (
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
                  className="px-2 py-1 bg-blue-500 text-white rounded "
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminUsers;
