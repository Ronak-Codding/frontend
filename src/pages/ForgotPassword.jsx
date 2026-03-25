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

const STEP_EMAIL = 1;
const STEP_OTP = 2;
const STEP_RESET = 3;
const STEP_SUCCESS = 4;

/* ─── INLINE CSS ─────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy-deep:   #030b1c;
    --navy:        #071428;
    --navy-mid:    #0d1f3c;
    --navy-light:  #14305a;
    --gold:        #c9a84c;
    --gold-bright: #e8c76a;
    --gold-pale:   rgba(201,168,76,0.12);
    --gold-border: rgba(201,168,76,0.25);
    --gold-glow:   rgba(201,168,76,0.18);
    --cream:       #f5edda;
    --cream-muted: rgba(245,237,218,0.45);
    --error:       #e05555;
    --success:     #3ecf8e;
    --surface:     rgba(7,20,40,0.85);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .fp-root {
    min-height: 100vh;
    background: var(--navy-deep);
    display: flex;
    align-items: center;
    justify-content: center;
   font-family: 'Outfit', sans-serif;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  /* ── Ambient background layers ── */
  .fp-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 10%, rgba(201,168,76,.10) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 88% 90%, rgba(14,32,70,.95)   0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 50% 50%, rgba(10,22,52,.60)   0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Gold noise grain overlay ── */
  .fp-root::after {
    content: '';
    position: fixed; inset: 0;
    background-image:
      radial-gradient(circle, rgba(201,168,76,.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    opacity: .7;
  }

  /* ── Decorative corner lines ── */
  .fp-corner {
    position: fixed;
    width: 120px; height: 120px;
    pointer-events: none;
    z-index: 1;
  }
  .fp-corner-tl { top: 24px; left: 24px; border-top: 1px solid var(--gold-border); border-left: 1px solid var(--gold-border); }
  .fp-corner-br { bottom: 24px; right: 24px; border-bottom: 1px solid var(--gold-border); border-right: 1px solid var(--gold-border); }

  /* ── Card ── */
  .fp-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 440px;
    background: var(--surface);
    border: 1px solid var(--gold-border);
    border-radius: 6px;
    backdrop-filter: blur(28px);
    padding: 48px 44px 44px;
    box-shadow: 
      0 0 0 1px rgba(201,168,76,.06),
      0 40px 100px rgba(0,0,0,.65),
      inset 0 1px 0 rgba(201,168,76,.18);
  }

  /* ── Top gold rule ── */
  .fp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 44px; right: 44px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    border-radius: 1px;
  }

  /* ── Brand ── */
  .fp-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 36px;
  }
  .fp-brand-mark {
    margin-left: 100px;
    width: 36px; height: 36px;
    border: 1px solid var(--gold-border);
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    background: var(--gold-pale);
    color: var(--gold);
    flex-shrink: 0;
  }
  .fp-brand-name {
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 500;
    color: var(--cream);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Step tracker ── */
  .fp-steps {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 32px;
  }
  .fp-step-item {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .fp-step-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 1px solid var(--gold-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600;
    color: var(--cream-muted);
    background: var(--navy-mid);
    flex-shrink: 0;
    transition: all 0.3s ease;
    letter-spacing: 0;
  }
  .fp-step-dot.active {
    border-color: var(--gold);
    background: var(--gold-pale);
    color: var(--gold);
    box-shadow: 0 0 12px var(--gold-glow);
  }
  .fp-step-dot.done {
    border-color: var(--success);
    background: rgba(62,207,142,.12);
    color: var(--success);
  }
  .fp-step-line {
    flex: 1;
    height: 1px;
    background: var(--gold-border);
    margin: 0 6px;
    transition: background 0.3s;
  }
  .fp-step-line.done { background: var(--success); opacity: .5; }

  /* ── Heading ── */
  .fp-heading {
    text-align: center;
    font-family: 'Times New Roman', serif;
    font-size: 32px;
    font-weight: 500;
    color: var(--cream);
    line-height: 1.15;
    letter-spacing: -0.01em;
    margin-bottom: 6px;
  }
  .fp-heading em {
    font-style: italic;
    color: var(--gold);
  }
  .fp-desc {
    font-size: 13px;
    color: var(--cream-muted);
    line-height: 1.65;
    margin-bottom: 28px;
    font-weight: 300;
  }
  .fp-desc strong { color: var(--gold); font-weight: 500; }

  /* ── Label ── */
  .fp-label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: white;
    margin-bottom: 8px;
  }

  /* ── Input ── */
  .fp-input-wrap { position: relative; margin-bottom: 20px; }
  .fp-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--gold);
    opacity: .6;
    pointer-events: none;
  }
  .fp-input {
    width: 100%;
    background: rgba(3,11,28,.55);
    border: 1px solid var(--gold-border);
    border-radius: 4px;
    padding: 13px 16px;
    color: var(--cream);
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .fp-input.has-icon { padding-left: 42px; }
  .fp-input.has-toggle { padding-right: 44px; }
  .fp-input::placeholder { color: rgba(245,237,218,.18); }
  .fp-input:focus {
    border-color: rgba(201,168,76,.55);
    box-shadow: 0 0 0 3px rgba(201,168,76,.10);
  }
  .fp-input.err { border-color: rgba(224,85,85,.5); }
  .fp-input.ok  { border-color: rgba(62,207,142,.4); }
  .fp-input:disabled { opacity: .4; cursor: not-allowed; }

  .fp-toggle-btn {
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: var(--cream-muted);
    cursor: pointer; padding: 2px;
    display: flex; align-items: center;
    transition: color .2s;
  }
  .fp-toggle-btn:hover { color: var(--gold); }

  /* ── OTP Boxes ── */
  .fp-otp-grid {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }
  .fp-otp-cell {
    width: 52px; height: 60px;
    background: rgba(3,11,28,.60);
    border: 1px solid var(--gold-border);
    border-radius: 4px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: var(--gold-bright);
    font-family: 'outfit', serif;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    caret-color: var(--gold);
  }
  .fp-otp-cell:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
    background: rgba(201,168,76,.06);
  }
  .fp-otp-cell.filled {
    border-color: rgba(201,168,76,.5);
    background: rgba(201,168,76,.07);
  }
  .fp-otp-cell:disabled { opacity: .4; cursor: not-allowed; }

  /* ── Password strength ── */
  .fp-strength {
    margin-top: 8px;
    margin-bottom: 4px;
  }
  .fp-strength-bars {
    display: flex; gap: 5px;
    margin-bottom: 4px;
  }
  .fp-strength-bar {
    flex: 1; height: 3px;
    border-radius: 2px;
    background: rgba(245,237,218,.08);
    transition: background .3s;
  }
  .fp-strength-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .04em;
  }

  /* ── Error box ── */
  .fp-error {
    background: rgba(224,85,85,.08);
    border: 1px solid rgba(224,85,85,.25);
    border-radius: 4px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 18px;
    font-size: 13px;
    color: #f09090;
  }

  /* ── Field note ── */
  .fp-note {
    font-size: 11px;
    margin-top: 4px;
    font-weight: 400;
    letter-spacing: .01em;
  }

  /* ── Primary button ── */
  .fp-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%);
    border: none;
    border-radius: 4px;
    color: var(--navy-deep);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    transition: opacity .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(201,168,76,.25);
    position: relative;
    overflow: hidden;
  }
  .fp-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .fp-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(201,168,76,.40);
  }
  .fp-btn:active:not(:disabled) { transform: translateY(0); }
  .fp-btn:disabled { opacity: .35; cursor: not-allowed; }

  /* ── Ghost link buttons ── */
  .fp-link {
    background: none; border: none;
    color: var(--gold);
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    display: inline-flex; align-items: center; gap: 5px;
    padding: 0;
    letter-spacing: .02em;
    transition: opacity .2s;
    text-decoration: none;
  }
  .fp-link:hover { opacity: .75; }
  .fp-link.muted { color: white; }

  /* ── Divider row ── */
  .fp-row-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 18px;
  }

  /* ── Icon circle ── */
  .fp-icon-ring {
    width: 64px; height: 64px;
    border-radius: 50%;
    border: 1px solid var(--gold-border);
    background: var(--gold-pale);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 24px var(--gold-glow);
  }

  /* ── Success screen ── */
  .fp-success-ring {
    width: 72px; height: 72px;
    border-radius: 50%;
    border: 1px solid rgba(62,207,142,.35);
    background: rgba(62,207,142,.10);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 28px rgba(62,207,142,.18);
  }

  .fp-progress-track {
    width: 100%; height: 2px;
    background: rgba(245,237,218,.08);
    border-radius: 1px;
    overflow: hidden;
    margin-top: 24px;
  }
  .fp-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-bright));
    border-radius: 1px;
  }

  /* ── Resend countdown ── */
  .fp-countdown {
    text-align: center;
    margin-top: 16px;
    font-size: 12px;
    color: var(--cream-muted);
  }
  .fp-countdown strong { color: var(--gold); }

  /* ── Spin ── */
  .spin { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 500px) {
    .fp-card { padding: 36px 24px 32px; }
    .fp-heading { font-size: 26px; }
    .fp-otp-cell { width: 42px; height: 52px; font-size: 20px; }
  }
