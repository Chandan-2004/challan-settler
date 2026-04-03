const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.get("/user", verifyToken, allowRoles("USER"), (req, res) => {
  res.json({ message: "Welcome USER", user: req.user });
});

router.get("/lawyer", verifyToken, allowRoles("LAWYER"), (req, res) => {
  res.json({ message: "Welcome LAWYER", user: req.user });
});

module.exports = router;
