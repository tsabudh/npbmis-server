// models/ministry.model.ts

import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Ministry = sequelize.define(
  "Ministry",
  {
    ministry_id: {
      type: DataTypes.INTEGER, // Integer type for ministry_id
      allowNull: false, // Not nullable
      primaryKey: true, // Set as primary key
      autoIncrement: true, // Auto-increment field
    },
    ministry_name: {
      type: DataTypes.STRING, // Character varying (string) for ministry_name
      allowNull: false, // Not nullable
    },
  },
  {
    tableName: "ministries",
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
  }
);

export default Ministry;
