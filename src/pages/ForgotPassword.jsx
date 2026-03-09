import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from "lucide-react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // Handle countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError("");
    setSuccess("");

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccess("Password reset link sent to your email!");
      setCountdown(60);
      
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      handleSubmit(new Event('submit'));
    }
  };

  const getInputFieldClass = () => {
    let className = "input-field";
    if (error) className += " error";
    else if (success) className += " success";
    else className += " default";
    if (isFocused && !error && !success) className += " focused";
    return className;
  };

  return (
    <div className="forgot-password-container">
      {/* Background Pattern */}
      <div className="background-pattern">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="main-card"
      >
        <div className="card-content">
          
          {/* Logo and Header */}
          <div className="header-section">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="logo-wrapper"
            >
              <div className="logo-container">
                <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="app-title"
            >
              MyTrip
            </motion.h1>
            
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="page-subtitle"
            >
              Reset your account password
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="description-text"
            >
              Enter your email address and we'll send you a link to reset your password
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-container">
            {/* Email Input */}
            <div className="input-group">
              <label 
                htmlFor="email" 
                className="input-label"
              >
                Email Address
              </label>
              <div className="input-wrapper">
                <div className={`input-glow ${isFocused ? 'focused' : ''}`}></div>
                <div className="input-field-container">
                  <Mail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="your@email.com"
                    disabled={isLoading || success}
                    className={getInputFieldClass()}
                  />
                </div>
              </div>
              
              {/* Input Hint */}
              <p className="input-hint">
                We'll send a reset link to this email
              </p>
            </div>

            {/* Messages Container */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="message-container error"
                >
                  <div className="message-content">
                    <AlertCircle className="message-icon error" />
                    <p className="message-text error">{error}</p>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="message-container success"
                >
                  <div className="message-content">
                    <CheckCircle className="message-icon success" />
                    <div style={{ flex: 1 }}>
                      <p className="message-text success">{success}</p>
                      <p className="message-subtext success">
                        Redirecting to login in 5 seconds...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`submit-button ${isLoading || success ? 'disabled' : 'enabled'}`}
            >
              {isLoading ? (
                <>
                  <Loader className="spinner-icon" />
                  <span>Sending Reset Link...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="button-icon" />
                  <span>Link Sent!</span>
                </>
              ) : (
                <>
                  <Mail className="button-icon" />
                  <span>Send Reset Link</span>
                </>
              )}
            </motion.button>

            {/* Resend Option */}
            {success && countdown > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="resend-section"
              >
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className="resend-button"
                >
                  Didn't receive email? 
                  <span className="resend-highlight">
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend now'}
                  </span>
                </button>
              </motion.div>
            )}

            {/* Back to Login Link */}
            <div className="back-to-login">
              <motion.button
                type="button"
                onClick={() => navigate("/login")}
                whileHover={{ x: -5 }}
                className="back-button"
              >
                <ArrowLeft className="back-icon" />
                <span>Back to Login</span>
              </motion.button>
            </div>
          </form>

          {/* Help Text */}
          <p className="help-text">
            Having trouble? Contact our support team at{" "}
            <a href="mailto:support@mytrip.com" className="support-link">
              support@mytrip.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;