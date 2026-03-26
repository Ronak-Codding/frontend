import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Plane, Mail, Lock } from "lucide-react";

const Login = () => {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.message || "Invalid credentials" });
        return;
      }
      localStorage.setItem("usertoken", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, role: "user" }),
      );
      window.dispatchEvent(new Event("auth:change"));
      navigate("/");
    } catch {
      setErrors({ general: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060d1a;
          overflow: hidden;
          position: relative;
        }

          .rc-back {
    position: fixed;
    top: 16px; left: 16px;
    z-index: 50;
    display: flex; align-items: center; gap: 7px;
    background:rgba(246, 245, 243, 0.23);
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    padding: 7px 14px;
    border-radius: 100px;
    cursor: pointer;
    backdrop-filter: blur(14px);
    transition: all .22s ease;
  }
   .rc-back:hover { background: rgba(202, 166, 21, 0.77); color: var(--accent); transform: translateX(-2px); }
        .lg-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 0;
        }

        .lg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          z-index: 0;
          pointer-events: none;
        }
        .lg-blob-1 {
          width: 550px; height: 550px;
          background: rgba(212,175,55,0.07);
          top: -150px; left: -150px;
        }
        .lg-blob-2 {
          width: 450px; height: 450px;
          background: rgba(10,22,60,0.5);
          bottom: -100px; right: -100px;
        }

        .lg-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          background: #0c1526;
          border: 1px solid rgba(212,175,55,0.12);
          border-radius: 20px;
          padding: 28px 44px; /* ↓ reduced from 40px 48px */
          box-shadow:
            0 32px 80px rgba(0,0,0,0.6),
            0 0 0 1px rgba(212,175,55,0.05),
            inset 0 1px 0 rgba(212,175,55,0.07);
          animation: lg-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }

        .lg-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          border-radius: 20px 20px 0 0;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent);
        }

        @keyframes lg-rise {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lg-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 16px; /* ↓ reduced from 28px */
          justify-content: center;
        }
        .lg-brand-icon {
          width: 38px; height: 38px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.22);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .lg-brand-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f0e8d0;
          letter-spacing: -0.2px;
        }
        .lg-brand-sub {
          font-size: 0.58rem;
          color: rgba(212,175,55,0.6);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .lg-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 3px 10px; /* ↓ reduced from 4px 12px */
          background: rgba(212,175,55,0.07);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 20px;
          font-size: 0.67rem;
          color: rgba(212,175,55,0.8);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 12px; /* ↓ reduced from 18px */
        }
        .lg-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #d4af37;
          animation: lg-blink 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes lg-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        .lg-title {
          font-family: 'Times New Roman', serif;
          font-size: 1.65rem; /* ↓ slightly reduced */
          font-weight: 800;
          color: #f0e8d0;
          text-align: center;
          letter-spacing: -0.4px;
          margin-bottom: 3px; /* ↓ reduced from 5px */
        }
        .lg-subtitle {
          font-size: 0.83rem;
          color: #e8ecf1;
          text-align: center;
          margin-bottom: 18px; /* ↓ reduced from 26px */
        }

        .lg-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px; /* ↓ reduced from 10px 14px */
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 8px;
          color: #f87171;
          font-size: 0.8rem;
          margin-bottom: 12px; /* ↓ reduced from 16px */
          animation: lg-shake 0.3s ease;
        }
        @keyframes lg-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .lg-field { margin-bottom: 10px; } /* ↓ reduced from 14px */
        .lg-field label {
          display: block;
          font-size: 0.67rem;
          font-weight: 600;
          color: #e8ebf0;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 5px; /* ↓ reduced from 7px */
        }
        .lg-input-wrap { position: relative; }
        .lg-input-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #1e3050;
          display: flex; align-items: center;
          pointer-events: none;
        }
        .lg-input {
          width: 100%;
          padding: 10px 14px 10px 38px; /* ↓ reduced from 12px */
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          color: #e8dfc8;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lg-input::placeholder { color: #1e3050; }
        .lg-input:focus {
          border-color: rgba(212,175,55,0.42);
          background: rgba(212,175,55,0.03);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.07);
        }
        .lg-input.lg-err {
          border-color: rgba(239,68,68,0.35);
          background: rgba(239,68,68,0.04);
        }
        .lg-input-pass { padding-right: 44px; }
        .lg-eye {
          position: absolute;
          right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: #1e3050; cursor: pointer;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .lg-eye:hover { color: #d4af37; }
        .lg-field-err {
          font-size: 0.72rem;
          color: #f87171;
          margin-top: 3px; /* ↓ reduced from 4px */
          padding-left: 2px;
        }

        .lg-forgot {
          text-align: center;
          margin: 10px 0 14px; /* ↓ reduced from 20px */
        }
        .lg-forgot button {
          background: none; border: none;
          color: #d4af37; font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        .lg-forgot button:hover { color: #f0c84a; }

        .lg-submit {
          width: 100%;
          margin-top: 20px;
          padding: 11px; /* ↓ reduced from 12px */
          background: linear-gradient(135deg, #c8a227 0%, #e8c547 50%, #c8a227 100%);
          background-size: 200% 100%;
          border: none;
          border-radius: 10px;
          color: #060d1a;
          font-family: 'Times New Roman', serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-position 0.3s, transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(212,175,55,0.2);
        }
        .lg-submit:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(212,175,55,0.35);
        }
        .lg-submit:active:not(:disabled) { transform: translateY(0); }
        .lg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .lg-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(6,13,26,0.3);
          border-top-color: #060d1a;
          border-radius: 50%;
          animation: lg-spin 0.6s linear infinite;
        }
        @keyframes lg-spin { to { transform: rotate(360deg); } }

        .lg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0 10px; /* ↓ reduced from 20px 0 16px */
        }
        .lg-divider-line {
          flex: 1; height: 1px;
          background: rgba(212,175,55,0.07);
        }
        .lg-divider-text {
          font-size: 0.67rem;
          color: #1e3050;
          white-space: nowrap;
          letter-spacing: 0.5px;
        }

        .lg-footer-note {
          text-align: center;
          font-size: 0.78rem;
          color: #eaeef3;
        }
        .lg-footer-note button {
          background: none; border: none;
          color: #d4af37; font-weight: 600;
          font-size: 0.78rem;
          cursor: pointer;
          transition: color 0.2s;
          margin-left: 4px;
        }
        .lg-footer-note button:hover { color: #f0c84a; }

        @media (max-width: 520px) {
          .lg-card { padding: 24px 20px; margin: 16px; }
        }
      `}</style>

      <div className="lg-root">
        {/* Back Button */}
        <button className="rc-back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <div className="lg-bg-grid" />
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />

        <div className="lg-card">
          <div className="lg-brand">
            <div className="lg-brand-icon">
              <Plane size={18} color="#d4af37" />
            </div>
            <div>
              <div className="lg-brand-name">SkyJet Airlines</div>
              {/* <div className="lg-brand-sub">User Portal</div> */}
            </div>
          </div>

          {/* <div className="lg-badge">
            <span className="lg-badge-dot" /> Secure User Access
          </div> */}

          <h2 className="lg-title">Welcome back</h2>
          <p className="lg-subtitle">Sign in to your account</p>

          {errors.general && (
            <div className="lg-error">
              <span>⚠</span> {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="on">
            <div className="lg-field">
              <label>Email Address</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon">
                  <Mail size={14} />
                </span>
                <input
                  className={`lg-input${errors.email ? " lg-err" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {errors.email && <p className="lg-field-err">{errors.email}</p>}
            </div>

            <div className="lg-field">
              <label>Password</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon">
                  <Lock size={14} />
                </span>
                <input
                  className={`lg-input lg-input-pass${errors.password ? " lg-err" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShowPass((p) => !p)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="lg-field-err">{errors.password}</p>
              )}
            </div>

           

            <button className="lg-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="lg-spinner" /> Signing in...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
             <div className="lg-forgot">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
          </form>

          <div className="lg-divider">
            <div className="lg-divider-line" />
            <span className="lg-divider-text">New to SkyJet?</span>
            <div className="lg-divider-line" />
          </div>

          <div className="lg-footer-note">
            Don't have an account?
            <button onClick={() => navigate("/register")}>
              Register here →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
