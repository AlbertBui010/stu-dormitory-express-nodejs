const {
  PAYMENT_STATUS_PAID,
  RA_STATUS_DANGO,
  RA_STATUS_DANGKY,
  R_STATUS_FULL,
} = require("../const/type");
const {
  RoomAllocation,
  Payment,
  Student,
  Room,
  Dormitory,
  sequelize,
} = require("../models");
const createHttpError = require("http-errors");

const getAllPayments = async () => {
  try {
    return await Payment.findAll({
      include: [
        {
          model: RoomAllocation,
          as: "roomAllocation",
          include: [
            {
              model: Student,
              attributes: ["id", "name", "email", "phone"],
            },
            {
              model: Room,
              attributes: ["id", "room_number", "price", "room_type"],
              include: [
                {
                  model: Dormitory,
                  attributes: ["id", "name", "address"],
                },
              ],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw createHttpError.InternalServerError(
      `Failed to get payments: ${error.message}`
    );
  }
};

const getPaymentById = async (id) => {
  try {
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: RoomAllocation,
          as: "roomAllocation",
          include: [
            {
              model: Student,
              attributes: ["id", "name", "email", "phone"],
            },
            {
              model: Room,
              attributes: ["id", "room_number", "price", "room_type"],
              include: [
                {
                  model: Dormitory,
                  attributes: ["id", "name", "address"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      throw createHttpError.NotFound("Payment not found");
    }

    return payment;
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Failed to get payment: ${error.message}`
    );
  }
};
const createPayment = async (paymentData) => {
  const transaction = await sequelize.transaction();

  try {
    const { room_allocation_id } = paymentData;

    // Kiểm tra room allocation tồn tại
    const roomAllocation = await RoomAllocation.findByPk(room_allocation_id, {
      include: [{ model: Student }, { model: Room }],
      transaction,
    });

    if (!roomAllocation) {
      throw createHttpError.NotFound("Room allocation not found");
    }

    // Kiểm tra xem đã có payment cho room allocation này chưa
    const existingPayment = await Payment.findOne({
      where: { room_allocation_id },
      transaction,
    });

    if (existingPayment) {
      throw createHttpError.Conflict(
        "A payment for this room allocation already exists"
      );
    }

    // Tạo payment mới
    const payment = await Payment.create(paymentData, { transaction });

    await transaction.commit();

    // Trả về payment với data đầy đủ
    return await getPaymentById(payment.id);
  } catch (error) {
    await transaction.rollback();
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Failed to create payment: ${error.message}`
    );
  }
};

const updatePayment = async (id, updateData) => {
  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findByPk(id, { transaction });
    if (!payment) {
      throw createHttpError.NotFound("Payment not found");
    }

    // Nếu cập nhật trạng thái payment thành PAID, thực hiện logic bổ sung
    if (
      updateData.payment_status === PAYMENT_STATUS_PAID &&
      payment.payment_status !== PAYMENT_STATUS_PAID
    ) {
      const roomAllocationId = payment.room_allocation_id;
      const roomAllocation = await RoomAllocation.findByPk(roomAllocationId, {
        include: [{ model: Room }],
        transaction,
      });

      // Kiểm tra xem RoomAllocation có phải đang ở trạng thái DANGKY không
      if (roomAllocation && roomAllocation.status === RA_STATUS_DANGKY) {
        // Cập nhật trạng thái room allocation thành DANGO
        await roomAllocation.update(
          {
            status: RA_STATUS_DANGO,
            updated_by: updateData.updated_by,
          },
          { transaction }
        );
        // Cập nhật số người trong phòng
        const roomId = roomAllocation.room_id;
        const roomDirectly = await Room.findByPk(roomId, { transaction });

        if (roomDirectly) {
          await roomDirectly.increment("current_occupancy", { transaction });
          await roomDirectly.reload({ transaction });

          if (roomDirectly.current_occupancy >= roomDirectly.capacity) {
            await roomDirectly.update(
              { status: R_STATUS_FULL },
              { transaction }
            );
          }

          console.log(
            `Updated room occupancy for room ID: ${roomDirectly.id}, new occupancy: ${roomDirectly.current_occupancy}`
          );
        } else {
          console.error(`Room with ID ${roomId} not found`);
        }
      } else if (!roomAllocation) {
        console.error(`RoomAllocation with ID ${roomAllocationId} not found`);
      } else {
        console.log(
          `RoomAllocation status is ${roomAllocation.status}, not updating to DANGO`
        );
      }
    }

    // Cập nhật payment
    await payment.update(updateData, { transaction });

    await transaction.commit();

    // Trả về payment đã cập nhật với data đầy đủ
    return await getPaymentById(id);
  } catch (error) {
    await transaction.rollback();
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Failed to update payment: ${error.message}`
    );
  }
};
const deletePayment = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findByPk(id, { transaction });
    if (!payment) {
      throw createHttpError.NotFound("Payment not found");
    }

    await payment.destroy({ transaction });
    await transaction.commit();

    return { message: "Payment deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Failed to delete payment: ${error.message}`
    );
  }
};

const getPaymentsByStudent = async (studentId) => {
  try {
    return await Payment.findAll({
      include: [
        {
          model: RoomAllocation,
          as: "roomAllocation",
          where: { student_id: studentId },
          include: [
            {
              model: Room,
              attributes: ["id", "room_number", "price", "room_type"],
              include: [
                {
                  model: Dormitory,
                  attributes: ["id", "name", "address"],
                },
              ],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Failed to get student payments: ${error.message}`
    );
  }
};

const getPaymentByRoomAllocation = async (roomAllocationId) => {
  try {
    const payment = await Payment.findOne({
      where: { room_allocation_id: roomAllocationId },
      include: [
        {
          model: RoomAllocation,
          as: "roomAllocation",
          include: [
            {
              model: Student,
              attributes: ["id", "name", "email", "phone"],
            },
            {
              model: Room,
              attributes: ["id", "room_number", "price", "room_type"],
              include: [
                {
                  model: Dormitory,
                  attributes: ["id", "name", "address"],
                },
              ],
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
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Failed to get payment: ${error.message}`
    );
  }
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
