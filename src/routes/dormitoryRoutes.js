const express = require("express");
const router = express.Router();
const dormitoryController = require("../controllers/dormitoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.get("/", dormitoryController.getAllDormitories);
router.get("/:id", dormitoryController.getDormitoryById);
// admin routes
router.post("/", isAdmin, dormitoryController.createDormitory);
router.put("/:id", isAdmin, dormitoryController.updateDormitory);
router.delete("/:id", isAdmin, dormitoryController.deleteDormitory);

module.exports = router;
