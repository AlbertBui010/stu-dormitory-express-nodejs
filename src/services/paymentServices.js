const { Payment, Student, Room } = require("../models");
const createHttpError = require("http-errors");

const getAllPayments = async () => {
  return await Payment.findAll({
    include: [
      {
        model: Student,
        attributes: ["id", "name", "email"],
      },
      {
        model: Room,
        attributes: ["id", "room_number"],
      },
    ],
  });
};

const getPaymentById = async (id) => {
  const payment = await Payment.findByPk(id, {
    include: [
      {
        model: Student,
        attributes: ["id", "name", "email"],
      },
      {
        model: Room,
        attributes: ["id", "room_number"],
      },
    ],
  });

  if (!payment) {
    throw createHttpError.NotFound("Payment not found");
  }

  return payment;
};

const createPayment = async (paymentData) => {
  const { student_id, room_id } = paymentData;

  // Verify student and room exist
  const student = await Student.findByPk(student_id);
  if (!student) {
    throw createHttpError.NotFound("Student not found");
  }

  const room = await Room.findByPk(room_id);
  if (!room) {
    throw createHttpError.NotFound("Room not found");
  }

  return await Payment.create(paymentData);
};

const updatePayment = async (id, updateData) => {
  const payment = await Payment.findByPk(id);
  if (!payment) {
    throw createHttpError.NotFound("Payment not found");
  }

  return await payment.update(updateData);
};

const deletePayment = async (id) => {
  const payment = await Payment.findByPk(id);
  if (!payment) {
    throw createHttpError.NotFound("Payment not found");
  }

  await payment.destroy();
  return { message: "Payment deleted successfully" };
};

const getPaymentsByStudent = async (studentId) => {
  return await Payment.findAll({
    where: { student_id: studentId },
    include: [
      {
        model: Room,
        attributes: ["id", "room_number"],
      },
    ],
  });
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByStudent,
};
