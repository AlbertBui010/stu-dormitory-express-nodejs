"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Maintenance", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Room",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      issue_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      request_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.fn("now"),
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resolved_date: {
        type: Sequelize.DATEONLY,
      },
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
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Maintenance");
  },
};
