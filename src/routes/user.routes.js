import { Router } from "express";
import {
    changePassword,
  createUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/changepassword", changePassword);




export default router;
