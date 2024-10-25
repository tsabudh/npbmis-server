import { Router } from "express";
import { createDepartment, getAllDepartments } from "../controllers/department.controller.js";

const router = Router();

router.get("/", getAllDepartments);
router.post("/", createDepartment);

export default router;
