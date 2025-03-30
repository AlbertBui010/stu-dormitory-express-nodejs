"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Maintenance extends Model {
    static associate(models) {
      // Define association with Room model
      Maintenance.belongsTo(models.Room, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
      });
    }
  }

  Maintenance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Room",
          key: "id",
        },
      },
      issue_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      request_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resolved_date: {
        type: DataTypes.DATEONLY,
      },
      created_by: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Maintenance",
      tableName: "Maintenance",
      underscored: true,
      timestamps: true,
    }
  );

  return Maintenance;
};
