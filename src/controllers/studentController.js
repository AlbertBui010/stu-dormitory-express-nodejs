const studentService = require("../services/studentService");
const authService = require("../services/authService");
const { studentRegisterValidate } = require("../utils/validation");

const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { error } = studentRegisterValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }
    const studentId = await authService.register(req.body);
    res.status(201).json({ id: studentId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_by: req.user.id,
    };
    const student = await studentService.updateStudent(
      req.params.id,
      updateData
    );
    res.json(student);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await studentService.login(email, password);
    res.json(student);
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getStudentsByDormitory = async (req, res) => {
  try {
    const dormitoryId = req.params.dormitoryId;
    const students = await studentService.getStudentsByDormitory(dormitoryId);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentsByRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const students = await studentService.getStudentsByRoom(roomId);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByDormitory,
  getStudentsByRoom,
};
