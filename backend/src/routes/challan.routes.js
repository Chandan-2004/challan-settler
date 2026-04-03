const express = require("express");
console.log("✅ challan.routes.js LOADED");
const router = express.Router();
const multer = require("multer");

const challanController = require("../controllers/challan.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// USER
router.post(
  "/",
  verifyToken,
  allowRoles("USER"),
  upload.single("document"),
  challanController.createChallan
);

router.get(
  "/my",
  verifyToken,
  allowRoles("USER"),
  challanController.getMyChallans
);

// ADMIN
router.get(
  "/all",
  verifyToken,
  allowRoles("ADMIN"),
  challanController.getAllChallans
);

router.post(
  "/assign",
  verifyToken,
  allowRoles("ADMIN"),
  (req, res, next) => {
    console.log("✅ /assign route HIT");
    next();
  },
  challanController.assignLawyer
);
// LAWYER
router.get(
  "/assigned",
  verifyToken,
  allowRoles("LAWYER"),
  challanController.getAssignedChallans
);

router.put(
  "/status",
  verifyToken,
  allowRoles("LAWYER"),
  challanController.updateStatus
);

// TIMELINE
router.get(
  "/timeline/:id",
  verifyToken,
  challanController.getTimeline
);

module.exports = router;