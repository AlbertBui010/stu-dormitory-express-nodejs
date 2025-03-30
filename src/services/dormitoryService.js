const { Dormitory } = require("../models");

class DormitoryService {
  async getAll() {
    try {
      return await Dormitory.findAll();
    } catch (error) {
      throw new Error(`Failed to get dormitories: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const dormitory = await Dormitory.findByPk(id);
      if (!dormitory) {
        throw new Error("Dormitory not found");
      }
      return dormitory;
    } catch (error) {
      throw new Error(`Failed to get dormitory: ${error.message}`);
    }
  }
  async create(data) {
    return await Dormitory.create(data);
  }

  async update(id, data) {
    await Dormitory.update(data, { where: { id } });
    return await Dormitory.findByPk(id);
  }

  async delete(id) {
    return await Dormitory.destroy({ where: { id } });
  }
}

module.exports = new DormitoryService();
