import validator from "validator";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";

const Palika = sequelize.define(
  "Palika",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wards: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      validate: {
        isArrayOfNumbers(value) {
          if (!Array.isArray(value) || value.some(isNaN)) {
            throw new Error("Wards must be an array of numbers.");
          }
        },
      },
    },
  },
  {
    modelName: "Palika",
    tableName: "palikas",
    timestamps: true,
  }
);

export default Palika;
