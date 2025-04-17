const { Room, Dormitory } = require("../models");
const createHttpError = require("http-errors");

const getAll = async () => {
  try {
    return await Room.findAll({
      include: [
        {
          model: Dormitory,
          attributes: ["name"],
        },
      ],
    });
  } catch (error) {
    throw createHttpError(500, `Failed to get rooms: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    const room = await Room.findByPk(id, {
      include: [
        {
          model: Dormitory,
          attributes: ["name"],
        },
      ],
    });

    if (!room) {
      throw createHttpError(404, "Room not found");
    }
    return room;
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError(500, `Failed to get room: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    const dormitory = await Dormitory.findByPk(data.dormitory_id);
    if (!dormitory) {
      throw createHttpError(404, "Dormitory not found");
    }

    // Validate price (example validation)
    if (data.price && (isNaN(data.price) || data.price < 0)) {
      throw createHttpError(400, "Price must be a positive number");
    }

    // Check if room number already exists in the dormitory
    const existingRoom = await Room.findOne({
      where: {
        dormitory_id: data.dormitory_id,
        room_number: data.room_number,
      },
    });

    if (existingRoom) {
      throw createHttpError(
        409,
        "Room number already exists in this dormitory"
      );
    }

    console.log("DATA:", data);

    return await Room.create(data);
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError(500, `Failed to create room: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    const room = await Room.findByPk(id);
    if (!room) {
      throw createHttpError(404, "Room not found");
    }

    // Check if room number is being changed and if it already exists
    if (data.room_number && data.room_number !== room.room_number) {
      const existingRoom = await Room.findOne({
        where: {
          dormitory_id: room.dormitory_id,
          room_number: data.room_number,
        },
      });

      if (existingRoom) {
        throw createHttpError(
          409,
          "Room number already exists in this dormitory"
        );
      }
    }

    // Validate price (example validation)
    if (data.price && (isNaN(data.price) || data.price < 0)) {
      throw createHttpError(400, "Price must be a positive number");
    }

    await Room.update(data, { where: { id } });
    return await getById(id);
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError(500, `Failed to update room: ${error.message}`);
  }
};

const deleteRoom = async (id) => {
  try {
    const room = await Room.findByPk(id);
    if (!room) {
      throw createHttpError(404, "Room not found");
    }

    if (room.current_occupancy > 0) {
      throw createHttpError(400, "Cannot delete room with current occupants");
    }

    return await Room.destroy({ where: { id } });
  } catch (error) {
    if (error.status) throw error;
    throw createHttpError(500, `Failed to delete room: ${error.message}`);
  }
};

const getRoomsByDormitory = async (dormitoryId) => {
  try {
    return await Room.findAll({
      where: { dormitory_id: dormitoryId },
      include: [
        {
          model: Dormitory,
          attributes: ["name"],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Failed to get rooms by dormitory: ${error.message}`);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteRoom,
  getRoomsByDormitory,
};
