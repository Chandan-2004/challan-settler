const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/all-users", verifyToken, allowRoles("ADMIN"), authController.getAllUsers);
router.delete(
  "/delete/:id",
  verifyToken,
  allowRoles("ADMIN"),
  authController.deleteUser
);
module.exports = router;