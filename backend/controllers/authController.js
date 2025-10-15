const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Ensure you have this model
require("dotenv").config();

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register a new user
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters long" });

    // Always use demo mode for now - no database required
    console.log('Creating demo user for:', email);
    const user = {
      _id: 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      email,
      createdAt: new Date()
    };

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Always use demo mode for now - no database required
    console.log('Demo login for:', email);
    const user = {
      _id: 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      firstName: email.split('@')[0], // Use email prefix as first name
      lastName: 'User',
      email: email,
      createdAt: new Date()
    };

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get user info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Logout user (client should clear token)
const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};

module.exports = {
  signup,
  login,
  getMe,
  logout
};