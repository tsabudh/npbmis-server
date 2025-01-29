// models/Token.model.ts

import { DataTypes, Op, UUID } from "sequelize";
import crypto from "crypto";
import sequelize from "../utils/database.js";

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PASSWORD_RESET_TOKEN",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: crypto.randomBytes(3).toString("hex"),
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 30 * 60 * 1000),
    },
  },
  {
    tableName: "tokens",
    timestamps: true,
    defaultScope: {
      where: {
        expiresAt: { [Op.gt]: new Date() }, // Only fetch non-expired tokens
      },
    },
    scopes: {
      allTokens: {}, // Fetch all tokens (even expired ones)
    },
    indexes: [
      {
        unique: true,
        fields: ["user_id", "type"],
      },
    ],
    hooks: {
      beforeCreate: (token) => {
        switch (token.type) {
          case "PASSWORD_RESET_TOKEN":
            token.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
            break;
          case "EMAIL_VERIFICATION_TOKEN":
            token.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            break;
          case "API_KEY_TOKEN":
            token.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            break;
          default:
            token.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Default 30 minutes
        }
      },
      beforeUpdate: (token) => {
        if (token.changed("expiresAt")) {
          throw new Error("expiresAt cannot be modified once set.");
        }
      },
    },
  }
);

export default Token;
