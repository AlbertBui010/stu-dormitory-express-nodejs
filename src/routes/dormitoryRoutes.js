const express = require("express");
const router = express.Router();
const dormitoryController = require("../controllers/dormitoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", verifyToken, dormitoryController.getAllDormitories);
router.get("/:id", dormitoryController.getDormitoryById);

// Protected admin routes
router.post("/", verifyToken, isAdmin, dormitoryController.createDormitory);
router.put("/:id", verifyToken, isAdmin, dormitoryController.updateDormitory);
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  dormitoryController.deleteDormitory
);

module.exports = router;
