import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const resetPassword = async (req, res) => {
  try {
    const newPassword = "test123";
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "failure", message: "Provide a userId." });
    }
    const password_hash = await hashPassword(newPassword);

    const user = await User.update(
      { password_hash },
      {
        where: { user_id: userId },
        returning: true, // Only works in PostgreSQL to return updated rows directly
        limit: 1, // Limit the update to only one row
      }
    );
    console.log(user[0]);
    if (user[0] !== 0)
      return res
        .status(200)
        .json({ status: "success", message: "Password reset successfully" });
    else throw new Error("User not found with the provided userId.");
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message,
      source: "resetpassword",
    });
  }
};
