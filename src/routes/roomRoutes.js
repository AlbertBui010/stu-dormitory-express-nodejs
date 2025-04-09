const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.use(verifyToken);
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.get("/dormitory/:dormitoryId", roomController.getRoomsByDormitory);

// Protected admin routes
router.post("/", isAdmin, roomController.createRoom);
router.put("/:id", isAdmin, roomController.updateRoom);
router.delete("/:id", isAdmin, roomController.deleteRoom);

module.exports = router;
