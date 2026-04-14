const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    sendEmail(
      process.env.ADMIN_EMAIL,
      "Customer Support Request",
      `
        <h3>New Support Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    );

    return res.json({ message: "Message sent to admin" });
  } catch (err) {
    console.error("Support Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;