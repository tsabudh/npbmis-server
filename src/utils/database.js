// utils/database.ts

import { Sequelize } from "sequelize";

const sequelize = new Sequelize("npbmis", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
  logging: false, // Disable logging
});

export default sequelize;
