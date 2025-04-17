const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByStudent,
  getPaymentByRoomAllocation,
} = require("../controllers/paymentController");

// Protected routes
router.use(verifyToken);

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.get("/student/:studentId", getPaymentsByStudent);
router.get("/room-allocation/:roomAllocationId", getPaymentByRoomAllocation);

module.exports = router;
