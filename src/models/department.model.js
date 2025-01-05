import sequelize from "../utils/database.js";
import { DataTypes } from "sequelize";

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    palika_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "palikas",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "departments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "palika_id"],
      },
    ],
  }
);

export default Department;
