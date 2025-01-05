// models/rejection.model.ts

import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Rejection = sequelize.define(
  "Rejection",
  {
    id: {
      type: DataTypes.INTEGER, // Integer type for rejection_id
      allowNull: false, // Not nullable
      primaryKey: true, // Set as primary key
      autoIncrement: true, // Auto-increment field
    },
    message: {
      type: DataTypes.STRING, // Character varying (string) for rejection_name
      allowNull: false, // Not nullable
    },
    rejected_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "rejections",
    timestamps: true, // Disable timestamps (createdAt, updatedAt)
  }
);

export default Rejection;
