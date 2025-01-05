import express from "express";
import { authorizeOnly, verifyToken } from "../middlewares/auth.js";
import {
  createUser,
  deleteStrategyCode,
  getAllUsers,
  patchStrategyCode,
  postBulkCreateStrategyCodes,
  postCreateDepartment,
  postCreateStrategyCode,
  postUpdatePalikaWards,
  resetPassword,
} from "../controllers/admin.controller.js";
import { ALL_ADMINS } from "../constants/userConstants.js";
import { postSignupAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signUp", postSignupAdmin);
// Limit the authority to only SUPER_ADMIN
router.use(verifyToken, authorizeOnly(ALL_ADMINS));

router.post("/user/create", authorizeOnly(ALL_ADMINS), createUser);
router.post("/user/get", getAllUsers);
router.post("/user/resetpassword", resetPassword);

router.post("/palika/wards", postUpdatePalikaWards);

router.post("/department/create", postCreateDepartment);

router.post("/strategyCodes/bulkCreate",postBulkCreateStrategyCodes);
router.post("strategyCodes/create", postCreateStrategyCode);
router.patch("/strategyCodes/update", patchStrategyCode);
router.delete("/strategyCodes/delete", deleteStrategyCode);

export default router;
