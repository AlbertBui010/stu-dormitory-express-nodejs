const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    static associate(models) {
      Auth.belongsTo(models.Student, {
        foreignKey: "student_id",
        onDelete: "CASCADE",
      });
    }
  }

  Auth.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Auth",
      tableName: "Auth",
      underscored: true,
      timestamps: true,
    }
  );

  return Auth;
};
