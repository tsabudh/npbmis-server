import { Router } from "express";
import { createNewPalika } from "../controllers/office.controller.js";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";
import { ALL_ADMINS } from "../constants/userConstants.js";

const router = Router();

router.use(verifyToken);

router.post("/new", verifyToken, authorizeOnly(ALL_ADMINS), createNewPalika);

export default router;
