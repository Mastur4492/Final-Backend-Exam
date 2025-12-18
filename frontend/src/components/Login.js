import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://blog-application-backend-zbcq.onrender.com/api/auth/login",
        formData
      );
      // localStorage.setItem("token", res.data.token); // No longer needed with cookies
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("username", res.data.username); // Store username
      onLogin();
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="card login-card">
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
          {error && (
            <p style={{ color: "#dc3545", fontWeight: "500" }}>{error}</p>
          )}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn login-btn">
              Sign In
            </button>
          </form>
          <p className="register-link">
            Don't have an account? <a href="/register">Create one here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
