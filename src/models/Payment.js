"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Define associations
      Payment.belongsTo(models.RoomAllocation, {
        foreignKey: "room_allocation_id",
        onDelete: "CASCADE",
        as: "roomAllocation",
      });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_allocation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Room_Allocation",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      payment_method: {
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
      modelName: "Payment",
      tableName: "Payment",
      underscored: true,
      timestamps: true,
    }
  );

  return Payment;
};
