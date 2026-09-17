const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();

const projectFields = [
  "title",
  "description",
  "techStack",
  "repoLink",
  "liveLink",
  "screenshot",
  "order",
];

function normalizeProjectInput(body = {}) {
  const data = {};

  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.description !== undefined)
    data.description = String(body.description);
  if (body.repoLink !== undefined) data.repoLink = String(body.repoLink).trim();
  if (body.liveLink !== undefined) data.liveLink = String(body.liveLink).trim();
  if (body.screenshot !== undefined)
    data.screenshot = String(body.screenshot).trim();
  if (body.order !== undefined) {
    const order = Number(body.order);
    if (!Number.isFinite(order)) throw new Error("Order must be a number.");
    data.order = order;
  }

  if (body.techStack !== undefined) {
    data.techStack = Array.isArray(body.techStack)
      ? body.techStack.map((item) => String(item).trim()).filter(Boolean)
      : String(body.techStack)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  }

  return data;
}

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.userId }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load projects." });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const data = normalizeProjectInput(req.body);

    if (!data.title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const project = await Project.create({
      user: req.userId,
      ...data,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Could not create project.", error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const data = normalizeProjectInput(req.body);

    if (data.title !== undefined && !data.title) {
      return res.status(400).json({ message: "Title cannot be empty." });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      data,
      { new: true, runValidators: true },
    );

    if (!project)
      return res.status(404).json({ message: "Project not found." });
    res.json(project);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Could not update project.", error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!project)
      return res.status(404).json({ message: "Project not found." });
    res.json({ message: "Project deleted.", id: project._id });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Could not delete project.", error: err.message });
  }
});

module.exports = router;
