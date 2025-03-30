const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.get("/dormitory/:dormitoryId", roomController.getRoomsByDormitory);

// Protected admin routes
router.post("/", verifyToken, isAdmin, roomController.createRoom);
router.put("/:id", verifyToken, isAdmin, roomController.updateRoom);
router.delete("/:id", verifyToken, isAdmin, roomController.deleteRoom);

module.exports = router;
