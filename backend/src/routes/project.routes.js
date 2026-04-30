const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Create project
router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      "INSERT INTO projects (name, created_by) VALUES ($1, $2) RETURNING *",
      [name, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all projects
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;