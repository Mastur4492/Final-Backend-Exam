const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// 📝 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Field validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // User exists check
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user with Role Logic
    const role = email === "bikanerwalamastur13@gmail.com" ? "admin" : "user";
    user = new User({ username, email, password, role });
    await user.save();

    // Create token with role
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Required for cross-site cookies
        sameSite: "None", // Required for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ token, role: user.role, userId: user.id, username: user.username });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 🔑 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Field check
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Auto-promote specific admin email
    if (user.email === "bikanerwalamastur13@gmail.com" && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Required for cross-site cookies
        sameSite: "None", // Required for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ token, role: user.role, userId: user.id, username: user.username });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 👤 PROFILE (Protected)
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 🚪 LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  }).json({ message: "Logged out successfully" });
});

module.exports = router;
