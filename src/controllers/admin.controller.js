import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { Op } from "sequelize";

export const resetPassword = async (req, res) => {
  try {
    const newPassword = "test123";
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "failure", message: "Provide a userId." });
    }
    const hashedPassword = await hashPassword(newPassword);

    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      // If no user is found with the provided userId, throw an error
      throw new Error("User not found with the provided userId.");
    }

    // Check if the user role is "SUPER_ADMIN"
    if (user.role === "SUPER_ADMIN") {
      throw new Error("Can't reset password of SUPER_ADMIN.");
    }

    // Update the password hash and save the user
    user.password_hash = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ status: "success", message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message,
      source: "resetpassword",
    });
  }
};
