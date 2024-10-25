import { hashPassword } from "../utils/passwordUtils.js";

import User from "../models/user.model.js";


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

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, role } = req.body;
    //! MINISTRY AND DEPARTMENT REQUIRED?
    const password_hash = await hashPassword(password);

    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password_hash,
      role,
    });
    return res
      .status(201)
      .json({ status: "success", message: "User created successfully", user });
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
      where: { user_id: userId },
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