`;

/* ─── OTP INPUT ──────────────────────────────────────────────────────────── */
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
    if (e.key === "Backspace" && !digits[idx] && idx > 0)
      inputsRef.current[idx - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="fp-otp-grid">
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
          className={`fp-otp-cell${digit ? " filled" : ""}`}
        />
      ))}
    </div>
  );
};

/* ─── PASSWORD STRENGTH ──────────────────────────────────────────────────── */
const PasswordStrength = ({ password }) => {
  const checks = [
    { ok: password.length >= 6 },
    { ok: password.length >= 8 },
    { ok: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#e05555", "#d4af37", "#3ecf8e"];
  const labels = ["Weak", "Fair", "Strong"];
  const color = score > 0 ? colors[score - 1] : "transparent";

  return (
    <div className="fp-strength">
      <div className="fp-strength-bars">
        {checks.map((_, i) => (
          <div
            key={i}
            className="fp-strength-bar"
            style={{ background: i < score ? color : undefined }}
          />
        ))}
      </div>
      {score > 0 && (
        <span className="fp-strength-label" style={{ color }}>
          {labels[score - 1]} password
        </span>
      )}
    </div>
  );
};

/* ─── STEP TRACKER ───────────────────────────────────────────────────────── */
const StepTracker = ({ step }) => {
  const steps = [STEP_EMAIL, STEP_OTP, STEP_RESET];
  const labels = ["1", "2", "3"];
  return (
    <div className="fp-steps">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="fp-step-item">
            <div
              className={`fp-step-dot${step === s ? " active" : ""}${step > s ? " done" : ""}`}
            >
              {step > s ? "✓" : labels[i]}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`fp-step-line${step > s ? " done" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

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

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
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

  const slideVariants = {
    enter: { opacity: 0, x: 28, filter: "blur(4px)" },
    center: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      x: -28,
      filter: "blur(4px)",
      transition: { duration: 0.22 },
    },
  };

  return (
    <>
      <style>{css}</style>
      <div className="fp-root">
        <div className="fp-corner fp-corner-tl" />
        <div className="fp-corner fp-corner-br" />

        <motion.div
          className="fp-card"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Brand */}
          <div className="fp-brand">
            <div className="fp-brand-mark">✈</div>
            <span className="fp-brand-name">Skyjet</span>
          </div>

          {/* Step tracker */}
          {step < STEP_SUCCESS && <StepTracker step={step} />}

          <AnimatePresence mode="wait">
            {/* ── Step 1: Email ── */}
            {step === STEP_EMAIL && (
              <motion.div
                key="email"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h1 className="fp-heading">
                  Forgot your <em>password?</em>
                </h1>
                <p className="fp-desc">
                  Enter your registered email address and we'll send you a
                  verification code.
                </p>

                <form onSubmit={handleSendOtp}>
                  <label className="fp-label">Email Address</label>
                  <div className="fp-input-wrap">
                    <Mail size={15} className="fp-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="your@email.com"
                      disabled={isLoading}
                      className="fp-input has-icon"
                    />
                  </div>

                  {error && (
                    <div className="fp-error">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="fp-btn">
                    {isLoading ? (
                      <>
                        <Loader size={15} className="spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Mail size={15} /> Send Verification Code
                      </>
                    )}
                  </button>
                </form>

                <div
                  className="fp-row-btns"
                  style={{ justifyContent: "center", marginTop: 20 }}
                >
                  <button
                    onClick={() => navigate("/login")}
                    className="fp-link muted"
                  >
                    <ArrowLeft size={13} /> Back to Login
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === STEP_OTP && (
              <motion.div
                key="otp"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="fp-icon-ring">
                  <ShieldCheck size={26} color="var(--gold)" />
                </div>
                <h1 className="fp-heading" style={{ textAlign: "center" }}>
                  <em>Verify</em> your
                  <br />
                  identity
                </h1>
                <p className="fp-desc">
                  A 6-digit code was sent to
                  <br />
                  <strong>{email}</strong>
                </p>

                <form onSubmit={handleVerifyOtp}>
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
                      color: "var(--cream-muted)",
                      marginBottom: 18,
                    }}
                  >
                    Code expires in 10 minutes
                  </p>

                  {error && (
                    <div className="fp-error">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="fp-btn"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={15} className="spin" /> Verifying…
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} /> Verify Code
                      </>
                    )}
                  </button>
                </form>

                <div className="fp-countdown">
                  {countdown > 0 ? (
                    <>
                      Resend code in <strong>{countdown}s</strong>
                    </>
                  ) : (
                    <button onClick={handleSendOtp} className="fp-link">
                      Resend Code
                    </button>
                  )}
                </div>

                <div
                  className="fp-row-btns"
                  style={{ justifyContent: "center", marginTop: 12 }}
                >
                  <button
                    onClick={() => {
                      setStep(STEP_EMAIL);
                      setOtp("");
                      setError("");
                    }}
                    className="fp-link muted"
                  >
                    <ArrowLeft size={13} /> Change Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Reset Password ── */}
            {step === STEP_RESET && (
              <motion.div
                key="reset"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="fp-icon-ring">
                  <Lock size={24} color="var(--gold)" />
                </div>
                <h1 className="fp-heading" style={{ textAlign: "center" }}>
                  Set new
                  <br />
                  <em>password</em>
                </h1>
                <p className="fp-desc">
                  Identity confirmed. Choose a strong new password for your
                  account.
                </p>

                <form onSubmit={handleResetPassword}>
                  {/* New password */}
                  <label className="fp-label">New Password</label>
                  <div className="fp-input-wrap" style={{ marginBottom: 6 }}>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Create a strong password"
                      disabled={isLoading}
                      className="fp-input has-toggle"
                    />
                    <button
                      type="button"
                      className="fp-toggle-btn"
                      onClick={() => setShowNew((v) => !v)}
                    >
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {newPassword && <PasswordStrength password={newPassword} />}
                  <div style={{ marginBottom: 16 }} />

                  {/* Confirm password */}
                  <label className="fp-label">Confirm Password</label>
                  <div className="fp-input-wrap" style={{ marginBottom: 4 }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Re-enter your password"
                      disabled={isLoading}
                      className={`fp-input has-toggle${
                        confirmPassword
                          ? newPassword !== confirmPassword
                            ? " err"
                            : " ok"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="fp-toggle-btn"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p
                      className="fp-note"
                      style={{ color: "var(--error)", marginBottom: 14 }}
                    >
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p
                      className="fp-note"
                      style={{ color: "var(--success)", marginBottom: 14 }}
                    >
                      ✓ Passwords match
                    </p>
                  )}
                  {!confirmPassword && <div style={{ marginBottom: 18 }} />}

                  {error && (
                    <div className="fp-error">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="fp-btn">
                    {isLoading ? (
                      <>
                        <Loader size={15} className="spin" /> Updating…
                      </>
                    ) : (
                      <>
                        <Lock size={15} /> Reset Password
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 4: Success ── */}
            {step === STEP_SUCCESS && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: "center" }}
              >
                <motion.div
                  className="fp-success-ring"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, delay: 0.18 }}
                >
                  <CheckCircle size={34} color="var(--success)" />
                </motion.div>

                <h1
                  className="fp-heading"
                  style={{ textAlign: "center", marginBottom: 8 }}
                >
                  Password
                  <br />
                  <em>reset!</em>
                </h1>
                <p className="fp-desc">
                  Your password has been updated successfully.
                  <br />
                  Redirecting you to login…
                </p>

                <div className="fp-progress-track">
                  <motion.div
                    className="fp-progress-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--cream-muted)",
                    marginTop: 8,
                  }}
                >
                  Redirecting in 3 seconds…
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
