const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || "USER"]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin
    const userCheck = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userCheck.rows[0].role === "ADMIN") {
      return res.status(400).json({ message: "Cannot delete admin" });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};