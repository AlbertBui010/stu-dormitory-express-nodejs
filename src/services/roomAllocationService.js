const {
  RA_STATUS_DANGKY,
  RA_STATUS_DANGO,
  R_STATUS_FULL,
  R_STATUS_AVAILABLE,
} = require("../const/type");
const { RoomAllocation, Student, Room, Dormitory } = require("../models");
const createHttpError = require("http-errors");

const getAllAllocations = async () => {
  return await RoomAllocation.findAll();
};

const getAllocationById = async (id) => {
  const allocation = await RoomAllocation.findByPk(id, {
    include: [
      {
        model: Student,
        attributes: ["id", "name", "email"],
      },
      {
        model: Room,
        attributes: [
          "id",
          "room_number",
          "capacity",
          "price",
          "facility",
          "room_type",
        ],
        include: [
          {
            model: Dormitory,
            attributes: ["id", "name", "address"],
          },
        ],
      },
    ],
  });

  if (!allocation) {
    throw createHttpError.NotFound("Room allocation not found");
  }

  return allocation;
};

const createAllocation = async (allocationData) => {
  const { room_id, student_id } = allocationData;

  // Check if room exists and has capacity
  const room = await Room.findByPk(room_id);
  if (!room) {
    throw createHttpError.NotFound("Room not found");
  }
  if (room.current_occupancy >= room.capacity) {
    throw createHttpError.BadRequest("Room is at full capacity");
  }

  // Check if student exists and isn't already allocated
  const existingAllocation = await RoomAllocation.findOne({
    where: {
      student_id,
    },
  });

  if (existingAllocation) {
    throw createHttpError.BadRequest(
      "Student already has an active room allocation"
    );
  }

  // Set trạng thái mặc định là DANGKY nếu không được cung cấp
  if (!allocationData.status) {
    allocationData.status = RA_STATUS_DANGKY;
  }

  const allocation = await RoomAllocation.create(allocationData);

  if (allocation.status === RA_STATUS_DANGO) {
    await room.increment("current_occupancy");

    await room.reload();

    if (room.current_occupancy >= room.capacity) {
      await room.update({ status: R_STATUS_FULL });
    }
  }

  return allocation;
};

const updateAllocation = async (id, updateData) => {
  const allocation = await RoomAllocation.findByPk(id);
  if (!allocation) {
    throw createHttpError.NotFound("Room allocation not found");
  }

  const oldStatus = allocation.status;
  const newStatus = updateData.status || oldStatus;

  const updatedAllocation = await allocation.update(updateData);

  // Xử lý thay đổi room_id (chuyển phòng)
  if (updateData.room_id && updateData.room_id !== allocation.room_id) {
    // Lấy thông tin phòng cũ và phòng mới
    const oldRoom = await Room.findByPk(allocation.room_id);
    const newRoom = await Room.findByPk(updateData.room_id);

    if (!newRoom) {
      throw createHttpError.NotFound("New room not found");
    }

    // Kiểm tra capacity của phòng mới
    if (newRoom.current_occupancy >= newRoom.capacity) {
      throw createHttpError.BadRequest("New room is at full capacity");
    }

    // Giảm số người ở phòng cũ nếu status trước đó là Active
    if (oldStatus !== DANGO) {
      await oldRoom.decrement("current_occupancy");
      await oldRoom.reload();

      // Cập nhật trạng thái phòng cũ nếu không còn đầy
      if (
        oldRoom.status === R_STATUS_FULL &&
        oldRoom.current_occupancy < oldRoom.capacity
      ) {
        await oldRoom.update({ status: R_STATUS_AVAILABLE });
      }
    }

    // Tăng số người ở phòng mới nếu status mới là Active
    if (newStatus === RA_STATUS_DANGO) {
      await newRoom.increment("current_occupancy");
      await newRoom.reload();

      // Cập nhật trạng thái phòng mới nếu đã đầy
      if (newRoom.current_occupancy >= newRoom.capacity) {
        await newRoom.update({ status: R_STATUS_FULL });
      }
    }
  }
  // Xử lý thay đổi status nhưng không thay đổi phòng
  else if (oldStatus !== newStatus) {
    const room = await Room.findByPk(allocation.room_id);

    // Nếu từ không active -> active thì tăng
    if (oldStatus !== RA_STATUS_DANGO && newStatus === RA_STATUS_DANGO) {
      await room.increment("current_occupancy");
      await room.reload();

      if (room.current_occupancy >= room.capacity) {
        await room.update({ status: R_STATUS_FULL });
      }
    }
    // Nếu từ active -> không active thì giảm
    else if (oldStatus === RA_STATUS_DANGO && newStatus !== RA_STATUS_DANGO) {
      await room.decrement("current_occupancy");
      await room.reload();

      if (
        room.status === R_STATUS_FULL &&
        room.current_occupancy < room.capacity
      ) {
        await room.update({ status: R_STATUS_AVAILABLE });
      }
    }
  }

  return updatedAllocation;
};

const deleteAllocation = async (id) => {
  const allocation = await RoomAllocation.findByPk(id);
  if (!allocation) {
    throw createHttpError.NotFound("Room allocation not found");
  }

  // Decrease room occupancy if allocation was active
  if (allocation.status === RA_STATUS_DANGO) {
    const room = await Room.findByPk(allocation.room_id);
    await room.decrement("current_occupancy");
  }

  await allocation.destroy();
  return { message: "Room allocation deleted successfully" };
};

const getAllocationsByDormitory = async (dormitoryId) => {
  return await RoomAllocation.findAll({
    include: [
      {
        model: Student,
        attributes: ["id", "name", "email"],
      },
      {
        model: Room,
        attributes: [
          "id",
          "room_number",
          "capacity",
          "price",
          "facility",
          "room_type",
        ],
        where: { dormitory_id: dormitoryId },
        include: [
          {
            model: Dormitory,
            attributes: ["id", "name", "address"],
          },
        ],
      },
    ],
  });
};

const getAllocationsByStudent = async (studentId) => {
  return await RoomAllocation.findAll({
    where: { student_id: studentId },
    include: [
      {
        model: Room,
        attributes: [
          "id",
          "room_number",
          "capacity",
          "price",
          "facility",
          "room_type",
        ],
        include: [
          {
            model: Dormitory,
            attributes: ["id", "name", "address"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  getAllAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getAllocationsByDormitory,
  getAllocationsByStudent,
};
