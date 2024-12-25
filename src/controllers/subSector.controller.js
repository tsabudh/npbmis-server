import Sector from "../models/sector.model.js";
import SubSector from "../models/subSector.model.js";

export const getAllSubSectors = async (req, res) => {
  try {
    const users = await SubSector.findAll();
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failure", message: error.message, error });
  }
};
