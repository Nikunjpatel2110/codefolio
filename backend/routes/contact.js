const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

router.post("/:username", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "name, email and message are required." });
    }

    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) return res.status(404).json({ message: "Portfolio not found." });
    if (!user.contactEmail) {
      return res
        .status(400)
        .json({
          message: "This developer has not enabled their contact form yet.",
        });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("[contact] SMTP not configured - message would be:", {
        to: user.contactEmail,
        from: email,
        name,
        message,
      });
      return res.json({
        message: "Message received (SMTP not configured in this environment).",
      });
    }

    await getTransporter().sendMail({
      from: `"CodeFolio Contact Form" <${process.env.SMTP_USER}>`,
      to: user.contactEmail,
      replyTo: email,
      subject: `New message from ${name} via your CodeFolio`,
      text: `${message}\n\n---\nFrom: ${name} <${email}>`,
    });

    res.json({ message: "Message sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not send message right now." });
  }
});

module.exports = router;
