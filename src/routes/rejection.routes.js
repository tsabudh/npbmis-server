import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getProjectsSummary } from "../controllers/common.controller.js";
import { getRejectionMessage } from "../controllers/rejection.controller.js";

const router = Router();

router.get("/get", verifyToken, getRejectionMessage);

export default router;
