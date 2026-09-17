const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load profile." });
  }
});

router.put("/me", auth, async (req, res) => {
  const allowed = [
    "name",
    "bio",
    "resumeUrl",
    "avatarUrl",
    "socialLinks",
    "skills",
    "templateId",
    "contactEmail",
    "customDomain",
  ];

  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Could not update profile.", error: err.message });
  }
});

module.exports = router;
