"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SysFile extends Model {
    static associate(models) {
      SysFile.belongsTo(models.Student, {
        foreignKey: "created_by",
        onDelete: "NO ACTION",
      });

      SysFile.belongsTo(models.Student, {
        foreignKey: "updated_by",
        onDelete: "SET NULL",
      });
    }
  }

  SysFile.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      shareLink: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
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
      modelName: "SysFile",
      tableName: "SysFile",
      underscored: true, // This will make Sequelize use snake_case for column names
      timestamps: true, // This will handle created_at and updated_at automatically
    }
  );

  return SysFile;
};
