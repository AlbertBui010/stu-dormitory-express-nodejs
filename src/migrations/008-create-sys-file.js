"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SysFile", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      shareLink: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING(255), allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
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
    await queryInterface.dropTable("SysFile");
  },
};
