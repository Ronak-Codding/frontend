import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/formValidator";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm({ email, password });

    if (Object.keys(validationErrors).length === 0) {
      alert("Form Validated! Submitting...");
      console.log("Form Data:", { email, password });
    } else {
      setErrors(validationErrors);
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      localStorage.setItem("usertoken", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          role: "user",
        }),
      );

      navigate("/user");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1d2671] to-[#c33764] animate-fadeIn">
      <form
        className="bg-white p-8 sm:p-10 w-full max-w-[350px] rounded-xl shadow-2xl mx-4"
        autoComplete="on"
        onSubmit={handleLogin}
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Sign In
        </h2>

        <div className="mb-4">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1d2671] focus:ring-2 focus:ring-[#1d2671]/20 outline-none transition-all duration-300 text-base"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1d2671] focus:ring-2 focus:ring-[#1d2671]/20 outline-none transition-all duration-300 text-base"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <p
          className="text-sm text-indigo-600 cursor-pointer text-right hover:underline mb-6"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>

        <button
          type="submit"
          className="w-full py-3 bg-[#1d2671] text-white text-base rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#162060] mb-6"
        >
          Login
        </button>

        <div className="text-center pt-5 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            New user?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
