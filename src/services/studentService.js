const {
  Student,
  Room,
  RoomAllocation,
  Dormitory,
  sequelize,
} = require("../models");

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

const getStudentsByDormitory = async (dormitoryId) => {
  // First validate that the dormitory exists
  const dormitory = await Dormitory.findByPk(dormitoryId);
  if (!dormitory) {
    throw new Error("Dormitory not found");
  }

  // Get students in the dormitory through rooms and allocations
  return await Student.findAll({
    attributes: { exclude: ["password"] },
    include: [
      {
        model: RoomAllocation,
        where: { status: "Active" },
        required: true,
        include: [
          {
            model: Room,
            where: { dormitory_id: dormitoryId },
            required: true,
            attributes: ["id", "room_number"],
          },
        ],
      },
    ],
  });
};

const getStudentsByRoom = async (roomId) => {
  // First validate that the room exists
  const room = await Room.findByPk(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  // Get students in the specific room
  return await Student.findAll({
    attributes: { exclude: ["password"] },
    include: [
      {
        model: RoomAllocation,
        where: {
          room_id: roomId,
          status: "Active",
        },
        required: true,
      },
    ],
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  login,
  getStudentsByDormitory,
  getStudentsByRoom,
};
