import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import "./UserLayout.css";
import "./UserPages.css";

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/payments?email=${user.email}`,
        );
        if (res.ok) setPayments(await res.json());
      } catch {
        console.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchPayments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filtered = payments.filter((p) => {
    const matchSearch =
      !search ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingId?.bookingReference
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      p.paymentMethod?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      p.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  const totalSpent = payments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + (p.amount || 0), 0);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const STATUS_CLASS = {
    success: "up-badge-confirmed",
    failed: "up-badge-cancelled",
    pending: "up-badge-pending",
    refunded: "up-badge-pending",
  };
  const METHOD_ICON = { card: "💳", upi: "📱", netbanking: "🏦", wallet: "👛" };

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Booking Ref",
      "Amount",
      "Method",
      "Status",
      "Date",
    ];
    const csv = [
      headers,
      ...payments.map((p) => [
        p.transactionId,
        p.bookingId?.bookingReference || "",
        p.amount,
        p.paymentMethod,
        p.status,
        formatDate(p.createdAt),
      ]),
    ]
      .map((r) => r.map((c) => `"${c || ""}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div
        className="up-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 className="up-title">Payment History</h1>
          <p className="up-subtitle">
            Total spent: ₹{totalSpent.toLocaleString("en-IN")}
          </p>
        </div>
        <button className="up-btn-secondary" onClick={exportCSV}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="up-grid-3" style={{ marginBottom: "1.5rem" }}>
        {[
          {
            label: "Total Transactions",
            value: payments.length,
            color: "#667eea",
            bg: "rgba(102,126,234,0.1)",
          },
          {
            label: "Successful",
            value: payments.filter((p) => p.status === "success").length,
            color: "#10b981",
            bg: "rgba(16,185,129,0.1)",
          },
          {
            label: "Refunded",
            value: payments.filter((p) => p.status === "refunded").length,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.1)",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="up-card up-card-body"
            style={{ padding: "1.25rem" }}
          >
            <div
              style={{ fontSize: "1.5rem", fontWeight: 700, color }}
              className="up-stat-value"
            >
              {value}
            </div>
            <div className="up-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="up-card" style={{ marginBottom: "1.25rem" }}>
        <div className="up-card-body" style={{ padding: "1rem 1.25rem" }}>
          <div className="ub-filter-row">
            <div className="ub-search-wrapper">
              <Search size={15} className="ub-search-icon" />
              <input
                type="text"
                placeholder="Search by transaction ID, booking ref..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ub-search-input"
              />
            </div>
            <select
              className="ub-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="up-card">
        <div style={{ overflowX: "auto" }}>
          <table className="up-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking Ref</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="up-table-empty">
                    <div className="up-spinner" style={{ margin: "0 auto" }} />
                    <p>Loading payments...</p>
                  </td>
                </tr>
              ) : current.length === 0 ? (
                <tr>
                  <td colSpan={6} className="up-table-empty">
                    <CreditCard
                      size={40}
                      style={{
                        opacity: 0.3,
                        margin: "0 auto 0.5rem",
                        display: "block",
                      }}
                    />
                    <p>No payments found</p>
                  </td>
                </tr>
              ) : (
                current.map((p, i) => (
                  <tr key={p._id || i}>
                    <td className="up-table-mono">{p.transactionId || "—"}</td>
                    <td className="up-table-accent">
                      {p.bookingId?.bookingReference || p.bookingRef || "—"}
                    </td>
                    <td>
                      <span className="up-method-badge">
                        {METHOD_ICON[p.paymentMethod] || "💰"}{" "}
                        {p.paymentMethod || "—"}
                      </span>
                    </td>
                    <td className="up-table-amount">
                      ₹{p.amount?.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={`up-badge ${STATUS_CLASS[p.status] || "up-badge-pending"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="up-table-muted">
                      {formatDate(p.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="ub-pagination"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            <p className="ub-page-info">
              Showing {(currentPage - 1) * perPage + 1}–
              {Math.min(currentPage * perPage, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="ub-page-btns">
              <button
                className="ub-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`ub-page-btn ${currentPage === i + 1 ? "ub-page-btn-active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="ub-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPayments;
