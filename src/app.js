// server.ts

import express from "express";
import sequelize from "./utils/database.js";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import ministryRoutes from "./routes/ministry.routes.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";
import sectorRoutes from "./routes/sector.routes.js";
import commonRoutes from "./routes/common.routes.js";
import rejectionRoutes from "./routes/rejection.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import palikaRoutes from "./routes/palika.routes.js";

import cors from "cors";
import "./models/associations.js";
import AppError from "./utils/appError.js";

import "./middlewares/crons.js";

const app = express();

app.use(express.json());
app.use(cors());
app.options("*", cors());

dotenv.config();

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/ministries", ministryRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sectors", sectorRoutes);
app.use("/api/v1/common", commonRoutes);
app.use("/api/v1/rejections", rejectionRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/palikas", palikaRoutes);

app.all("*", (req, res, next) => {
  res.status(400).json({
    status: "failure",
    message: `Missed the route: ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  // If the error is an instance of AppError, use its properties
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      caughtBy: "expressGlobalErrorHandler",
      error: error,
    });
  }
  res.status(400).json({
    status: "failure",
    message: error.message,
    caughtBy: "expressGlobalErrorHandler",
    error: error,
  });
});

// Sync the database and start the server
sequelize
  .sync({
    alter: true,
    force: false, //* change this to force database sync, forces constraints to be dropped and recreated, drops all rows
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });

export default app;
