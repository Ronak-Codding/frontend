import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Trash2,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import "./AdminTables.css";

const STATUS_CONFIG = {
  success: { label: "Success", className: "badge-success", icon: CheckCircle },
  failed: { label: "Failed", className: "badge-failed", icon: XCircle },
  pending: { label: "Pending", className: "badge-pending", icon: Clock },
  refunded: { label: "Refunded", className: "badge-refunded", icon: RefreshCw },
};

const METHOD_CONFIG = {
  card: { label: "Card", icon: CreditCard, className: "badge-card" },
  upi: { label: "UPI", icon: Smartphone, className: "badge-upi" },
  netbanking: {
    label: "Net Banking",
    icon: Building2,
    className: "badge-netbanking",
  },
  wallet: { label: "Wallet", icon: Wallet, className: "badge-wallet" },
};

const STAT_CARDS = (totalRevenue, total, payments) => [
  {
    label: "Total Revenue",
    value: `₹${totalRevenue.toLocaleString("en-IN")}`,
    color: "#10b981",
    icon: IndianRupee,
  },
  {
    label: "Total Transactions",
    value: total,
    color: "#60a5fa",
    icon: CreditCard,
  },
  {
    label: "Success",
    value: payments.filter((p) => p.status === "success").length,
    color: "#34d399",
    icon: CheckCircle,
  },
  {
    label: "Refunded",
    value: payments.filter((p) => p.status === "refunded").length,
    color: "#fb923c",
    icon: RefreshCw,
  },
];

export default function AdminPayments({ token }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [refundModal, setRefundModal] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchPayments();
  }, [page, status, method]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
        status,
        method,
      });
      const res = await fetch(
        `http://localhost:5000/api/admin/payments?${params}`,
        { headers: authHeaders },
      );
      const data = await res.json();
      setPayments(data.payments || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/payments/refund/${refundModal._id}`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ reason: refundReason }),
        },
      );
      setRefundModal(null);
      setRefundReason("");
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment record?")) return;
    try {
      await fetch(`http://localhost:5000/api/admin/payments/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      fetchPayments();
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
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div>
      {/* ── Header ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Payments</h1>
          <p className="admin-page-subtitle">Total: {total} transactions</p>
        </div>
        <button
          className="btn-secondary"
          onClick={() =>
            window.open(
              "http://localhost:5000/api/admin/payments/export/csv",
              "_blank",
            )
          }
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="admin-stats-grid">
        {STAT_CARDS(totalRevenue, total, payments).map(
          ({ label, value, color, icon: Icon }) => (
            <div key={label} className="admin-stat-card">
              <div className="admin-stat-card-header">
                <p className="admin-stat-label">{label}</p>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="admin-stat-value" style={{ color }}>
                {value}
              </p>
            </div>
          ),
        )}
      </div>

      {/* ── Filters ── */}
      <div className="admin-filters">
        <form
          className="admin-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchPayments();
          }}
        >
          <div className="admin-search-wrapper">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by TXN ID, Name, Email, Flight..."
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
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          className="admin-select"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Methods</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="netbanking">Net Banking</option>
          <option value="wallet">Wallet</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-container">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                {[
                  "Transaction ID",
                  "Passenger",
                  "Flight",
                  "Route",
                  "Amount",
                  "Method",
                  "Status",
                  "Date & Time",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="admin-table-loading">
                    <Loader2
                      size={32}
                      className="admin-table-empty-icon"
                      style={{ opacity: 1, color: "#667eea" }}
                    />
                    <p>Loading payments...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="admin-table-empty">
                    <CreditCard size={48} className="admin-table-empty-icon" />
                    <p>No payments found</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const statusConfig =
                    STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                  const methodConfig =
                    METHOD_CONFIG[p.paymentMethod] || METHOD_CONFIG.card;
                  const StatusIcon = statusConfig.icon;
                  const MethodIcon = methodConfig.icon;

                  return (
                    <tr key={p._id}>
                      {/* Transaction ID */}
                      <td>
                        <p className="cell-accent">{p.transactionId}</p>
                        <p
                          className="cell-muted"
                          style={{ fontSize: "0.75rem", margin: "0.25rem 0 0" }}
                        >
                          BK{p.bookingId?.toString().slice(-6).toUpperCase()}
                        </p>
                      </td>

                      {/* Passenger */}
                      <td>
                        <div className="admin-avatar-cell">
                          {/* <div className="admin-avatar">
                            {p.passengerName?.charAt(0) || "?"}
                          </div> */}
                          <div className="admin-avatar-info">
                            <p className="admin-avatar-name">
                              {p.passengerName || "—"}
                            </p>
                            <p className="admin-avatar-sub">{p.email || "—"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Flight */}
                      <td>{p.flightNumber || "—"}</td>

                      {/* Route */}
                      <td>
                        {p.from} → {p.to}
                      </td>

                      {/* Amount */}
                      <td className="cell-success">
                        ₹{p.amount?.toLocaleString("en-IN")}
                      </td>

                      {/* Method */}
                      <td>
                        <div className={methodConfig.className}>
                          <MethodIcon size={14} />
                          {methodConfig.label}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={statusConfig.className}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td
                        className="cell-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {formatDate(p.createdAt)}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="cell-actions">
                          {p.status === "success" && (
                            <button
                              className="btn-warning"
                              onClick={() => setRefundModal(p)}
                            >
                              <RefreshCw size={12} /> Refund
                            </button>
                          )}
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(p._id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="admin-pagination">
        <p className="admin-pagination-info">
          Showing {Math.min((page - 1) * 10 + 1, total)}–
          {Math.min(page * 10, total)} of {total}
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

      {/* ── Refund Modal ── */}
      {refundModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-sm">
            <div className="admin-modal-header">
              <div>
                <h2 className="admin-modal-title">Initiate Refund</h2>
                <p className="admin-modal-subtitle">
                  TXN: {refundModal.transactionId}
                </p>
              </div>
            </div>

            <div className="admin-modal-body">
              <div className="admin-warning-box">
                <AlertCircle size={16} />
                Refund Amount: ₹{refundModal.amount?.toLocaleString("en-IN")}
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Refund Reason</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  rows={3}
                  className="admin-input"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setRefundModal(null);
                  setRefundReason("");
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.75rem",
                  background: "#f97316",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                <RefreshCw size={16} /> Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
