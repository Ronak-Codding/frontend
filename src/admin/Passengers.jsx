import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PassengerModal from "./PassengerModal";
import "./Passengers.css";

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  const fetchPassengers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/passengers");
      setPassengers(res.data);
    } catch {
      toast.error("Failed to load passengers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete passenger?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/passengers/${id}`);
      toast.success("Passenger deleted");
      fetchPassengers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = passengers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.booking_id?.bookingReference
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="passenger-page">
      <h2>Passengers</h2>

      <button
        className="btn btn-primary mb-3 "
        onClick={() => {
          setSelectedPassenger(null);
          setShowModal(true);
        }}
      >
        ➕ Add Passenger
      </button>

      <input
        className="form-control mb-3 w-50"
        placeholder="Search by Name / Booking Ref"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-light table-hover fw-normal passenger-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Seat</th>
            <th>Booking Ref</th>
            <th className="w-10">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No passengers found
              </td>
            </tr>
          ) : (
            filtered.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.seat_number}</td>
                <td>{p.booking_id?.bookingReference}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setSelectedPassenger(p);
                      setShowModal(true);
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
