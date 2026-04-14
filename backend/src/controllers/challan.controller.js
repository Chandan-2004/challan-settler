const pool = require("../config/database");
const sendEmail = require("../utils/sendEmail");
exports.createChallan = async (req, res) => {
  try {
    const { challan_number, vehicle_number } = req.body;

    if (!challan_number || !vehicle_number) {
      return res.status(400).json({ message: "All fields required" });
    }

    const result = await pool.query(
      `INSERT INTO challans 
       (user_id, challan_number, vehicle_number, document_path, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        req.user.id,
        challan_number,
        vehicle_number,
        req.file ? req.file.path : null,
        "SUBMITTED",
      ]
    );

    res.status(201).json({
      message: "Challan uploaded",
      challan: result.rows[0],
    });
  } catch (error) {
    console.error("CreateChallan Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyChallans = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM challans WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GetMyChallans Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllChallans = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as user_name, l.name as lawyer_name
      FROM challans c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users l ON c.lawyer_id = l.id
      ORDER BY c.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("GetAllChallans Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.assignLawyer = async (req, res) => {
  try {
    const { challan_id, lawyer_id } = req.body;

    if (!challan_id || !lawyer_id) {
      return res.status(400).json({
        message: "challan_id and lawyer_id are required",
      });
    }

    // 🔹 Check challan exists
    const challanCheck = await pool.query(
      "SELECT * FROM challans WHERE id = $1",
      [challan_id]
    );

    if (challanCheck.rows.length === 0) {
      return res.status(404).json({ message: "Challan not found" });
    }

    // 🔹 Check lawyer exists
    const lawyerCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [lawyer_id]
    );

    if (lawyerCheck.rows.length === 0) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    const lawyer = lawyerCheck.rows[0];

    // 🔹 Ensure role is LAWYER
    if ((lawyer.role || "").trim().toUpperCase() !== "LAWYER") {
      return res.status(400).json({ message: "Selected user is not a lawyer" });
    }

    // 🔹 Update challan
    const result = await pool.query(
      `UPDATE challans
       SET lawyer_id = $1, status = 'ASSIGNED'
       WHERE id = $2
       RETURNING *`,
      [lawyer_id, challan_id]
    );

    // ✅ SEND EMAIL (safe + non-blocking)
    try {
      sendEmail(
        lawyer.email, // ✅ FIXED
        "New Challan Assigned",
        `<p>You have been assigned a new challan.</p>`
      );
    } catch (err) {
      console.error("Email error:", err);
    }

    // ✅ RESPONSE LAST
    return res.json({
      message: "Lawyer assigned successfully",
      challan: result.rows[0],
    });

  } catch (error) {
    console.error("AssignLawyer Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getAssignedChallans = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM challans WHERE lawyer_id = $1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GetAssigned Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const { challan_id, status, remark } = req.body;

    // 🔹 Update status
    await pool.query(
      `UPDATE challans SET status = $1 WHERE id = $2`,
      [status, challan_id]
    );

    // 🔹 Insert timeline
    await pool.query(
      `INSERT INTO challan_updates 
       (challan_id, status, remark, updated_by)
       VALUES ($1, $2, $3, $4)`,
      [challan_id, status, remark, req.user.id]
    );

    // 🔹 Get user email
    let userEmail = null;

    try {
      const userRes = await pool.query(
        `SELECT email FROM users 
         WHERE id = (SELECT user_id FROM challans WHERE id = $1)`,
        [challan_id]
      );

      userEmail = userRes.rows[0]?.email;
    } catch (err) {
      console.log("User email fetch error:", err.message);
    }

    // 🔥 SAFE EMAIL (never crash API)
    if (userEmail) {
      sendEmail(
        userEmail,
        "Challan Status Updated",
        `<p>Status updated to: ${status}</p>`
      );
    }

    // ✅ ALWAYS respond
    return res.json({ message: "Status updated" });

  } catch (error) {
    console.error("UpdateStatus Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getTimeline = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM challan_updates WHERE challan_id = $1 ORDER BY id DESC",
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Timeline Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
