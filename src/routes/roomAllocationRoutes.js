const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getAllocationsByDormitory,
} = require("../controllers/roomAllocationController");

// Protected routes
router.use(verifyToken);

// Routes accessible to any authenticated user
router.get("/student/:studentId", getAllocationById);
router.get("/dormitory/:dormitoryId", getAllocationsByDormitory);

router.use(isAdmin);
router.get("/", getAllAllocations);
router.get("/:id", getAllocationById);
router.post("/", createAllocation);
router.put("/:id", updateAllocation);
router.delete("/:id", deleteAllocation);

module.exports = router;
