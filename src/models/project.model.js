import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Project = sequelize.define(
  "Project",
  {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nepali_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("NEW_OR_UPCOMING", "ONGOING"),
      allowNull: false,
    },
    sector: {
      type: DataTypes.ENUM("INFRASTRUCTURE", "SOCIAL_OR_SERVICE"),
      allowNull: false,
    },
    inception_status: {
      type: DataTypes.ENUM("IDENTIFICATION", "EVALUATION"),
      allowNull: true,
      validate: {
        isInceptionStatusRequired(value) {
          if (this.status === "NEW_OR_UPCOMING" && !value) {
            throw new Error(
              'Inception status is required when status is "NEW_OR_UPCOMING"'
            );
          }
        },
      },
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["status", "inception_status"],
      },
    ],
  }
);

export default Project;
