import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import Palika from "./palika.model.js";

const StrategyCode = sequelize.define(
  "StrategyCode",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    palika_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Palika,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "strategy_codes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["palika_id", "code"],
      },
      {
        unique: true,
        fields: ["palika_id", "label"],
      },
    ],
  }
);

export default StrategyCode;
