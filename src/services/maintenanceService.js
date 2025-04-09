const { Maintenance, Room } = require("../models");
const createHttpError = require("http-errors");

const getAllMaintenanceRequests = async () => {
  return await Maintenance.findAll({
    include: [
      {
        model: Room,
        attributes: ["id", "room_number"],
      },
    ],
  });
};

const getMaintenanceById = async (id) => {
  const maintenance = await Maintenance.findByPk(id, {
    include: [
      {
        model: Room,
        attributes: ["id", "room_number"],
      },
    ],
  });

  if (!maintenance) {
    throw createHttpError.NotFound("Maintenance request not found");
  }

  return maintenance;
};

const createMaintenance = async (maintenanceData) => {
  const { room_id } = maintenanceData;

  // Verify room exists
  const room = await Room.findByPk(room_id);
  if (!room) {
    throw createHttpError.NotFound("Room not found");
  }

  return await Maintenance.create({
    ...maintenanceData,
    status: "Pending",
  });
};

const updateMaintenance = async (id, updateData) => {
  const maintenance = await Maintenance.findByPk(id);
  if (!maintenance) {
    throw createHttpError.NotFound("Maintenance request not found");
  }

  // If status is being updated to 'Resolved', set resolved_date
  if (updateData.status === "Resolved" && maintenance.status !== "Resolved") {
    updateData.resolved_date = new Date();
  }

  return await maintenance.update(updateData);
};

const deleteMaintenance = async (id) => {
  const maintenance = await Maintenance.findByPk(id);
  if (!maintenance) {
    throw createHttpError.NotFound("Maintenance request not found");
  }

  await maintenance.destroy();
  return { message: "Maintenance request deleted successfully" };
};

module.exports = {
  getAllMaintenanceRequests,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
