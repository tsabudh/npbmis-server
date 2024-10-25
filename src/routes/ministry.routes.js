import { Router } from "express";
import Ministry from "../models/ministry.model.js";
import { getAllMinistries } from "../controllers/ministry.controller.js";

const router = Router();

// Create a Ministry
router.post("/", getAllMinistries);

// Get all Ministries
router.get("/", async (req, res) => {
  try {
    const ministries = await Ministry.findAll();
    return res.status(200).json(ministries);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching ministries", error });
  }
});

export default router;
