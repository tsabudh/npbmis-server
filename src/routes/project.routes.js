import { Router } from "express";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";
import {
  approveProject,
  createProject,
  getAllProjects,
  getAllProjectsAssigned,
  getAProject,
  getDraftProjects,
  prepareProject,
  rejectProject,
  saveDraftProject,
  submitProject,
} from "../controllers/project.controller.js";
import { DATA_DRAFT_ROLES, DATA_ENTRY_ROLES } from "../constants/userRoles.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllProjects);
router.post("/", authorizeOnly(DATA_ENTRY_ROLES), createProject);
router.get("/assigned", getAllProjectsAssigned);
router.get("/drafts", authorizeOnly(DATA_DRAFT_ROLES), getDraftProjects);
router.get("/one/:projectId", getAProject);
router.patch("/one/save", authorizeOnly(DATA_ENTRY_ROLES), saveDraftProject);
router.post("/one/prepare", authorizeOnly("DATA_PREPARE"), prepareProject);
router.post("/one/submit", authorizeOnly("DATA_SUBMIT"), submitProject);
router.post("/one/approve", authorizeOnly("DATA_APPROVE"), approveProject);
router.post(
  "/one/reject",
  authorizeOnly(["DATA_SUBMIT", "DATA_APPROVE"]),
  rejectProject
);

export default router;
