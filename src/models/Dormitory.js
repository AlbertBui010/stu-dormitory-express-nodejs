"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Dormitory extends Model {
    static associate(models) {
      // Define associations here
      Dormitory.hasMany(models.Room, {
        foreignKey: "dormitory_id",
      });
    }
  }

  Dormitory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      total_rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: "Dormitory",
      tableName: "Dormitory",
      underscored: true, // This will make Sequelize use snake_case for column names
      timestamps: true, // This will handle created_at and updated_at automatically
    }
  );

  return Dormitory;
};
