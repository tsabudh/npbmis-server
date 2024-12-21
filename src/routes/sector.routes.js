import { Router } from "express";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";

import { DATA_ENTRY_ROLES } from "../constants/userRoles.js";
import { getAllSectors } from "../controllers/sector.controller.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllSectors);

export default router;
