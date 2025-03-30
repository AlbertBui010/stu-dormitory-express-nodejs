"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Student", {
      id: { type: Sequelize.STRING(100), primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      gender: { type: Sequelize.STRING, allowNull: false },
      dob: { type: Sequelize.DATEONLY, allowNull: false },
      major: { type: Sequelize.STRING, allowNull: false },
      year: { type: Sequelize.STRING, allowNull: false },
      created_by: { type: Sequelize.STRING(100), allowNull: true },
      updated_by: { type: Sequelize.STRING(100), allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("now") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("now") },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Student");
  },
};
