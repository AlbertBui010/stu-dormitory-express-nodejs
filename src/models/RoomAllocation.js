"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RoomAllocation extends Model {
    static associate(models) {
      // Define associations
      RoomAllocation.belongsTo(models.Student, {
        foreignKey: "student_id",
        onDelete: "CASCADE",
      });

      RoomAllocation.belongsTo(models.Room, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
      });

      RoomAllocation.hasMany(models.Payment, {
        foreignKey: "room_allocation_id",
        as: "payment",
      });
    }
  }

  RoomAllocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Student",
          key: "id",
        },
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Room",
          key: "id",
        },
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.STRING(100),
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
      modelName: "RoomAllocation",
      tableName: "Room_Allocation",
      underscored: true,
      timestamps: true,
    }
  );

  return RoomAllocation;
};
