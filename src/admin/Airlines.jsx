import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AirlineModal from "./AirlineModal";

const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    airline_name: "",
    airline_code: "",
    status: "Publish",
  });

  const fetchAirlines = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/airlines/allAirlines",
      {
        params: { search, page: currentPage, limit },
      }
    );

    setAirlines(res.data.airlines || []);
    setTotalPages(res.data.totalPages || 1);
  }, [search, currentPage]);

  useEffect(() => {
    fetchAirlines();
  }, [fetchAirlines]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/airlines/updateAirline/${editId}`,
        form
      );
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
      await axios.delete(
        `http://localhost:5000/api/airlines/deleteAirline/${id}`
      );
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

  return (
    <div className="p-6  min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Airline Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage airlines data
          </p>
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add New Airline
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by airline name or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="md:col-span-2 border border-gray-300 placeholder-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2  text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Publish">Publish</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-lg font-bold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-center text-lg font-bold text-gray-700">
                Code
              </th>
              <th className="px-4 py-3 text-center text-lg  font-bold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center text-lg font-bold text-gray-700 w-[140px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredAirlines.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {a.airline_name}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="inline-flex rounded-full bg-indigo-500 text-white text-sm px-3 py-1">
                    {a.airline_code}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full text-sm px-3 py-1 font-medium ${
                      a.status === "Publish"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredAirlines.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No airlines found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end mt-4">
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
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

export default Airlines;
