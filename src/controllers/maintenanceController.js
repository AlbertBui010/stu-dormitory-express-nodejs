const maintenanceService = require("../services/maintenanceService");

const getAllMaintenanceRequests = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getAllMaintenanceRequests();
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(
      req.params.id
    );
    res.json(maintenance);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const createMaintenance = async (req, res) => {
  try {
    const maintenanceData = {
      ...req.body,
      created_by: req.user.id,
      request_date: new Date(),
    };
    const maintenance = await maintenanceService.createMaintenance(
      maintenanceData
    );
    res.status(201).json(maintenance);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_by: req.user.id,
    };
    const maintenance = await maintenanceService.updateMaintenance(
      req.params.id,
      updateData
    );
    res.json(maintenance);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.deleteMaintenance(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMaintenanceRequests,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
