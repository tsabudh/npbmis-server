import express from "express";
import { login, refreshToken, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/verifyandrefreshtoken", verifyToken, refreshToken);

export default router;
