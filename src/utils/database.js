// utils/database.ts

import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize(process.env.DB_URL, "postgres", "admin", {
  dialectModule: pg,
  dialect: "postgres",
  logging: false,
  protocol: "postgres",
});

export default sequelize;
