import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddBlog from "./components/AddBlog";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";
import "./App.css";

import axios from "axios";

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

function App() {
  // Initialize state based on if we think we have a session.
  // With httpOnly cookies, we can't check document.cookie.
  // A robust app would hit an endpoint like /api/auth/me on load.
  // For simplicity here, we'll start false and Login will flip it.
  // OR if we want to persist across reloads without an API call delay,
  // we can use localStorage just as a flag "isLoggedIn" (not the token itself).
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    // Check session on load
    const checkSession = async () => {
      try {
        const res = await axios.get("https://blog-application-backend-zbcq.onrender.com/api/auth/profile", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUserRole(res.data.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("userId", res.data._id);
      } catch (err) {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
      }
    };
    checkSession();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isLoggedIn", "true");
    setUserRole(localStorage.getItem("userRole"));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setUserRole(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar onLogout={handleLogout} userRole={userRole} />}
        <div
          style={{
            paddingTop: isAuthenticated ? "80px" : "0",
            minHeight: "100vh",
          }}
        >
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <BlogList isAuthenticated={isAuthenticated} />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <Register onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/add-blog"
                element={
                  isAuthenticated ? <AddBlog /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/blog/:id"
                element={
                  isAuthenticated ? <BlogDetail /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
