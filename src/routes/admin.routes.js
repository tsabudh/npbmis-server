import express from "express";
import {
  authorizeOnly,
  login,
  refreshToken,
  verifyToken,
} from "../middlewares/auth.js";
import { resetPassword } from "../controllers/admin.controller.js";

const router = express.Router();

// Limit the authority to only SUPER_ADMIN
router.use(verifyToken, authorizeOnly("SUPER_ADMIN"));

router.post("/resetpassword", resetPassword);

export default router;
