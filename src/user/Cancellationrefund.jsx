import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ban,
  RefreshCw,
  ReceiptText,
  Armchair,
  BadgeCheck,
  CheckCircle,
  ArrowLeft,
  Plane,
} from "lucide-react";
import "./UserPages.css";

const CANCEL_REASONS = [
  "— Select a reason —",
  "Change of plans",
  "Medical emergency",
  "Flight time inconvenient",
  "Found a better fare",
  "Personal reasons",
];
const CANCEL_FEE_RATE = 0.21;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtCur = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const CancellationRefund = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cancelledBooking, setCancelledBooking] = useState(null);
  const [refundAmt, setRefundAmt] = useState(0);
  const [cancelFee, setCancelFee] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user.email) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/booking/my-bookings/${encodeURIComponent(user.email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setBookings(
            data.filter(
              (b) => b.status === "confirmed" || b.status === "Confirmed",
            ),
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const calcRefund = useCallback((booking) => {
    const total =
      booking?.amount || booking?.totalAmount || booking?.price || 5546;
    const fee = Math.round(total * CANCEL_FEE_RATE);
    return { refund: total - fee, fee, total };
  }, []);

  const handleSelect = (b) => {
    setSelected(b);
    const { refund, fee } = calcRefund(b);
    setRefundAmt(refund);
    setCancelFee(fee);
  };

  const handleConfirmCancel = async () => {
    setProcessing(true);
    try {
      // Step 1: Cancel the booking
      const cancelRes = await fetch(
        `http://localhost:5000/api/booking/cancel/${selected._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );

      if (!cancelRes.ok) throw new Error("Booking cancel failed");

      // Step 2: Find payment by user email, then match by bookingId
      // Using email filter for reliable lookup instead of search query
      try {
        const payRes = await fetch(
          `http://localhost:5000/api/payment?email=${encodeURIComponent(user.email)}&limit=50`,
          { headers: { "Content-Type": "application/json" } },
        );

        if (payRes.ok) {
          const payData = await payRes.json();

          // Match payment by bookingId and only pick successful ones
          const payment = payData.payments?.find(
            (p) =>
              p.bookingId?.toString() === selected._id?.toString() &&
              p.status === "success",
          );

          if (payment?._id) {
            const refundRes = await fetch(
              `http://localhost:5000/api/payment/refund-request/${payment._id}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  reason: reason, // cancellation reason sent as refund reason
                  requestedBy: user.email,
                }),
              },
            );

            if (refundRes.ok) {
              console.log(
                "✅ Refund request submitted for payment:",
                payment.transactionId,
              );
            } else {
              const errData = await refundRes.json();
              console.warn("⚠️ Refund request API error:", errData);
            }
          } else {
            console.warn(
              "⚠️ No matching successful payment found for bookingId:",
              selected._id,
            );
          }
        }
      } catch (payErr) {
        // Non-critical — booking is cancelled, refund request is best-effort
        console.warn(
          "⚠️ Payment refund-request failed (non-critical):",
          payErr.message,
        );
      }

      setCancelledBooking(selected);
      setBookings((prev) => prev.filter((b) => b._id !== selected._id));
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
      setShowModal(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelected(null);
    setReason("");
    setCancelledBooking(null);
  };

  const progressPct = step === 1 ? 33 : step === 2 ? 67 : 100;
  const canProceed = selected && reason && reason !== CANCEL_REASONS[0];

  return (
    <div className="crp-page">
      <div className="up-header">
        <div className="crp-page-title-row">
          <button className="crp-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="up-title">Cancellation &amp; Refund</h1>
            <p className="up-subtitle">
              Cancel confirmed bookings and track refund status
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="cr-overlay" onClick={() => setShowModal(false)}>
          <div className="cr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cr-modal-icon">⚠️</div>
            <h3 className="cr-modal-title">Confirm Cancellation</h3>
            <p className="cr-modal-desc">
              You are about to cancel{" "}
              <strong>
                {selected?.bookingId || selected?._id?.slice(-8).toUpperCase()}
              </strong>{" "}
              ({selected?.from || "—"} → {selected?.to || "—"}). This is{" "}
              <strong>irreversible</strong>.
            </p>
            <div className="cr-refund-highlight">
              <p className="cr-rh-label">Estimated Refund</p>
              <p className="cr-rh-amt">{fmtCur(refundAmt)}</p>
              <p className="cr-rh-eta">
                Credited to original payment within 5–7 business days
              </p>
            </div>
            <div className="cr-modal-actions">
              <button
                className="cr-btn cr-btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Keep Booking
              </button>
              <button
                className="cr-btn cr-btn-danger"
                onClick={handleConfirmCancel}
                disabled={processing}
              >
                {processing ? (
                  <RefreshCw size={14} className="cr-spin" />
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="crp-main-card">
        {/* Progress Bar */}
        <div className="crp-progress-wrap">
          <div className="crp-progress-labels">
            {["Select Booking", "Review Refund", "Cancellation Status"].map(
              (label, i) => (
                <span
                  key={i}
                  className={`crp-progress-label${step === i + 1 ? " crp-progress-label--active" : ""}${step > i + 1 ? " crp-progress-label--done" : ""}`}
                >
                  <span className="crp-progress-num">{i + 1}</span>
                  {label}
                </span>
              ),
            )}
          </div>
          <div className="crp-progress-track">
            <div
              className="crp-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="crp-step-body">
            <div className="crp-two-col">
              <div className="crp-col">
                <p className="cr-section-label">Select Booking to Cancel</p>
                {loading ? (
                  <div className="up-empty">
                    <div className="up-spinner" style={{ margin: "0 auto" }} />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="cr-empty">
                    <CheckCircle size={40} color="#10b981" />
                    <p>No confirmed bookings available to cancel.</p>
                    <Link to="/user/bookings" className="ud-cta-link">
                      View All Bookings →
                    </Link>
                  </div>
                ) : (
                  bookings.map((b) => {
                    const ref = b.bookingId || b._id?.slice(-8).toUpperCase();
                    const isSelected = selected?._id === b._id;
                    const total = b.amount || b.totalAmount || b.price || 5546;
                    return (
                      <div
                        key={b._id}
                        className={`cr-booking-card crp-booking-card${isSelected ? " cr-booking-card--selected" : ""}`}
                        onClick={() => handleSelect(b)}
                      >
                        <div className="cr-booking-card-left">
                          <p className="cr-booking-ref">
                            {ref}
                            <span className="cr-confirmed-chip">confirmed</span>
                          </p>
                          <p className="cr-booking-route">
                            <Plane size={11} style={{ display: "inline" }} />{" "}
                            {b.from || "—"} → {b.to || "—"} ·{" "}
                            {fmtDate(b.journeyDate || b.travelDate || b.date)}
                          </p>
                        </div>
                        <div className="cr-booking-card-right">
                          <p className="cr-booking-price">{fmtCur(total)}</p>
                          <div
                            className={`cr-radio${isSelected ? " cr-radio--checked" : ""}`}
                          >
                            {isSelected && "✓"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                <p className="cr-section-label" style={{ marginTop: "1.2rem" }}>
                  Cancellation Reason
                </p>
                <select
                  className="cr-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={!selected}
                >
                  {CANCEL_REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                {reason === "Medical emergency" && (
                  <div className="cr-note">
                    ℹ️ For medical emergencies, a full refund may be applicable
                    with valid documentation.
                  </div>
                )}

                <button
                  className="cr-action-btn"
                  disabled={!canProceed}
                  onClick={() => setStep(2)}
                >
                  <Ban size={15} /> Proceed to Cancel
                </button>
              </div>

              <div className="crp-col crp-info-col">
                <div className="crp-info-card">
                  <p className="crp-info-title">💡 Before You Cancel</p>
                  <ul className="crp-info-list">
                    <li>
                      Cancellation fee of <strong>21%</strong> applies
                    </li>
                    <li>
                      Refund within <strong>5–7 business days</strong>
                    </li>
                    <li>Your seat will be released to other passengers</li>
                    <li>
                      Cancellation confirmation sent to{" "}
                      <strong>{user.email}</strong>
                    </li>
                    <li>Medical emergencies may qualify for full refund</li>
                  </ul>
                </div>
                <div className="crp-policy-card">
                  <p className="crp-info-title">📋 Refund Policy</p>
                  <div className="crp-policy-row">
                    <span>Base Fare</span>
                    <span>Refundable</span>
                  </div>
                  <div className="crp-policy-row">
                    <span>Taxes &amp; Fees</span>
                    <span>Refundable</span>
                  </div>
                  <div className="crp-policy-row crp-policy-row--red">
                    <span>Cancellation Fee</span>
                    <span>21% deducted</span>
                  </div>
                  <div className="crp-policy-row crp-policy-row--green">
                    <span>Estimated Refund</span>
                    <span>
                      {selected ? fmtCur(refundAmt) : "Select booking"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && selected && (
          <div className="crp-step-body">
            <div className="crp-two-col">
              <div className="crp-col">
                <p className="cr-section-label">
                  <ReceiptText size={13} /> Refund Calculation
                </p>
                <div className="cr-refund-table">
                  {(() => {
                    const total =
                      selected.amount ||
                      selected.totalAmount ||
                      selected.price ||
                      5546;
                    const baseFare = Math.round(total * 0.87);
                    const taxes = total - baseFare;
                    return (
                      <>
                        <div className="cr-refund-row">
                          <span className="cr-rl">🎫 Base Fare</span>
                          <span className="cr-rv">{fmtCur(baseFare)}</span>
                        </div>
                        <div className="cr-refund-row">
                          <span className="cr-rl">🧾 Taxes &amp; Fees</span>
                          <span className="cr-rv">{fmtCur(taxes)}</span>
                        </div>
                        <div className="cr-refund-row">
                          <span className="cr-rl">
                            ✂ Cancellation Fee (21%)
                          </span>
                          <span className="cr-rv cr-rv--red">
                            − {fmtCur(cancelFee)}
                          </span>
                        </div>
                        <div className="cr-refund-divider" />
                        <div className="cr-refund-total">
                          <span className="cr-rt-label">Total Refund</span>
                          <span className="cr-rt-value">
                            {fmtCur(refundAmt)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <p className="cr-section-label">
                  <Armchair size={13} /> Seat Availability Update
                </p>
                <div className="cr-seat-card" style={{ marginBottom: "1rem" }}>
                  <span style={{ fontSize: 24 }}>💺</span>
                  <div>
                    <p className="cr-seat-title">Seat will be released</p>
                    <p className="cr-seat-sub">
                      Made available to waitlisted passengers immediately
                    </p>
                  </div>
                  <span className="cr-seat-badge">+1 Open</span>
                </div>

                <div className="cr-btn-row">
                  <button
                    className="cr-btn cr-btn-ghost"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    className="cr-action-btn cr-action-btn--flex"
                    onClick={() => setShowModal(true)}
                  >
                    <Ban size={14} /> Confirm Cancellation
                  </button>
                </div>
              </div>

              <div className="crp-col">
                <p className="cr-section-label">Refund Timeline</p>
                <div className="crp-timeline-card">
                  {[
                    {
                      dot: "done",
                      title: "Cancellation Initiated",
                      desc: "Request submitted successfully",
                      time: "Now",
                    },
                    {
                      dot: "pending",
                      title: "Airline Processing",
                      desc: "Airline reviews and approves",
                      time: "1–2 days",
                    },
                    {
                      dot: "future",
                      title: "Refund Initiated",
                      desc: "Amount sent to payment gateway",
                      time: "3–4 days",
                    },
                    {
                      dot: "future",
                      title: "Amount Credited",
                      desc: "Appears in your bank / wallet",
                      time: "5–7 days",
                    },
                  ].map(({ dot, title, desc, time }, i) => (
                    <div key={i} className="crp-tl-row">
                      <div className="crp-tl-left">
                        <div className={`cr-tl-dot cr-tl-dot--${dot}`}>
                          {dot === "done" ? "✓" : dot === "pending" ? "⟳" : "○"}
                        </div>
                        {i < 3 && <div className="crp-tl-line" />}
                      </div>
                      <div className="crp-tl-content">
                        <div className="crp-tl-header">
                          <p className="cr-tl-title">{title}</p>
                          <span className="crp-tl-time">{time}</span>
                        </div>
                        <p className="cr-tl-desc">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="crp-refund-summary">
                  <p className="crp-rs-label">You will receive</p>
                  <p className="crp-rs-amt">{fmtCur(refundAmt)}</p>
                  <p className="crp-rs-sub">
                    Est. by{" "}
                    {new Date(Date.now() + 7 * 86400000).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="crp-step-body crp-success-body">
            <div className="crp-success-card">
              <div className="crp-success-icon-wrap">
                <span className="crp-success-icon">✅</span>
              </div>
              <h2 className="crp-success-title">Booking Cancelled</h2>
              <p className="crp-success-desc">
                Your booking{" "}
                <strong>
                  {cancelledBooking?.bookingId ||
                    cancelledBooking?._id?.slice(-8).toUpperCase()}
                </strong>{" "}
                ({cancelledBooking?.from} → {cancelledBooking?.to}) has been
                successfully cancelled.
              </p>
              <div className="crp-refund-big">
                <p className="crp-rb-label">Refund Initiated</p>
                <p className="crp-rb-amt">{fmtCur(refundAmt)}</p>
                <p className="crp-rb-eta">
                  Expected by{" "}
                  {new Date(Date.now() + 7 * 86400000).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              <p className="cr-section-label" style={{ marginTop: "1.5rem" }}>
                <BadgeCheck size={13} /> Live Status
              </p>
              <div
                className="crp-timeline-card"
                style={{ marginBottom: "1.5rem" }}
              >
                {[
                  {
                    dot: "done",
                    title: "Cancelled Successfully",
                    desc: `${new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })} · ${new Date().toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} IST`,
                  },
                  {
                    dot: "pending",
                    title: "Refund Processing",
                    desc: "Admin reviewing refund request",
                  },
                  {
                    dot: "future",
                    title: "Amount Credited",
                    desc: `Estimated: ${new Date(
                      Date.now() + 7 * 86400000,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}`,
                  },
                ].map(({ dot, title, desc }, i) => (
                  <div key={i} className="crp-tl-row">
                    <div className="crp-tl-left">
                      <div className={`cr-tl-dot cr-tl-dot--${dot}`}>
                        {dot === "done" ? "✓" : dot === "pending" ? "⟳" : "○"}
                      </div>
                      {i < 2 && <div className="crp-tl-line" />}
                    </div>
                    <div className="crp-tl-content">
                      <p className="cr-tl-title">{title}</p>
                      <p className="cr-tl-desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="crp-success-actions">
                <button className="cr-btn cr-btn-ghost" onClick={reset}>
                  Cancel Another Booking
                </button>
                <Link
                  to="/user/search"
                  className="cr-btn cr-btn-primary crp-search-btn"
                >
                  ✈ Search New Flights
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationRefund;
