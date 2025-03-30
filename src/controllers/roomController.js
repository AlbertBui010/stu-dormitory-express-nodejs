const roomService = require("../services/roomService");

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await roomService.getById(req.params.id);
    res.json(room);
  } catch (error) {
    if (error.message === "Room not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.createRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      created_by: req.user.id,
    };
    const room = await roomService.create(roomData);
    res.status(201).json(room);
  } catch (error) {
    if (error.message.includes("already exists")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      updated_by: req.user.id,
    };
    const room = await roomService.update(req.params.id, roomData);
    res.json(room);
  } catch (error) {
    if (error.message === "Room not found") {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("already exists")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await roomService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === "Room not found") {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("current occupants")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.getRoomsByDormitory = async (req, res) => {
  try {
    const rooms = await roomService.getRoomsByDormitory(req.params.dormitoryId);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
