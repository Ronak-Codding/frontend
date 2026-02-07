import React, { useState, useEffect } from "react";
// import axios from "axios";
import "./AdminUsers.css";

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

    const res = await fetch(`http://localhost:5000/api/user/updateUser/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

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

  return (
    <>
      {/* ================= ADD / EDIT MODAL ================= */}
      {showForm && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-lg">
            <form
              className="modal-content"
              onSubmit={editId ? handleUpdate : handleSubmit}
            >
              <div className="modal-header">
                <h5>{editId ? "Edit User" : "Add User"}</h5>
                <button className="btn-close" onClick={closeForm}></button>
              </div>

              <div className="modal-body row g-3">
                {[
                  "firstName",
                  "middleName",
                  "lastName",
                  "username",
                  "phone",
                  "email",
                ].map((field) => (
                  <div className="col-md-4" key={field}>
                    <input
                      className="form-control"
                      name={field}
                      placeholder={field}
                      value={formData[field]}
                      onChange={handleChange}
                      disabled={field === "email" && editId}
                      required
                    />
                  </div>
                ))}

                <div className="col-md-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editId}
                  />
                </div>

                <div className="col-md-4">
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeForm}>
                  Cancel
                </button>
                <button className="btn btn-primary">
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW USER MODAL ================= */}
      {viewUser && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewUser(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>First Name:</strong> {viewUser.firstName}
                </p>
                <p>
                  <strong>Middle Name:</strong> {viewUser.middleName || "-"}
                </p>
                <p>
                  <strong>Last Name:</strong> {viewUser.lastName}
                </p>
                <p>
                  <strong>Username:</strong> {viewUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {viewUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {viewUser.phone}
                </p>
                <p>
                  <strong>Role:</strong> {viewUser.role}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`badge ${
                      viewUser.status === "active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {viewUser.status}
                  </span>
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= USERS TABLE ================= */}
      <h3 className="mt-4">Users Data</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="col-md-5 text-end">
          <button
            className="btn add-user-btn"
            onClick={() => setShowForm(true)}
          >
            ➕ Add User
          </button>
        </div>
      </div>

      <table className="table bg-white shadow table-hover">
        <thead className="fs-5">
          <tr>
            <th>No</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th className="w-40">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, i) => (
            <tr key={user._id}>
              <td>{i + 1}</td>
              <td>
                {user.firstName} {user.middleName || ""} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={`badge ${
                    user.status === "active" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleView(user._id)}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(user)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(user._id)}
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
