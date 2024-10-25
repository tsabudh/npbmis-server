import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  createProject,
  getAllProjects,
  getAProject,
} from "../controllers/project.controller.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllProjects);
router.get("/:id", getAProject);
router.post("/", createProject);

export default router;
