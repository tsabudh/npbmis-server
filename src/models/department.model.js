import sequelize from "../utils/database.js";
import { DataTypes } from 'sequelize';

const Department = sequelize.define(
  "Department",
  {
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ministry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ministries",
        key: "ministry_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "departments",
    timestamps: false,
  }
);

export default Department;
