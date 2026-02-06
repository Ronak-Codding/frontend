import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaPlane, FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import "./airlines.css";
import AirlineModal from "./AirlineModal";

const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    airline_name: "",
    airline_code: "",
    status: "Publish",
  });

  const fetchAirlines = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/airlines", {
      params: { search, page: currentPage, limit },
    });

    setAirlines(res.data.airlines);
    setTotalPages(res.data.totalPages);
  }, [search, currentPage]);

  useEffect(() => {
    fetchAirlines();
  }, [fetchAirlines]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`http://localhost:5000/api/airlines/update/${editId}`, form);
    } else {
      await axios.post("http://localhost:5000/api/airlines", form);
    }

    setShowModal(false);
    setEditId(null);
    setForm({ airline_name: "", airline_code: "", status: "Publish" });
    fetchAirlines();
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
    if (window.confirm("Are you sure you want to delete this airline?")) {
      await axios.delete(`http://localhost:5000/api/airlines/delete/${id}`);
      fetchAirlines();
    }
  };

  const filteredAirlines = airlines.filter((a) => {
    return (
      (a.airline_name.toLowerCase().includes(search.toLowerCase()) ||
        a.airline_code.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || a.status === statusFilter)
    );
  });

  const total = airlines.length;
  const published = airlines.filter((a) => a.status === "Publish").length;
  const draft = airlines.filter((a) => a.status === "Draft").length;

  return (
    <div className="airlines-page">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Airline Management</h2>
          <p className="text-muted">Manage airlines data</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowModal(true);
            setEditId(null);
            setForm({ airline_name: "", airline_code: "", status: "Publish" });
          }}
        >
          + Add New Airline
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <SummaryCard
          title="Total Airlines"
          value={total}
          icon={<FaPlane />}
          color="primary"
        />
        <SummaryCard
          title="Published"
          value={published}
          icon={<FaCheck />}
          color="success"
        />
        <SummaryCard
          title="Draft"
          value={draft}
          icon={<FaEdit />}
          color="warning"
        />
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search airlines by name or code..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select w-60"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light fs-5 font-bold">
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th width="140">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAirlines.map((a) => (
                <tr key={a._id}>
                  <td className="fw-semibold" data-label="Airline Name">
                    {a.airline_name}
                  </td>
                  <td>
                    <span className="badge bg-primary">{a.airline_code}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${a.status === "Publish" ? "bg-success" : "bg-secondary"}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEdit(a)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(a._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAirlines.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No airlines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="p-3">
          <ul className="pagination justify-content-end mb-0">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages && "disabled"}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* MODAL */}
      <AirlineModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editId={editId}
      />
    </div>
  );
};

/* SUMMARY CARD */
const SummaryCard = ({ title, value, icon, color }) => (
  <div className="col-md-4">
    <div className="card shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted mb-1">{title}</p>
          <h3 className="fw-bold">{value}</h3>
        </div>
        <div className={`icon-circle bg-${color}`}>{icon}</div>
      </div>
    </div>
  </div>
);

export default Airlines;
