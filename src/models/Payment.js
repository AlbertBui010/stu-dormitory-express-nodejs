"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Define associations
      Payment.belongsTo(models.Student, {
        foreignKey: "student_id",
        onDelete: "CASCADE",
      });

      Payment.belongsTo(models.Room, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
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
