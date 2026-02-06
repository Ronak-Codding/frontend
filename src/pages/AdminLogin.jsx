import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify({
          ...data.user,
          role: "admin",
        }),
      );

      navigate("/admin");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2> Admin Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="forgot-link" onClick={() => navigate("/forgot-password")}>
          Forgot password?
        </p>
        <button type="submit">Login</button>
        <div className="login-footer">
          <p style={{ marginTop: "10px" }}>
            New user?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
