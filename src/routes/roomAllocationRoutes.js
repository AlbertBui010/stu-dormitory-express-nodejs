const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
} = require("../controllers/roomAllocationController");

// Protected routes
router.use(verifyToken, isAdmin);

router.get("/", getAllAllocations);
router.get("/:id", getAllocationById);
router.post("/", createAllocation);
router.put("/:id", updateAllocation);
router.delete("/:id", deleteAllocation);

module.exports = router;
