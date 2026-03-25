import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

// ─── STEP CONSTANTS ───────────────────────────────────────────────────────────
const STEP_EMAIL = 1;
const STEP_OTP = 2;
const STEP_RESET = 3;
const STEP_SUCCESS = 4;

// ─── OTP INPUT COMPONENT ─────────────────────────────────────────────────────
const OTPInput = ({ value, onChange, disabled }) => {
  const inputsRef = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val && e.nativeEvent.inputType !== "deleteContentBackward") return;
    const newDigits = [...digits];
    newDigits[idx] = val;
    const newOtp = newDigits.join("").slice(0, 6);
    onChange(newOtp);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          style={{
            width: "48px",
            height: "56px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "700",
            border: `2px solid ${digit ? "#2563eb" : "#d1d5db"}`,
            borderRadius: "10px",
            outline: "none",
            background: digit ? "#eff6ff" : "#f9fafb",
            color: "#1e40af",
            transition: "all 0.2s",
            cursor: disabled ? "not-allowed" : "text",
            opacity: disabled ? 0.6 : 1,
          }}
        />
      ))}
    </div>
  );
};

// ─── PASSWORD STRENGTH ───────────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: "6+ characters", ok: password.length >= 6 },
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Special char (!@#$)", ok: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#ef4444", "#f59e0b", "#22c55e"];
  const labels = ["Weak", "Good", "Strong"];
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
        {checks.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background: i < score ? colors[score - 1] : "#e5e7eb",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      {score > 0 && (
        <p style={{ fontSize: "11px", color: colors[score - 1], margin: 0 }}>
          {labels[score - 1]} password
        </p>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const navigate = useNavigate();

  // Shared state
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP step
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Reset step
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return setError("Email is required");
    if (!emailRegex.test(email))
      return setError("Please enter a valid email address");

    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Something went wrong");
      setStep(STEP_OTP);
      setCountdown(60);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError("");
    if (otp.length < 6)
      return setError("Please enter the complete 6-digit OTP");

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid OTP");
      setStep(STEP_RESET);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");
    if (!newPassword) return setError("Password is required");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to reset password");
      setStep(STEP_SUCCESS);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(135deg, #dbeafe 0%, #eff6ff 50%, #e0e7ff 100%)",
      padding: "24px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(37,99,235,0.12)",
      padding: "40px 36px",
      width: "100%",
      maxWidth: "420px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "800",
      color: "#1e40af",
      margin: "0 0 4px",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "17px",
      fontWeight: "600",
      color: "#374151",
      margin: "0 0 8px",
      textAlign: "center",
    },
    desc: {
      fontSize: "13px",
      color: "#6b7280",
      textAlign: "center",
      margin: "0 0 28px",
      lineHeight: "1.5",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    btn: {
      width: "100%",
      padding: "13px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "background 0.2s, transform 0.1s",
    },
    errorBox: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px",
    },
    stepBar: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "28px",
    },
    stepDot: (active, done) => ({
      width: active ? "28px" : "10px",
      height: "10px",
      borderRadius: "5px",
      background: done ? "#22c55e" : active ? "#2563eb" : "#e5e7eb",
      transition: "all 0.3s",
    }),
  };

  const steps = [STEP_EMAIL, STEP_OTP, STEP_RESET];

  return (
    <div style={s.page}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={s.card}
      >
        {/* App name */}
        <p style={s.title}>SkyJet</p>

        {/* Step indicator */}
        {step < STEP_SUCCESS && (
          <div style={s.stepBar}>
            {steps.map((s_num, i) => (
              <div key={i} style={s.stepDot(step === s_num, step > s_num)} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Email ─────────────────────────────────────────────── */}
          {step === STEP_EMAIL && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p style={s.subtitle}>Forgot Password?</p>
              <p style={s.desc}>
                Enter your registered email. We'll send a 6-digit OTP to verify
                it's you.
              </p>

              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={s.label}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={16}
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                      }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="your@email.com"
                      disabled={isLoading}
                      style={{ ...s.input, paddingLeft: "42px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>

                {error && (
                  <div style={s.errorBox}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: "13px", color: "#dc2626" }}>
                      {error}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ ...s.btn, opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} className="spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Send OTP</span>
                    </>
                  )}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ArrowLeft size={14} /> Back to Login
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: OTP ──────────────────────────────────────────────── */}
          {step === STEP_OTP && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    background: "#eff6ff",
                    borderRadius: "50%",
                    padding: "16px",
                    marginBottom: "12px",
                  }}
                >
                  <ShieldCheck size={28} color="#2563eb" />
                </div>
              </div>
              <p style={s.subtitle}>Enter OTP</p>
              <p style={s.desc}>
                We sent a 6-digit OTP to
                <br />
                <strong style={{ color: "#1e40af" }}>{email}</strong>
              </p>

              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: "20px" }}>
                  <OTPInput
                    value={otp}
                    onChange={(v) => {
                      setOtp(v);
                      setError("");
                    }}
                    disabled={isLoading}
                  />
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "11px",
                      color: "#9ca3af",
                      marginTop: "8px",
                    }}
                  >
                    OTP expires in 10 minutes
                  </p>
                </div>

                {error && (
                  <div style={s.errorBox}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: "13px", color: "#dc2626" }}>
                      {error}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  style={{
                    ...s.btn,
                    opacity: isLoading || otp.length < 6 ? 0.6 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Verify OTP</span>
                    </>
                  )}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                {countdown > 0 ? (
                  <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                    Resend OTP in <strong>{countdown}s</strong>
                  </p>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button
                  onClick={() => {
                    setStep(STEP_EMAIL);
                    setOtp("");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ArrowLeft size={14} /> Change Email
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: New Password ──────────────────────────────────────── */}
          {step === STEP_RESET && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    background: "#eff6ff",
                    borderRadius: "50%",
                    padding: "16px",
                    marginBottom: "12px",
                  }}
                >
                  <Lock size={28} color="#2563eb" />
                </div>
              </div>
              <p style={s.subtitle}>Create New Password</p>
              <p style={s.desc}>
                Your identity is verified. Set a new strong password.
              </p>

              <form onSubmit={handleResetPassword}>
                {/* New Password */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={s.label}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter new password"
                      disabled={isLoading}
                      style={{ ...s.input, paddingRight: "42px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                      }}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword && <PasswordStrength password={newPassword} />}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={s.label}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Re-enter new password"
                      disabled={isLoading}
                      style={{
                        ...s.input,
                        paddingRight: "42px",
                        borderColor:
                          confirmPassword && newPassword !== confirmPassword
                            ? "#ef4444"
                            : confirmPassword && newPassword === confirmPassword
                              ? "#22c55e"
                              : "#e5e7eb",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                      onBlur={(e) => {
                        e.target.style.borderColor =
                          confirmPassword && newPassword !== confirmPassword
                            ? "#ef4444"
                            : confirmPassword && newPassword === confirmPassword
                              ? "#22c55e"
                              : "#e5e7eb";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                      }}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#ef4444",
                        marginTop: "4px",
                      }}
                    >
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#22c55e",
                        marginTop: "4px",
                      }}
                    >
                      ✓ Passwords match
                    </p>
                  )}
                </div>

                {error && (
                  <div style={s.errorBox}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: "13px", color: "#dc2626" }}>
                      {error}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ ...s.btn, opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <Loader size={16} />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── STEP 4: Success ───────────────────────────────────────────── */}
          {step === STEP_SUCCESS && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                style={{
                  display: "inline-flex",
                  background: "#dcfce7",
                  borderRadius: "50%",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <CheckCircle size={40} color="#16a34a" />
              </motion.div>
              <p style={{ ...s.subtitle, color: "#15803d" }}>
                Password Reset Successful!
              </p>
              <p style={s.desc}>
                Your password has been updated. Redirecting you to login...
              </p>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "#e5e7eb",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginTop: "20px",
                }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  style={{
                    height: "100%",
                    background: "#22c55e",
                    borderRadius: "2px",
                  }}
                />
              </div>
              <p
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}
              >
                Redirecting in 3 seconds...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
