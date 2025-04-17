const { Payment, Student, Room } = require("../models");
const createHttpError = require("http-errors");

const getAllPayments = async () => {
  return await Payment.findAll({
    include: [
      {
        model: RoomAllocation,
        as: "roomAllocation",
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["id", "name", "email"],
          },
          {
            model: Room,
            as: "room",
            attributes: ["id", "room_number", "price"],
          },
        ],
      },
    ],
  });
};

const getPaymentById = async (id) => {
  const payment = await Payment.findByPk(id, {
    include: [
      {
        model: RoomAllocation,
        as: "roomAllocation",
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["id", "name", "email"],
          },
          {
            model: Room,
            as: "room",
            attributes: ["id", "room_number", "price"],
          },
        ],
      },
    ],
  });

  if (!payment) {
    throw createHttpError.NotFound("Payment not found");
  }

  return payment;
};

const createPayment = async (paymentData) => {
  const { room_allocation_id } = paymentData;

  const roomAllocation = await RoomAllocation.findByPk(room_allocation_id, {
    include: [
      { model: Student, as: "student" },
      { model: Room, as: "room" },
    ],
  });

  if (!roomAllocation) {
    throw createHttpError.NotFound("Room allocation not found");
  }

  const existingPayment = await Payment.findOne({
    where: { room_allocation_id },
  });

  if (existingPayment) {
    throw createHttpError.Conflict(
      "A payment for this room allocation already exists"
    );
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

const getPaymentByRoomAllocation = async (roomAllocationId) => {
  const payment = await Payment.findOne({
    where: { room_allocation_id: roomAllocationId },
    include: [
      {
        model: RoomAllocation,
        as: "roomAllocation",
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["id", "name", "email"],
          },
          {
            model: Room,
            as: "room",
            attributes: ["id", "room_number", "price"],
          },
        ],
      },
    ],
  });

  if (!payment) {
    throw createHttpError.NotFound(
      "Payment not found for this room allocation"
    );
  }

  return payment;
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByStudent,
  getPaymentByRoomAllocation,
};
