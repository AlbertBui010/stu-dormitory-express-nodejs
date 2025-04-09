const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllMaintenanceRequests,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require("../controllers/maintenanceController");

// Protected routes
router.use(verifyToken);

router.get("/", getAllMaintenanceRequests);
router.get("/:id", getMaintenanceById);
router.post("/", createMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

module.exports = router;
