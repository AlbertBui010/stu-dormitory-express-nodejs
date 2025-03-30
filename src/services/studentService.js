const { Student } = require("../models");

const getAllStudents = async () => {
  return await Student.findAll({
    attributes: { exclude: ["password"] },
  });
};

const getStudentById = async (id) => {
  return await Student.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
};

const createStudent = async (studentData) => {
  const student = await Student.create(studentData);
  const { password, ...studentInfo } = student.toJSON();
  return studentInfo;
};

const updateStudent = async (id, updateData) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error("Student not found");

  await student.update(updateData);
  const { password, ...studentInfo } = student.toJSON();
  return studentInfo;
};

const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error("Student not found");
  await student.destroy();
  return { message: "Student deleted successfully" };
};

const login = async (email, password) => {
  const student = await Student.findOne({ where: { email } });
  if (!student) throw new Error("Invalid credentials");

  const isValidPassword = await student.comparePassword(password);
  if (!isValidPassword) throw new Error("Invalid credentials");

  const { password: pwd, ...studentInfo } = student.toJSON();
  return studentInfo;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  login,
};
