"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Room_Allocation", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      student_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        references: { model: "Student", key: "id" },
        onDelete: "CASCADE",
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Room", key: "id" },
        onDelete: "CASCADE",
      },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY },
      status: { type: Sequelize.STRING(100), allowNull: false },
      created_by: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
    await queryInterface.dropTable("Room_Allocation");
  },
};
