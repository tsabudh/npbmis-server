// utils/database.ts

import { Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT, // Database port
    dialectModule: pg, // Dialect module
    dialect: "postgres", // Use PostgreSQL dialect
    logging: false,
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Require SSL for secure connection
        rejectUnauthorized: false, // Disable strict certificate verification (if needed)
      },
    },
  }
);



export default sequelize;
