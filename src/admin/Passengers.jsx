import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from "react-toastify";
import PassengerModal from "./PassengerModal";

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  // ================= FETCH =================
  const fetchPassengers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/passengers/allPassengers",
      );
      setPassengers(res.data);
    } catch (error) {
      toast.error("Failed to load passengers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete passenger?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/passengers/deletePassenger/${id}`,
      );
      toast.success("Passenger deleted");
      fetchPassengers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredPassengers = useMemo(() => {
    return passengers.filter(
      (p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking_id?.bookingReference
          ?.toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [passengers, search]);

  // ================= COLUMNS =================
  const columns = [
    {
      name: <div className="font-semibold text-lg">NO</div>,
      selector: (row, index) => <div className="text-center font-medium">{index + 1}</div>,
      width: "70px",
    },
    {
      name: <div className="font-semibold text-lg">Name</div>,
      selector: (row) => <div className="font-medium">{row.name}</div>,
      sortable: true,
    },
    {
      name: <div className="font-semibold text-lg">Age</div>,
      selector: (row) => <div className="font-medium">{row.age}</div>,
      sortable: true,
      width: "80px",
    },
    {
      name: <div className="font-semibold text-lg">Gender</div>,
      selector: (row) => <div className="font-medium">{row.gender}</div>,
      width: "100px",
    },
    {
      name: <div className="font-semibold text-lg">Seat</div>,
      selector: (row) => <div className="font-medium">{row.seat_number}</div>,
      width: "90px",
    },
    {
      name: <div className="font-semibold text-lg">Booking Ref</div>,
      selector: (row) => <div className="font-medium">{row.booking_id?.bookingReference}</div>,
    },
    {
      name: <div className="font-semibold text-lg">Actions</div>,
      width: "180px", 
      cell: (row) => (
        <div className="flex gap-2 items-center whitespace-nowrap">
          <button
            className="px-4 py-1 text-xs font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-600"
            onClick={() => {
              setSelectedPassenger(row);
              setShowModal(true);
            }}
          >
            <i className="fas fa-edit"></i>
          </button>

          <button
            className="px-4 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => handleDelete(row._id)}
          >
           <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  // ================= CUSTOM TABLE STYLES =================
  const customStyles = {
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "600",
        backgroundColor: "#f1f2f1",
      },
    },
    rows: {
      style: {
        minHeight: "56px",
      },
    },
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="rounded-lg  p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Passengers Data</h2>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => {
              setSelectedPassenger(null);
              setShowModal(true);
            }}
          >
            + Add Passenger
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by Name / Booking Ref"
          className="mb-4 w-1/3 px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredPassengers}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
          noDataComponent="No passengers found"
        />
      </div>

      {showModal && (
        <PassengerModal
          passenger={selectedPassenger}
          onClose={() => setShowModal(false)}
          refresh={fetchPassengers}
        />
      )}
    </div>
  );
};

export default Passengers;
