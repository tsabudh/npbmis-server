import { hashPassword } from "../utils/passwordUtils.js";

import User from "../models/user.model.js";
import { sendLocalMail } from "../utils/mail.js";
import catchAsync from "../utils/catchAsync.js";
import Token from "../models/token.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
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

export const getMyDetails = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};
export const createUserDepreciated = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, role } = req.body;
    const password_hash = await hashPassword(password);
    console.log(password_hash);

    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password_hash,
      role,
    });

    if (user) {
      return res.status(201).json({
        status: "success",
        message: "User created successfully",
        user,
      });
    } else {
      throw new Error("Error creating user");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failure",
      message: error.message,
      source: "createUser",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { newPassword } = req.body;
    let updatedUser;

    if (!userId) {
      return res.status(400).json({
        status: "failure",
        message: "Something went wrong. Please log in again.",
      });
    }
    if (!newPassword) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide a new password.",
      });
    }

    const password_hash = await hashPassword(newPassword);

    const user = await User.findOne({
      where: { id: userId },
    });

    // If the user is found, update the password and save
    if (user) {
      user.password_hash = password_hash;
      updatedUser = await user.save();
    } else {
      return res.status(400).json({
        status: "failure",
        message: "Something went wrong. Please log in again.",
        source: "changePassword",
      });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message,
      source: "resetpassword",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { firstName, lastName, email, username, role, sectorId } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required.",
      });
    }

    // Find the user
    const user = await User.findOne({
      where: { id: userId },
    });

    // If the user is found, update the user and save
    if (user) {
      user.first_name = firstName;
      user.last_name = lastName;
      user.email = email;
      user.username = username;
      user.role = role;
      user.sector_id = sectorId;

      await user.save();

      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user,
      });
    } else {
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message,
      source: "updateUser",
    });
  }
};

export const sendPasswordReset = async (req, res) => {
  try {
    const { from, to, subject } = req.body;
    const userId = res.locals.userId;

    // Validate required fields
    if (!from || !to || !subject) {
      return res.status(400).json({
        status: "failure",
        message: "All fields are required.",
      });
    }

    const [token, created] = await Token.findOrCreate({
      where: {
        type: "PASSWORD_RESET_TOKEN",
        user_id: userId,
      },
      defaults: {
        type: "PASSWORD_RESET_TOKEN",
        user_id: userId,
      },
    });

    console.log("token", token, "created", created);

    if (!created) {
      return res.status(400).json({
        status: "failure",
        message:
          "Password reset token already exists for this user. Please visit your email to reset your password.",
      });
    }
    const mailOptions = {
      from,
      to,
      subject,
      text: `Your password reset token is: ${token.code}`,
    };

    sendLocalMail(mailOptions);

    // Send success response
    return res.status(201).json({
      status: "success",
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Check for Sequelize validation errors
    const errorMessage =
      error.errors?.[0]?.message ||
      error.message ||
      "An error occurred while creating the user.";

    return res.status(500).json({
      status: "failure",
      message: errorMessage,
      source: "createUser",
    });
  }
};
