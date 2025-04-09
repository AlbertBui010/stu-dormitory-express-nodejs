const dormitoryService = require("../services/dormitoryService");

const getAllDormitories = async (req, res) => {
  try {
    const dormitories = await dormitoryService.getAll();
    console.log("======>", dormitories);
    res.json(dormitories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDormitoryById = async (req, res) => {
  try {
    const dormitory = await dormitoryService.getById(req.params.id);
    if (!dormitory)
      return res.status(404).json({ error: "Dormitory not found" });
    res.json(dormitory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDormitory = async (req, res) => {
  try {
    const dormitoryData = {
      ...req.body,
      created_by: req.user.id,
    };
    const dormitory = await dormitoryService.create(dormitoryData);
    res.status(201).json(dormitory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDormitory = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ error: "Dormitory ID is required" });
    if (!req.body || Object.keys(req.body).length === 0)
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });

    const dormitoryData = {
      ...req.body,
      updated_by: req.user.id,
    };
    const dormitory = await dormitoryService.update(
      req.params.id,
      dormitoryData
    );
    res.json(dormitory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDormitory = async (req, res) => {
  try {
    await dormitoryService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDormitories,
  getDormitoryById,
  createDormitory,
  updateDormitory,
  deleteDormitory,
};
