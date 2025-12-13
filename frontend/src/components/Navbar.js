import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"; // We'll create this for specific stylish touches

const Navbar = ({ onLogout, userRole }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      onLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1>
          <Link to="/" className="navbar-logo">
            Nova ⚡
          </Link>
        </h1>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          {userRole === "admin" ? (
            <li className="nav-item">
              <span
                style={{
                  color: "#ec4899",
                  fontWeight: "bold",
                  border: "1px solid #ec4899",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  letterSpacing: "0.5px",
                  background: "rgba(236, 72, 153, 0.1)",
                }}
              >
                Admin Panel 🛡️
              </span>
            </li>
          ) : (
            username && (
              <li className="nav-item">
                <span
                  style={{
                    color: "#a855f7",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                  Hi, {username} 👋
                </span>
              </li>
            )
          )}
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsOpen(false)}>
              All Articles
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dashboard"
              className="nav-links"
              onClick={() => setIsOpen(false)}
            >
              My Articles
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/add-blog"
              className="nav-links"
              onClick={() => setIsOpen(false)}
            >
              Write Article
            </Link>
          </li>
          <li className="nav-item">
            <button className="btn nav-links-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
