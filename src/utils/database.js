// utils/database.ts

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_URL, "postgres", "admin", {
  dialect: "postgres",
  logging: false,
  protocol: "postgres",
});

export default sequelize;
