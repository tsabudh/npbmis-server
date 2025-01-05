import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";

import { NOTIFICATION_TYPES } from "../constants/notificationConstants.js";
const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  palika_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "palikas",
      key: "id",
    },
  },
  message: {
    type: DataTypes.STRING(5000),
    allowNull: false,
  },
  type: {
    /* 
    ANNOUNCEMENT -> If there is an announcement to all users across the platform
    PROJECT_ASSIGNED -> A project assigned to a user role,
    PROJECT_NOTICE -> A project has been accepted, or submitted, or rejected	 
    */
    type: DataTypes.STRING(128),
    allowNull: false,
    validate: {
      isIn: [NOTIFICATION_TYPES],
    },
  },
  redirect_id: DataTypes.INTEGER,
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP + interval '30 days'"),
  },
});

export const UserNotifications = sequelize.define("UserNotifications", {
  readStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Notification;
