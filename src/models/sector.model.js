import validator from "validator";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";

const Sector = sequelize.define(
  "Sector",
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
    nepali_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    modelName: "Sector",
    tableName: "sectors",
    timestamps: true,
  }
);

export default Sector;
