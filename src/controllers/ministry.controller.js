import Ministry from "../models/ministry.model.js";

export const getAllMinistries = async (req, res) => {
  try {
    const ministries = await Ministry.findAll();
    return res.status(200).json(ministries);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching ministries", error });
  }
};

export const createMinistry  = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if ministry name is provided
    if (!name) {
      return res.status(400).json({ message: "Ministry name is required" });
    }

    // Create ministry
    const ministry = await Ministry.create({ name });
    return res.status(201).json(ministry);
  } catch (error) {
    return res.status(500).json({ message: "Error creating ministry", error });
  }
};
