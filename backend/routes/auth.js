const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email and password are required." });
    }

    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-z0-9-]+$/.test(cleanUsername)) {
      return res.status(400).json({
        message:
          "Username may only contain lowercase letters, numbers and hyphens.",
      });
    }

    const existing = await User.findOne({
      $or: [{ username: cleanUsername }, { email: email.toLowerCase() }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Username or email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: cleanUsername,
      email: email.toLowerCase(),
      password: hashed,
      name: name || cleanUsername,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while registering." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ message: "emailOrUsername and password are required." });
    }

    const query = emailOrUsername.includes("@")
      ? { email: emailOrUsername.toLowerCase() }
      : { username: emailOrUsername.toLowerCase() };

    const user = await User.findOne(query).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while logging in." });
  }
});

module.exports = router;
