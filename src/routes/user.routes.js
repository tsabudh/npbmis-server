import { Router } from "express";
import {
  changePassword,
  createUser,
  getAllUsers,
  getMyDetails,
} from "../controllers/user.controller.js";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/", createUser);
router.use(verifyToken);

router.get("/", getAllUsers);
router.get("/me", getMyDetails);
router.post("/changepassword", changePassword);

export default router;
