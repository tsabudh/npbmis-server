import { Router } from "express";
import {
  changePassword,
  getAllUsers,
  getMyDetails,
  sendPasswordReset,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllUsers);
router.get("/me", getMyDetails);
router.post("/changePassword", changePassword);
router.patch("/update", updateUser);

router.post("/sendPasswordReset", sendPasswordReset);

export default router;
