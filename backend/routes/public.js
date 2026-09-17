const express = require("express");
const User = require("../models/User");
const Project = require("../models/Project");

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ message: `No portfolio found for "${username}".` });
    }

    const projects = await Project.find({ user: user._id }).sort({
      order: 1,
      createdAt: 1,
    });

    const profile = user.toPublicJSON();
    profile.contactEnabled = Boolean(user.contactEmail);

    res.json({
      profile,
      projects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while loading portfolio." });
  }
});

module.exports = router;
