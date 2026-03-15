import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Users,
  Eye,
  CheckSquare,
  Square,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import "./AdminTables.css";
import "./AdminUsers.css";
import "./AdminPassengers.css";

export default function AdminPassengers({ token }) {
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [gender, setGender] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPassenger, setViewPassenger] = useState(null);
  const [editData, setEditData] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "fullName",
    direction: "asc",
  });
  const [exportFormat, setExportFormat] = useState("csv");
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

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  useEffect(() => {
    fetchPassengers();
  }, [page]);
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchPassengers();
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm, gender]);

  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search: searchTerm,
        ...(gender !== "all" && { gender }),
      });
      const res = await fetch(
        `http://localhost:5000/api/admin/passengers?${params}`,
        { headers: authHeaders },
      );
      const data = await res.json();
      setFilteredPassengers(data.passengers || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      showNotification("Failed to fetch passengers", "error");
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    const dir =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: dir });
    setFilteredPassengers(
      [...filteredPassengers].sort((a, b) => {
        let av = a[key],
          bv = b[key];
        if (key === "createdAt") {
          av = new Date(av).getTime();
          bv = new Date(bv).getTime();
        } else if (key === "age") {
          av = parseInt(a.age) || 0;
          bv = parseInt(b.age) || 0;
        }
        return dir === "asc"
          ? av < bv
            ? -1
            : av > bv
              ? 1
              : 0
          : bv < av
            ? -1
            : bv > av
              ? 1
              : 0;
      }),
    );
  };
  const SortIcon = ({ col }) =>
    sortConfig.key === col
      ? sortConfig.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const handleDelete = async (bId, pIdx) => {
    if (!window.confirm("Delete this passenger?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:5000/api/admin/passengers/${bId}/${pIdx}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      showNotification("Passenger deleted");
      fetchPassengers();
    } catch {
      showNotification("Failed to delete", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditData(p);
    setFormData({
      fullName: p.fullName || "",
      gender: p.gender || "",
      dob: p.dob || "",
      nationality: p.nationality || "",
      passportNumber: p.passportNumber || "",
      passportExpiry: p.passportExpiry || "",
      email: p.email || "",
      phone: p.phone || "",
      flightNumber: p.flightNumber || "",
      from: p.from || "",
      to: p.to || "",
      seat: p.seat || "",
      totalPrice: p.totalPrice || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const [bId, pIdx] = editData._id.split("_");
      await fetch(`http://localhost:5000/api/admin/passengers/${bId}/${pIdx}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(formData),
      });
      showNotification("Passenger updated");
      setShowModal(false);
      fetchPassengers();
    } catch {
      showNotification("Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedPassengers(
      selectAll ? [] : filteredPassengers.map((p) => p._id),
    );
  };
  const toggleSelect = (id) =>
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedPassengers.length} passengers?`))
      return;
    setLoading(true);
    try {
      await Promise.all(
        selectedPassengers.map((id) => {
          const [b, i] = id.split("_");
          return fetch(`http://localhost:5000/api/admin/passengers/${b}/${i}`, {
            method: "DELETE",
            headers: authHeaders,
          });
        }),
      );
      showNotification(`${selectedPassengers.length} deleted`);
      setSelectedPassengers([]);
      setSelectAll(false);
      fetchPassengers();
    } catch {
      showNotification("Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenderUpdate = async (newGender) => {
    if (!newGender) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedPassengers.map((id) => {
          const [b, i] = id.split("_");
          return fetch(`http://localhost:5000/api/admin/passengers/${b}/${i}`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ gender: newGender }),
          });
        }),
      );
      showNotification(
        `${selectedPassengers.length} passengers updated to ${newGender}`,
      );
      setSelectedPassengers([]);
      setSelectAll(false);
      fetchPassengers();
    } catch {
      showNotification("Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  const exportPassengers = () => {
    const data = filteredPassengers;
    if (exportFormat === "csv") {
      const h = [
        "Full Name",
        "Age",
        "Gender",
        "Seat",
        "Booking Ref",
        "Flight",
        "From",
        "To",
        "Email",
        "Phone",
        "Booked On",
      ];
      const csv = [
        h,
        ...data.map((p) => [
          p.fullName,
          p.age,
          p.gender,
          p.seat,
          p.bookingRef,
          p.flightNumber,
          p.from,
          p.to,
          p.email,
          p.phone,
          formatDate(p.createdAt),
        ]),
      ]
        .map((r) => r.map((c) => `"${c || ""}"`).join(","))
        .join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `passengers_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      a.download = `passengers_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }
    showNotification(`Exported ${data.length} passengers`);
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const b = new Date(dob),
      t = new Date();
    let a = t.getFullYear() - b.getFullYear();
    if (
      t.getMonth() - b.getMonth() < 0 ||
      (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())
    )
      a--;
    return a;
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
      {/* Loading */}
      {loading && (
        <div className="users-loading-overlay">
          <div className="users-loading-box">
            <div className="users-spinner" />
            <p>Loading...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`users-notification ${notification.type === "error" ? "users-notification-error" : "users-notification-success"}`}
        >
          {notification.message}
        </div>
      )}

      {/* ── View Modal ── */}
      {showViewModal && viewPassenger && (
        <div
          className="pax-modal-overlay"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="pax-modal pax-modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pax-modal-header">
              <h2 className="pax-modal-title">Passenger Details</h2>
              <button
                className="pax-modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="pax-modal-body">
              <div className="pax-section">
                <h3 className="pax-section-title">
                  <Users size={14} /> Personal Information
                </h3>
                <div className="pax-detail-grid">
                  {[
                    ["Full Name", viewPassenger.fullName],
                    [
                      "Age",
                      viewPassenger.age || calculateAge(viewPassenger.dob),
                    ],
                    ["Gender", viewPassenger.gender],
                    ["Date of Birth", formatDate(viewPassenger.dob)],
                    ["Nationality", viewPassenger.nationality],
                  ].map(([l, v]) => (
                    <div className="pax-detail-row" key={l}>
                      <span className="pax-detail-label">{l}</span>
                      <span className="pax-detail-value">{v || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pax-section">
                <h3 className="pax-section-title">
                  <Mail size={14} /> Contact
                </h3>
                <div className="pax-detail-grid">
                  {[
                    ["Email", viewPassenger.email],
                    ["Phone", viewPassenger.phone],
                  ].map(([l, v]) => (
                    <div className="pax-detail-row" key={l}>
                      <span className="pax-detail-label">{l}</span>
                      <span className="pax-detail-value">{v || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
              {(viewPassenger.passportNumber ||
                viewPassenger.passportExpiry) && (
                <div className="pax-section">
                  <h3 className="pax-section-title">
                    <FileText size={14} /> Passport
                  </h3>
                  <div className="pax-detail-grid">
                    {[
                      ["Passport Number", viewPassenger.passportNumber],
                      ["Expiry", formatDate(viewPassenger.passportExpiry)],
                    ].map(([l, v]) => (
                      <div className="pax-detail-row" key={l}>
                        <span className="pax-detail-label">{l}</span>
                        <span className="pax-detail-value">{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pax-section">
                <h3 className="pax-section-title">
                  <MapPin size={14} /> Flight Info
                </h3>
                <div className="pax-detail-grid">
                  {[
                    ["Booking Ref", viewPassenger.bookingRef],
                    ["Flight", viewPassenger.flightNumber],
                    ["From", viewPassenger.from],
                    ["To", viewPassenger.to],
                    ["Seat", viewPassenger.seat],
                    [
                      "Total Price",
                      viewPassenger.totalPrice
                        ? `₹${viewPassenger.totalPrice}`
                        : "—",
                    ],
                    ["Booked On", formatDate(viewPassenger.createdAt)],
                  ].map(([l, v]) => (
                    <div className="pax-detail-row" key={l}>
                      <span className="pax-detail-label">{l}</span>
                      <span className="pax-detail-value">{v || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pax-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showModal && (
        <div className="pax-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="pax-modal pax-modal-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pax-modal-header">
              <h2 className="pax-modal-title">Edit Passenger</h2>
              <button
                className="pax-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="pax-modal-body">
              <div className="pax-form-grid">
                {FORM_FIELDS.map(({ label, field, type, placeholder }) => (
                  <div className="pax-form-group" key={field}>
                    <label className="pax-form-label">{label}</label>
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
                      className="pax-form-input"
                    />
                  </div>
                ))}
                <div className="pax-form-group">
                  <label className="pax-form-label">Gender</label>
                  <select
                    className="pax-form-select"
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
            <div className="pax-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div
                      className="users-spinner"
                      style={{ width: 16, height: 16, borderWidth: 2 }}
                    />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Passengers Management</h1>
          <p className="admin-page-subtitle">
            Total: {total} | Page {page} of {pages}
          </p>
        </div>
        <div className="admin-header-actions">
          <select
            className="admin-select"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button className="btn-secondary" onClick={exportPassengers}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* ── Search + Gender ── */}
      <div className="users-filter-card">
        <div className="pax-search-row">
          <div className="admin-search-wrapper" style={{ flex: 1 }}>
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by Name, Booking Ref, Seat, Passport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input admin-input-search"
            />
          </div>
          <select
            className="admin-select pax-gender-select"
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
        </div>
      </div>

      {/* ── Bulk Bar ── */}
      {selectedPassengers.length > 0 && (
        <div className="users-bulk-bar">
          <span className="users-bulk-count">
            {selectedPassengers.length} passenger(s) selected
          </span>
          <div className="users-bulk-actions">
            <select
              className="admin-select"
              defaultValue=""
              onChange={(e) => handleBulkGenderUpdate(e.target.value)}
            >
              <option value="" disabled>
                Change Gender
              </option>
              <option value="male">Set Male</option>
              <option value="female">Set Female</option>
              <option value="other">Set Other</option>
            </select>
            <button
              className="users-bulk-btn users-bulk-blocked"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
            <button
              className="users-bulk-btn users-bulk-clear"
              onClick={() => {
                setSelectedPassengers([]);
                setSelectAll(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {/* ── Table ── */}
      <div className="admin-table-container">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <button
                    onClick={handleSelectAll}
                    className="passengers-check-btn"
                  >
                    {selectAll ? (
                      <CheckSquare size={16} style={{ color: "#667eea" }} />
                    ) : (
                      <Square
                        size={16}
                        style={{ color: "var(--text-secondary)" }}
                      />
                    )}
                  </button>
                </th>
                <th>No</th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("fullName")}
                >
                  Name <SortIcon col="fullName" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("age")}
                >
                  Age <SortIcon col="age" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("gender")}
                >
                  Gender <SortIcon col="gender" />
                </th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("seat")}
                >
                  Seat <SortIcon col="seat" />
                </th>
                <th>Booking Ref</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Email</th>
                <th
                  className="users-sortable"
                  onClick={() => requestSort("createdAt")}
                >
                  Booked On <SortIcon col="createdAt" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="admin-table-loading">
                    <Loader2
                      size={32}
                      className="admin-table-empty-icon"
                      style={{ opacity: 1, color: "#667eea" }}
                    />
                    <p>Loading passengers...</p>
                  </td>
                </tr>
              ) : filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="admin-table-empty">
                    <Users size={48} className="admin-table-empty-icon" />
                    <p>No passengers found</p>
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <button
                        onClick={() => toggleSelect(p._id)}
                        className="passengers-check-btn"
                      >
                        {selectedPassengers.includes(p._id) ? (
                          <CheckSquare size={16} style={{ color: "#667eea" }} />
                        ) : (
                          <Square
                            size={16}
                            style={{ color: "var(--text-secondary)" }}
                          />
                        )}
                      </button>
                    </td>
                    <td className="cell-muted">{(page - 1) * 10 + i + 1}</td>
                    <td>
                      <div className="admin-avatar-cell">
                        {/* <div className="admin-avatar">
                          {p.fullName?.charAt(0) || "?"}
                        </div> */}
                        <div className="admin-avatar-info">
                          <p className="admin-avatar-name">{p.fullName}</p>
                          {/* <p className="admin-avatar-sub">{p.phone || "—"}</p> */}
                        </div>
                      </div>
                    </td>
                    <td className="cell-muted">
                      {p.age || calculateAge(p.dob) || "—"}
                    </td>
                    <td>
                      <span
                        className={
                          p.gender?.toLowerCase() === "male"
                            ? "badge-male"
                            : p.gender?.toLowerCase() === "female"
                              ? "badge-female"
                              : "badge-other"
                        }
                      >
                        {p.gender || "—"}
                      </span>
                    </td>
                    <td className="cell-mono">{p.seat || "—"}</td>
                    <td className="cell-accent">{p.bookingRef || "—"}</td>
                    <td>{p.flightNumber || "—"}</td>
                    <td>
                      {p.from} → {p.to}
                    </td>
                    <td className="cell-muted" style={{ fontSize: "0.75rem" }}>
                      {p.email || "—"}
                    </td>
                    <td className="cell-muted" style={{ fontSize: "0.75rem" }}>
                      {formatDate(p.createdAt)}
                    </td>
                    <td>
                      <div className="cell-actions">
                        {/* <button
                          className="users-action-btn users-action-view"
                          title="View"
                          onClick={() => {
                            setViewPassenger(p);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye size={12} />
                        </button> */}
                        <button
                          className="users-action-btn users-action-edit"
                          title="Edit"
                          onClick={() => handleEdit(p)}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="users-action-btn users-action-delete"
                          title="Delete"
                          onClick={() => {
                            const [b, idx] = p._id.split("_");
                            handleDelete(b, parseInt(idx));
                          }}
                        >
                          <Trash2 size={12} />
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
    </div>
  );
}
