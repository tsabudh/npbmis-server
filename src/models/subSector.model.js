import validator from "validator";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";
import Sector from "./sector.model.js";

const SubSector = sequelize.define(
  "SubSector",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nepali_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sectors",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    modelName: "SubSector",
    tableName: "sub_sectors",
    timestamps: false,
  }
);

export default SubSector;

