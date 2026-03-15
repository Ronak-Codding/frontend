import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Users,
} from "lucide-react";
import "./AdminTables.css";

export default function AdminPassengers({ token }) {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    email: "",
    phone: "",
    flightNumber: "",
    from: "",
    to: "",
    seat: "",
    totalPrice: "",
  });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchPassengers();
  }, [page, gender]);

  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        gender,
        minAge,
        maxAge,
      });
      const res = await fetch(
        `http://localhost:5000/api/admin/passengers?${params}`,
        { headers: authHeaders },
      );
      const data = await res.json();
      setPassengers(data.passengers || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId, passengerIndex) => {
    if (!window.confirm("Delete this passenger?")) return;
    try {
      await fetch(
        `http://localhost:5000/api/admin/passengers/${bookingId}/${passengerIndex}`,
        {
          method: "DELETE",
          headers: authHeaders,
        },
      );
      fetchPassengers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (passenger) => {
    setModalMode("edit");
    setEditData(passenger);
    setFormData({
      fullName: passenger.fullName || "",
      gender: passenger.gender || "",
      dob: passenger.dob || "",
      nationality: passenger.nationality || "",
      passportNumber: passenger.passportNumber || "",
      passportExpiry: passenger.passportExpiry || "",
      email: passenger.email || "",
      phone: passenger.phone || "",
      flightNumber: passenger.flightNumber || "",
      from: passenger.from || "",
      to: passenger.to || "",
      seat: passenger.seat || "",
      totalPrice: passenger.totalPrice || "",
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setModalMode("add");
    setEditData(null);
    setFormData({
      fullName: "",
      gender: "",
      dob: "",
      nationality: "",
      passportNumber: "",
      passportExpiry: "",
      email: "",
      phone: "",
      flightNumber: "",
      from: "",
      to: "",
      seat: "",
      totalPrice: "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === "edit" && editData) {
        const [bookingId, pIndex] = editData._id.split("_");
        await fetch(
          `http://localhost:5000/api/admin/passengers/${bookingId}/${pIndex}`,
          {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify(formData),
          },
        );
      } else {
        await fetch("http://localhost:5000/api/admin/passengers", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            flightNumber: formData.flightNumber,
            from: formData.from,
            to: formData.to,
            seats: [formData.seat],
            totalPrice: parseFloat(formData.totalPrice) || 0,
            passengers: [
              {
                fullName: formData.fullName,
                gender: formData.gender,
                dob: formData.dob,
                nationality: formData.nationality,
                passportNumber: formData.passportNumber,
                passportExpiry: formData.passportExpiry,
                email: formData.email,
                phone: formData.phone,
              },
            ],
          }),
        });
      }
      setShowModal(false);
      fetchPassengers();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const FORM_FIELDS = [
    {
      label: "Full Name",
      field: "fullName",
      type: "text",
      placeholder: "As on passport",
    },
    { label: "Date of Birth", field: "dob", type: "date" },
    {
      label: "Nationality",
      field: "nationality",
      type: "text",
      placeholder: "e.g. Indian",
    },
    {
      label: "Passport Number",
      field: "passportNumber",
      type: "text",
      placeholder: "A1234567",
    },
    { label: "Passport Expiry", field: "passportExpiry", type: "date" },
    {
      label: "Email",
      field: "email",
      type: "email",
      placeholder: "email@example.com",
    },
    {
      label: "Phone",
      field: "phone",
      type: "tel",
      placeholder: "+91 98765 43210",
    },
    {
      label: "Flight Number",
      field: "flightNumber",
      type: "text",
      placeholder: "AI 302",
    },
    { label: "From", field: "from", type: "text", placeholder: "BOM" },
    { label: "To", field: "to", type: "text", placeholder: "DEL" },
    { label: "Seat", field: "seat", type: "text", placeholder: "12A" },
    {
      label: "Total Price (₹)",
      field: "totalPrice",
      type: "number",
      placeholder: "15000",
    },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Passengers Management</h1>
          <p className="admin-page-subtitle">
            Total: {total} | Page {page} of {pages}
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            className="btn-secondary"
            onClick={() =>
              window.open(
                "http://localhost:5000/api/admin/passengers/export/csv",
                "_blank",
              )
            }
          >
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={16} /> Add Passenger
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="admin-filters">
        <form
          className="admin-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchPassengers();
          }}
        >
          <div className="admin-search-wrapper">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by Name, Booking Ref, Seat, Passport..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input admin-input-search"
            />
          </div>
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        <select
          className="admin-select"
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className="admin-input admin-input-sm"
        />
        <input
          type="number"
          placeholder="Max Age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          className="admin-input admin-input-sm"
        />
        <button
          className="btn-secondary"
          onClick={() => {
            setPage(1);
            fetchPassengers();
          }}
        >
          Apply
        </button>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-container">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>No</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Seat</th>
                <th>Booking Ref</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Passport</th>
                <th>Nationality</th>
                <th>Email</th>
                <th>Booked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="admin-table-loading">
                    <Loader2
                      size={32}
                      className="admin-table-empty-icon"
                      style={{ opacity: 1, color: "#667eea" }}
                    />
                    <p>Loading passengers...</p>
                  </td>
                </tr>
              ) : passengers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="admin-table-empty">
                    <Users size={48} className="admin-table-empty-icon" />
                    <p>No passengers found</p>
                  </td>
                </tr>
              ) : (
                passengers.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td className="cell-muted">{(page - 1) * 10 + i + 1}</td>

                    {/* Name + Phone */}
                    <td>
                      <div className="admin-avatar-cell">
                        <div className="admin-avatar">
                          {p.fullName?.charAt(0) || "?"}
                        </div>
                        <div className="admin-avatar-info">
                          <p className="admin-avatar-name">{p.fullName}</p>
                          <p className="admin-avatar-sub">{p.phone || "—"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="cell-muted">{p.age || "—"}</td>

                    {/* Gender Badge */}
                    <td>
                      <span
                        className={
                          p.gender === "male"
                            ? "badge-male"
                            : p.gender === "female"
                              ? "badge-female"
                              : "badge-other"
                        }
                      >
                        {p.gender || "—"}
                      </span>
                    </td>

                    <td className="cell-mono">{p.seat}</td>
                    <td className="cell-accent">{p.bookingRef}</td>
                    <td>{p.flightNumber}</td>
                    <td>
                      {p.from} → {p.to}
                    </td>
                    <td className="cell-mono cell-muted">
                      {p.passportNumber || "—"}
                    </td>
                    <td className="cell-muted">{p.nationality || "—"}</td>
                    <td className="cell-muted" style={{ fontSize: "0.75rem" }}>
                      {p.email || "—"}
                    </td>
                    <td className="cell-muted" style={{ fontSize: "0.75rem" }}>
                      {formatDate(p.createdAt)}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="cell-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(p)}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => {
                            const [bookingId, pIndex] = p._id.split("_");
                            handleDelete(bookingId, parseInt(pIndex));
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="admin-pagination">
        <p className="admin-pagination-info">
          Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}{" "}
          passengers
        </p>
        <div className="admin-pagination-buttons">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`pagination-btn ${page === p ? "pagination-btn-active" : ""}`}
              >
                {p}
              </button>
            ),
          )}
          <button
            className="pagination-btn"
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            {/* Modal Header */}
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {modalMode === "add" ? "Add New Passenger" : "Edit Passenger"}
              </h2>
              <button
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="admin-modal-body">
              <div className="admin-modal-grid">
                {FORM_FIELDS.map(({ label, field, type, placeholder }) => (
                  <div className="admin-form-group" key={field}>
                    <label className="admin-form-label">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="admin-input"
                    />
                  </div>
                ))}

                {/* Gender Select */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Gender</label>
                  <select
                    className="admin-select"
                    style={{ width: "100%" }}
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="admin-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <Save size={16} />
                {modalMode === "add" ? "Add Passenger" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
