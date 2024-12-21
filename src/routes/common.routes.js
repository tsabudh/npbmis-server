import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getProjectsSummary } from "../controllers/common.controller.js";

const router = Router();

router.get("/summary", getProjectsSummary);
router.use(verifyToken);

export default router;
