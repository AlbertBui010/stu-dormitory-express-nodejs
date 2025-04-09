const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  login,
  getStudentsByDormitory,
  getStudentsByRoom,
} = require("../controllers/studentController");

// Public routes
router.post("/login", login);

// Protected routes
router.use(verifyToken);

router.get("/dormitory/:dormitoryId", getStudentsByDormitory);
router.get("/room/:roomId", getStudentsByRoom);

router.use(isAdmin);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
