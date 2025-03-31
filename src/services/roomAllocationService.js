const { RoomAllocation, Student, Room } = require("../models");
const createHttpError = require("http-errors");

const getAllAllocations = async () => {
  return await RoomAllocation.findAll({
    include: [
      { model: Student, attributes: ["id", "name", "email"] },
      { model: Room, attributes: ["id", "room_number", "capacity"] },
    ],
  });
};

const getAllocationById = async (id) => {
  const allocation = await RoomAllocation.findByPk(id, {
    include: [
      { model: Student, attributes: ["id", "name", "email"] },
      { model: Room, attributes: ["id", "room_number", "capacity"] },
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
      status: "Active",
    },
  });

  if (existingAllocation) {
    throw createHttpError.BadRequest(
      "Student already has an active room allocation"
    );
  }

  const allocation = await RoomAllocation.create(allocationData);

  // Update room occupancy
  await room.increment("current_occupancy");

  return allocation;
};

const updateAllocation = async (id, updateData) => {
  const allocation = await RoomAllocation.findByPk(id);
  if (!allocation) {
    throw createHttpError.NotFound("Room allocation not found");
  }

  return await allocation.update(updateData);
};

const deleteAllocation = async (id) => {
  const allocation = await RoomAllocation.findByPk(id);
  if (!allocation) {
    throw createHttpError.NotFound("Room allocation not found");
  }

  // Decrease room occupancy if allocation was active
  if (allocation.status === "Active") {
    const room = await Room.findByPk(allocation.room_id);
    await room.decrement("current_occupancy");
  }

  await allocation.destroy();
  return { message: "Room allocation deleted successfully" };
};

module.exports = {
  getAllAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
};
