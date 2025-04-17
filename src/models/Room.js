"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // Define association with Dormitory model
      Room.belongsTo(models.Dormitory, {
        foreignKey: "dormitory_id",
        onDelete: "CASCADE",
      });
      Room.hasMany(models.RoomAllocation, {
        foreignKey: "room_id",
      });
      Room.hasMany(models.Maintenance, {
        foreignKey: "room_id",
      });
      Room.hasMany(models.Payment, {
        foreignKey: "room_id",
      });
    }
  }

  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dormitory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Dormitory",
          key: "id",
        },
      },
      room_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      current_occupancy: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      room_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      facility: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Room",
      tableName: "Room",
      underscored: true,
      timestamps: true,
    }
  );

  return Room;
};
