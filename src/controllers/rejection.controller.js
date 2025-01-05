import Rejection from "../models/rejection.model.js";
import Sector from "../models/sector.model.js";

export const getRejectionMessage = async (req, res) => {
  try {
    const { projectId } = req.query;

    const rejection = await Rejection.findOne({
      where: {
        id: projectId,
      },
    });
    return res.status(200).json({
      status: "success",
      data: rejection,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failure", message: "Error fetching users", error });
  }
};
