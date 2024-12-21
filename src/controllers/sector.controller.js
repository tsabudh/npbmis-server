import Sector from "../models/sector.model.js";

export const getAllSectors = async (req, res) => {
  try {
    const users = await Sector.findAll();
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failure", message: "Error fetching users", error });
  }
};
