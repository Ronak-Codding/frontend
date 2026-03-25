import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ─── ALL STYLES INLINED – no Register.css needed ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg:        #040d21;
    --surface:   rgba(8,18,48,0.75);
    --border:    rgba(212,175,55,0.2);
    --accent:    #d4af37;
    --accent2:   #f0c040;
    --text:      #f5eedc;
    --muted:     rgba(245,238,220,0.42);
    --error:     #ff6b6b;
    --success:   #3dd68c;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rc-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 16px 40px;
    position: relative;
    overflow-x: hidden;
  }

  .rc-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 10% 0%,   rgba(10,25,70,.90) 0%, transparent 60%),
      radial-gradient(ellipse 55% 60% at 90% 100%,  rgba(8,20,60,.85)  0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%,   rgba(212,175,55,.07) 0%, transparent 70%);
    pointer-events: none;
    animation: meshShift 14s ease-in-out infinite alternate;
  }
  @keyframes meshShift {
    from { opacity: .8; transform: scale(1); }
    to   { opacity: 1;  transform: scale(1.05); }
  }

  .rc-page::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(212,175,55,.04) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  .rc-back {
    position: fixed;
    top: 16px; left: 16px;
    z-index: 50;
    display: flex; align-items: center; gap: 7px;
    background: rgba(13,30,58,0.70);
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
  .rc-back:hover { background: rgba(212,175,55,.12); color: var(--accent); transform: translateX(-2px); }

  .rc-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 700px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    backdrop-filter: blur(24px);
    padding: 32px 40px 30px;
    animation: cardIn .55s cubic-bezier(.16,1,.3,1) both;
    box-shadow:
      0 32px 80px rgba(0,0,0,.60),
      inset 0 1px 0 rgba(212,175,55,.15),
      inset 0 -1px 0 rgba(212,175,55,.06);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }

  .rc-logo-row {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .rc-logo-gem {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; box-shadow: 0 4px 16px rgba(212,175,55,.40);
  }
  .rc-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 19px; font-weight: 500;
    color: var(--text); letter-spacing: .01em;
  }

  .rc-headline {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 400;
    color: var(--text); line-height: 1.15;
    letter-spacing: -.02em;
    margin-bottom: 4px;
  }
  .rc-headline em {
    font-style: normal;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .rc-sub {
    font-size: 13px; color: var(--muted);
    font-weight: 300; letter-spacing: .02em;
    margin-bottom: 20px;
  }

  .rc-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,.30), transparent);
    margin-bottom: 18px;
  }

  .rc-section-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 600;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--accent);
    background: rgba(212,175,55,.08);
    border: 1px solid rgba(212,175,55,.22);
    border-radius: 100px;
    padding: 3px 11px;
    margin-bottom: 12px;
    margin-top: 16px;
  }

  .rc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .rc-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }

  .rc-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: .09em; text-transform: uppercase;
    color: white;
    display: flex; align-items: center; gap: 5px;
  }

  .rc-input {
    width: 100%;
    background: rgba(5,12,30,.55);
    border: 1px solid rgba(212,175,55,.18);
    border-radius: 10px;
    padding: 10px 13px;
    color: var(--text);
    font-size: 13.5px;
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
  }
  .rc-input::placeholder { color: rgba(245,238,220,.18); }
  .rc-input:focus {
    border-color: rgba(212,175,55,.60);
    background: rgba(5,12,30,.75);
    box-shadow: 0 0 0 3px rgba(212,175,55,.12);
  }
  .rc-input.has-error  { border-color: rgba(255,107,107,.5); background: rgba(255,107,107,.04); }
  .rc-input.is-verified { border-color: rgba(61,214,140,.45); background: rgba(61,214,140,.04); padding-right: 110px; }
  .rc-input:disabled   { opacity: .45; cursor: not-allowed; }

  .rc-otp-row { display: flex; gap: 8px; }
  .rc-otp-row .rc-input { flex: 1; min-width: 0; }

  .rc-send-btn {
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; border-radius: 10px;
    color: #0a1628; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600;
    padding: 0 18px; cursor: pointer;
    white-space: nowrap;
    transition: opacity .18s, transform .18s, box-shadow .18s;
    box-shadow: 0 3px 12px rgba(212,175,55,.32);
  }
  .rc-send-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(212,175,55,.45);
  }
  .rc-send-btn:disabled { opacity: .38; cursor: not-allowed; }

  .rc-verified-pill {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 500; color: var(--success);
    pointer-events: none;
  }

  .rc-input-wrap { position: relative; flex: 1; }

  .rc-otp-box {
    background: rgba(212,175,55,.05);
    border: 1px solid rgba(212,175,55,.18);
    border-radius: 12px;
    padding: 12px 14px 10px;
    margin-bottom: 10px;
    animation: fadeSlide .25s ease both;
  }
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rc-otp-hint { font-size: 12px; color: var(--muted); margin-bottom: 8px; }

  .rc-verify-btn {
    flex-shrink: 0;
    background: rgba(212,175,55,.10);
    border: 1px solid rgba(212,175,55,.30);
    border-radius: 9px; color: var(--accent);
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    padding: 10px 16px; cursor: pointer;
    transition: background .18s, border-color .18s;
    white-space: nowrap;
  }
  .rc-verify-btn:hover:not(:disabled) {
    background: rgba(212,175,55,.20); border-color: rgba(212,175,55,.55);
  }
  .rc-verify-btn:disabled { opacity: .38; cursor: not-allowed; }

  .rc-otp-meta { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
  .rc-timer  { font-size: 12px; color: var(--muted); }
  .rc-resend { background: none; border: none; color: var(--accent); font-size: 12px;
               font-family: 'Outfit', sans-serif; cursor: pointer; text-decoration: underline; padding: 0; }

  .rc-pw-bars { display: flex; gap: 4px; margin-top: 5px; }
  .rc-pw-bar  { flex: 1; height: 3px; border-radius: 3px; background: rgba(212,175,55,.10); transition: background .25s; }
  .rc-pw-bar.w { background: #ff6b6b; }
  .rc-pw-bar.m { background: #fbbf24; }
  .rc-pw-bar.s { background: var(--success); }

  .rc-hint  { font-size: 11px; color: rgba(245,238,220,.22); margin-top: 2px; }
  .rc-error { font-size: 12px; color: var(--error); display: flex; align-items: center; gap: 4px; margin-top: 2px; }

  .rc-terms-row { display: flex; align-items: flex-start; gap: 10px; margin: 14px 0 4px; }
  .rc-checkbox {
    appearance: none; width: 17px; height: 17px; min-width: 17px;
    background: rgba(5,12,30,.55);
    border: 1px solid rgba(212,175,55,.28);
    border-radius: 5px; cursor: pointer; margin-top: 1px;
    position: relative; transition: all .18s;
  }
  .rc-checkbox:checked {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-color: transparent;
  }
  .rc-checkbox:checked::after {
    content: '✓';
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    color: #0a1628; font-size: 10px; font-weight: 800;
  }
  .rc-terms-text { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .rc-terms-text a { color: var(--accent); text-decoration: none; }
  .rc-terms-text a:hover { text-decoration: underline; }

  .rc-api-err {
    background: rgba(255,107,107,.08);
    border: 1px solid rgba(255,107,107,.22);
    border-radius: 10px;
    padding: 10px 13px;
    color: var(--error); font-size: 13px;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }

  .rc-submit {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    border: none; border-radius: 12px;
    color: #0a1628; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: .04em; cursor: pointer;
    margin-top: 6px;
    position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(212,175,55,.32);
  }
  .rc-submit::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.20), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .rc-submit:hover:not(:disabled)::after { opacity: 1; }
  .rc-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(212,175,55,.48);
  }
  .rc-submit:active:not(:disabled) { transform: translateY(0); }
  .rc-submit:disabled { opacity: .38; cursor: not-allowed; }

  .rc-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 16px 0 12px; color: var(--muted); font-size: 13px;
  }
  .rc-divider::before, .rc-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  .rc-signin-btn {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--border);
    border-radius: 12px; color: var(--muted);
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
    padding: 11px; cursor: pointer;
    transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .rc-signin-btn:hover:not(:disabled) { background: rgba(255,255,255,.08); color: var(--text); }
  .rc-signin-btn:disabled { opacity: .38; cursor: not-allowed; }

  .rc-success {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 20px; text-align: center;
    animation: cardIn .5s ease both;
  }
  .rc-success-ring {
    width: 72px; height: 72px; border-radius: 50%;
    border: 2px solid var(--success);
    background: rgba(61,214,140,.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; margin-bottom: 20px;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0   rgba(61,214,140,.35); }
    50%      { box-shadow: 0 0 0 16px rgba(61,214,140,0);  }
  }
  .rc-success h2 {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 400;
    color: var(--text); margin-bottom: 8px;
  }
  .rc-success p { color: var(--muted); font-size: 14px; line-height: 1.6; }

  .spin { display: inline-block; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .rc-card  { padding: 24px 18px 22px; border-radius: 16px; }
    .rc-row   { grid-template-columns: 1fr; }
    .rc-headline { font-size: 24px; }
  }
`;

const pwStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [otpState, setOtpState] = useState({
    showOtpInput: false,
    otp: "",
    generatedOtp: "",
    isVerified: false,
    timer: 0,
    canResend: true,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpState.timer > 0) {
      interval = setInterval(() => {
        setOtpState((prev) => ({
          ...prev,
          timer: prev.timer - 1,
          canResend: false,
        }));
      }, 2000);
    } else {
      setOtpState((prev) => ({ ...prev, canResend: true }));
    }
    return () => clearInterval(interval);
  }, [otpState.timer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpState((prev) => ({ ...prev, otp: value }));
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Valid email required" }));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpState((prev) => ({
        ...prev,
        showOtpInput: true,
        timer: 60,
        canResend: false,
      }));
      alert(`OTP sent to ${formData.email}! Check your inbox.`);
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpState.otp) {
      setErrors((prev) => ({ ...prev, otp: "Please enter OTP" }));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpState.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setOtpState((prev) => ({ ...prev, isVerified: true }));
      setErrors((prev) => ({ ...prev, otp: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase and number";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }
    if (!otpState.isVerified) {
      newErrors.otp = "Please verify your mobile number first";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors({ apiError: data.message });
        setIsLoading(false);
        return;
      }
      await fetch("http://localhost:5000/api/otp/send-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      setRegistrationSuccess(true);
      setIsLoading(false);
      if (onRegister) onRegister(data.user);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrors({ apiError: "Server not responding" });
      setIsLoading(false);
    }
  };

  const strength = pwStrength(formData.password);
  const barClass = (i) => {
    if (!formData.password) return "";
    if (strength <= 1) return i < 1 ? "w" : "";
    if (strength <= 2) return i < 2 ? "m" : "";
    return i < 4 ? "s" : "";
  };

  return (
    <>
      <style>{css}</style>
      <div className="rc-page">
        {/* Back Button */}
        <button className="rc-back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <div className="rc-card">
          {registrationSuccess ? (
            <div className="rc-success">
              <div className="rc-success-ring">✓</div>
              <h2>Registration Successful!</h2>
              <p>
                Your account has been created successfully.
                <br />
                Redirecting to login…
              </p>
            </div>
          ) : (
            <>
              {/* <div className="rc-logo-row">
                <div className="rc-logo-gem">✈</div>
                <span className="rc-logo-text">Skyjet Airlines</span>
              </div> */}

              <h1 className="rc-headline">
                Create your <em>account</em>
              </h1>
              {/* <p className="rc-sub">Join thousands of travelers worldwide</p>
              <div className="rc-rule" /> */}

              <form onSubmit={handleSubmit}>
                <div className="rc-section-tag">Personal Information</div>

                <div className="rc-row">
                  <div className="rc-field">
                    <label className="rc-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`rc-input${errors.firstName ? " has-error" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <span className="rc-error">⚠ {errors.firstName}</span>
                    )}
                  </div>
                  <div className="rc-field">
                    <label className="rc-label">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Enter your middle name"
                      className={`rc-input${errors.middleName ? " has-error" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.middleName && (
                      <span className="rc-error">⚠ {errors.middleName}</span>
                    )}
                  </div>
                </div>

                <div className="rc-row">
                  <div className="rc-field">
                    <label className="rc-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={`rc-input${errors.lastName ? " has-error" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <span className="rc-error">⚠ {errors.lastName}</span>
                    )}
                  </div>
                  <div className="rc-field">
                    <label className="rc-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className={`rc-input${errors.username ? " has-error" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <span className="rc-error">⚠ {errors.username}</span>
                    )}
                  </div>
                </div>

                <div className="rc-section-tag">Contact &amp; Verification</div>

                <div className="rc-field">
                  <label className="rc-label">Email Address</label>
                  <div className="rc-otp-row">
                    <div className="rc-input-wrap">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`rc-input${errors.email ? " has-error" : ""}${otpState.isVerified ? " is-verified" : ""}`}
                        disabled={isLoading || otpState.isVerified}
                      />
                      {otpState.isVerified && (
                        <span className="rc-verified-pill">✓ Verified</span>
                      )}
                    </div>
                    {!otpState.isVerified ? (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={
                          isLoading || !formData.email || otpState.timer > 0
                        }
                        className="rc-send-btn"
                      >
                        {isLoading ? (
                          <span className="spin">⟳</span>
                        ) : otpState.timer > 0 ? (
                          `${otpState.timer}s`
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    ) : null}
                  </div>
                  {errors.email && (
                    <span className="rc-error">⚠ {errors.email}</span>
                  )}
                </div>

                {otpState.showOtpInput && !otpState.isVerified && (
                  <div className="rc-otp-box">
                    <p className="rc-otp-hint">
                      Enter the 6-digit OTP sent to {formData.email}
                    </p>
                    <div className="rc-otp-row">
                      <input
                        type="text"
                        value={otpState.otp}
                        onChange={handleOtpChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className={`rc-input${errors.otp ? " has-error" : ""}`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otpState.otp.length !== 6 || isLoading}
                        className="rc-verify-btn"
                      >
                        {isLoading ? <span className="spin">⟳</span> : "Verify"}
                      </button>
                    </div>
                    <div className="rc-otp-meta">
                      {otpState.timer > 0 && (
                        <p className="rc-timer">
                          Resend OTP in {otpState.timer} seconds
                        </p>
                      )}
                      {otpState.canResend && !otpState.isVerified && (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          className="rc-resend"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    {errors.otp && (
                      <span className="rc-error" style={{ marginTop: 8 }}>
                        ⚠ {errors.otp}
                      </span>
                    )}
                  </div>
                )}

                <div className="rc-field">
                  <label className="rc-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number"
                    className={`rc-input${errors.phone ? " has-error" : ""}`}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <span className="rc-error">⚠ {errors.phone}</span>
                  )}
                </div>

                <div className="rc-section-tag">Security</div>

                <div className="rc-row">
                  <div className="rc-field">
                    <label className="rc-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className={`rc-input${errors.password ? " has-error" : ""}`}
                      disabled={isLoading}
                    />
                    {formData.password && (
                      <div className="rc-pw-bars">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`rc-pw-bar ${barClass(i)}`} />
                        ))}
                      </div>
                    )}
                    {errors.password ? (
                      <span className="rc-error">⚠ {errors.password}</span>
                    ) : (
                      <span className="rc-hint">
                        Min 8 chars with uppercase, lowercase &amp; number
                      </span>
                    )}
                  </div>
                  <div className="rc-field">
                    <label className="rc-label">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`rc-input${errors.confirmPassword ? " has-error" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <span className="rc-error">
                        ⚠ {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rc-terms-row">
                  <input
                    type="checkbox"
                    className="rc-checkbox"
                    id="rc-terms"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="rc-terms" className="rc-terms-text">
                    I agree to the{" "}
                    <Link to="/terms">Terms &amp; Conditions</Link> and{" "}
                    <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <span
                    className="rc-error"
                    style={{ marginBottom: 8, display: "flex" }}
                  >
                    ⚠ {errors.termsAccepted}
                  </span>
                )}

                {errors.apiError && (
                  <div className="rc-api-err">⚠ {errors.apiError}</div>
                )}

                <button
                  type="submit"
                  className="rc-submit"
                  disabled={isLoading || !otpState.isVerified}
                >
                  {isLoading ? (
                    <>
                      <span className="spin">⟳</span> Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="rc-divider">
                  <span>Already have an account?</span>
                </div>

                <button
                  type="button"
                  className="rc-signin-btn"
                  onClick={() => navigate("/login")}
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
