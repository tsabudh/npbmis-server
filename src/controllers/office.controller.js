import Palika from "../models/palika.model.js";

export const createNewPalika = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if office name is provided
    if (!name) {
      return res.status(400).json({ message: "Palika name is required" });
    }

    // Create office
    const palika = await Palika.create({ name });
    return res.status(201).json(palika);
  } catch (error) {
    return res.status(500).json({ message: "Error creating palika", error });
  }
};
