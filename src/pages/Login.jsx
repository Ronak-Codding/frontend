import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", "user"); //  ADD THIS LINE

      navigate("/user");
    } catch (err) {
      alert("Server error");
    }
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Login failed");
  //       return;
  //     }

  //     // ✅ SAVE TOKEN + USER
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("user", JSON.stringify(data.user));

  //     // 🔀 ROLE BASED REDIRECT
  //     if (data.user.role === "admin") {
  //       navigate("/admin");
  //     } else {
  //       navigate("/user");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Server not responding");
  //   }
  // };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Sign In</h2>

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

export default Login;
