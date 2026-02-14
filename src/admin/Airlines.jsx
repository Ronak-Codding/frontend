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

  const [form, setForm] = useState({
    airline_name: "",
    airline_code: "",
    status: "Publish",
  });

  const fetchAirlines = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/airlines/allAirlines",
    );
    setAirlines(res.data.airlines || []);
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/airlines/updateAirline/${editId}`,
        form,
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
    if (!window.confirm("Are you sure you want to delete this airline?"))
      return;

    await axios.delete(
      `http://localhost:5000/api/airlines/deleteAirline/${id}`,
    );
    fetchAirlines();
  };

  const filteredAirlines = airlines.filter((a) => {
    return (
      (a.airline_name.toLowerCase().includes(search.toLowerCase()) ||
        a.airline_code.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || a.status === statusFilter)
    );
  });

  const totalPages = Math.ceil(filteredAirlines.length / airlinesPerPage);
  const indexOfLast = currentPage * airlinesPerPage;
  const indexOfFirst = indexOfLast - airlinesPerPage;
  const currentAirlines = filteredAirlines.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Airline Data</h2>

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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
         <i className="fas fa-plus mr-2"></i>Add Airline
        </button>
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
                placeholder="Search airline..."
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Code</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y  text-gray-700">
            {currentAirlines.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{a.airline_name}</td>
                <td className="px-4 py-3 text-center">{a.airline_code}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      a.status === "Publish"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}

            {currentAirlines.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No airlines found
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
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            ‹ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  currentPage === page
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next ›
          </button>
        </div>
      )}

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
