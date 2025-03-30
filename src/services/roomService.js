const { Room, Dormitory } = require("../models");

class RoomService {
  async getAll() {
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
      throw new Error(`Failed to get rooms: ${error.message}`);
    }
  }

  async getById(id) {
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
        throw new Error("Room not found");
      }
      return room;
    } catch (error) {
      throw new Error(`Failed to get room: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const dormitory = await Dormitory.findByPk(data.dormitory_id);
      if (!dormitory) {
        throw new Error("Dormitory not found");
      }

      // Check if room number already exists in the dormitory
      const existingRoom = await Room.findOne({
        where: {
          dormitory_id: data.dormitory_id,
          room_number: data.room_number,
        },
      });

      if (existingRoom) {
        throw new Error("Room number already exists in this dormitory");
      }

      return await Room.create(data);
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const room = await Room.findByPk(id);
      if (!room) {
        throw new Error("Room not found");
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
          throw new Error("Room number already exists in this dormitory");
        }
      }

      await Room.update(data, { where: { id } });
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const room = await Room.findByPk(id);
      if (!room) {
        throw new Error("Room not found");
      }

      if (room.current_occupancy > 0) {
        throw new Error("Cannot delete room with current occupants");
      }

      return await Room.destroy({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  async getRoomsByDormitory(dormitoryId) {
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
  }
}

module.exports = new RoomService();
