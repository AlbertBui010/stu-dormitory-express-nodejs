const roomAllocationService = require("../services/roomAllocationService");

const getAllAllocations = async (req, res) => {
  try {
    const allocations = await roomAllocationService.getAllAllocations();
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllocationById = async (req, res) => {
  try {
    const allocation = await roomAllocationService.getAllocationById(
      req.params.id
    );
    res.json(allocation);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const createAllocation = async (req, res) => {
  try {
    const allocationData = {
      ...req.body,
      created_by: req.user.id,
    };
    console.log(" createAllocation ~ allocationData:", allocationData);

    const allocation = await roomAllocationService.createAllocation(
      allocationData
    );

    res.status(201).json(allocation);
  } catch (error) {
    if (error.status === 400 || error.status === 404) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateAllocation = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_by: req.user.id,
    };
    const allocation = await roomAllocationService.updateAllocation(
      req.params.id,
      updateData
    );
    res.json(allocation);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteAllocation = async (req, res) => {
  try {
    const result = await roomAllocationService.deleteAllocation(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getAllocationsByDormitory = async (req, res) => {
  try {
    const dormitoryId = req.params.dormitoryId;
    const allocations = await roomAllocationService.getAllocationsByDormitory(
      dormitoryId
    );
    res.json(allocations);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getAllocationsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const allocations = await roomAllocationService.getAllocationsByStudent(
      studentId
    );
    res.json(allocations);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
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
