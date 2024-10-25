import validator from "validator";
import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Matches the nextval('users_user_id_seq')
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true, // Default is 'true' as per the column_default
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // Matches CURRENT_TIMESTAMP
    },

    role: {
      type: DataTypes.ENUM("DATA_APPROVER", "DATA_ENTRY", "SUPER_ADMIN"), // Define the enum with possible values
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 15], // Enforce a length limit between 1 and 15 characters
          msg: "Username must be between 1 and 15 characters.",
        },
        isAlphanumeric(value) {
          if (!validator.isAlphanumeric(value)) {
            throw new Error("Username must only contain letters and numbers.");
          }
        },
        startsWithLetter(value) {
          if (!/^[A-Za-z]/.test(value)) {
            throw new Error("Username must start with a letter.");
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false, // Not nullable
    },
    last_seen: {
      type: DataTypes.DATE,
    },
    password_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password_hash"] },
    },
    timestamps: false, // Disable Sequelize auto-adding createdAt and updatedAt
    tableName: "users", // Ensures Sequelize uses the exact table name
  }
);

// Hook to ensure username,first_name and last_name is lowercase before saving to the database
User.addHook("beforeSave", (user, options) => {
  if (user.username) {
    user.username = user.username.toLowerCase();
  }
  if (user.first_name) {
    user.first_name = user.first_name.toLowerCase();
  }
  if (user.last_name) {
    user.last_name = user.last_name.toLowerCase();
  }
});

// Regular expression to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Add beforeSave hook to validate email
User.addHook("beforeSave", (user, options) => {
  if (user.email && !validator.isEmail(user.email)) {
    throw new Error("Invalid email format");
  }
  if (user.email && !emailRegex.test(user.email)) {
    throw new Error("Invalid email format");
  }
});

// Logging password changed date and time
User.addHook("beforeSave", async (user, options) => {
  if (user.changed("password_hash") && !user.isNewRecord) {
    user.password_modified_date = new Date();
  }
});

export default User;
