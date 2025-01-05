import { Router } from "express";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";
import {
  createProject,
  getAllProjects,
  getAllProjectsAssigned,
  getAProject,
  getDraftProjects,
  postApproveProject,
  postEvaluateProject,
  postSubmitProject,
  postVerifyProject,
  rejectProject,
  saveDraftProject,
} from "../controllers/project.controller.js";
import {
  DATA_DRAFT_ROLES,
  DATA_ENTRY_ROLES,
} from "../constants/userConstants.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllProjects);
router.post("/", authorizeOnly(DATA_ENTRY_ROLES), createProject);
router.get("/assigned", getAllProjectsAssigned);
router.get("/drafts", authorizeOnly(DATA_DRAFT_ROLES), getDraftProjects);
router.get("/one/:projectId", getAProject);
router.patch("/one/save", authorizeOnly(DATA_ENTRY_ROLES), saveDraftProject);
router.post("/one/verify", authorizeOnly("VERIFIER"), postVerifyProject);
router.post("/one/submit", authorizeOnly("PREPARER"), postSubmitProject);
router.post("/one/approve", authorizeOnly("APPROVER"), postApproveProject);
router.post("/one/evaluate", authorizeOnly("EVALUATOR"), postEvaluateProject);
router.post(
  "/one/reject",
  authorizeOnly(["DATA_SUBMIT", "DATA_APPROVE"]),
  rejectProject
);

export default router;
