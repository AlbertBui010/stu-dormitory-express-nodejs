const { Dormitory } = require("../models");
const createHttpError = require("http-errors");

const getAll = async () => {
  try {
    return await Dormitory.findAll();
  } catch (error) {
    throw createHttpError(500, `Failed to get dormitories: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    const dormitory = await Dormitory.findByPk(id);
    if (!dormitory) {
      throw createHttpError(404, "Dormitory not found");
    }
    return dormitory;
  } catch (error) {
    if (error.statusCode === 404) throw error;
    throw createHttpError(500, `Failed to get dormitory: ${error.message}`);
  }
};

const create = async (data) => {
  try {
    return await Dormitory.create(data);
  } catch (error) {
    throw createHttpError(500, `Failed to create dormitory: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    const [updated] = await Dormitory.update(data, { where: { id } });
    if (updated === 0) {
      throw createHttpError(404, "Dormitory not found");
    }
    return await Dormitory.findByPk(id);
  } catch (error) {
    if (error.statusCode === 404) throw error;
    throw createHttpError(500, `Failed to update dormitory: ${error.message}`);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await Dormitory.destroy({ where: { id } });
    if (deleted === 0) {
      throw createHttpError(404, "Dormitory not found");
    }
    return deleted;
  } catch (error) {
    if (error.statusCode === 404) throw error;
    throw createHttpError(500, `Failed to delete dormitory: ${error.message}`);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteById,
};
