"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Room", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      dormitory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Dormitory", key: "id" },
        onDelete: "CASCADE",
      },
      room_number: { type: Sequelize.STRING(50), allowNull: false },
      capacity: { type: Sequelize.INTEGER, allowNull: false },
      current_occupancy: { type: Sequelize.INTEGER, defaultValue: 0 },
      room_type: { type: Sequelize.STRING(100), allowNull: false },
      status: { type: Sequelize.STRING(100), allowNull: false },
      created_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
        references: { model: "Student", key: "id" },
        onDelete: "SET NULL",
      },
      updated_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
        references: { model: "Student", key: "id" },
        onDelete: "SET NULL",
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("now") },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn("now") },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Room"); // Fixed: Changed from "Payment" to "Room"
  },
};
