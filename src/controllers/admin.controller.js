import User from "../models/user.model.js";
import { hashPassword } from "../utils/passwordUtils.js";
import catchAsync from "../utils/catchAsync.js";
import { ALL_ADMINS } from "../constants/userConstants.js";
import Department from "../models/department.model.js";
import StrategyCode from "../models/strategyCode.model.js";
import Palika from "../models/palika.model.js";
import { where } from "sequelize";

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

    const user = await User.findOne({ where: { id: userId } });

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

export const getAllUsers = catchAsync(async (req, res) => {
  const where = {};

  const users = await User.findAll({
    where,
  });

  return res.status(200).json({
    status: "success",
    data: users,
  });
});

export const postSignupAdmin = catchAsync(async (req, res) => {
  const { first_name, last_name, email, username, password, role, palika_id } =
    req.body;

  const requiredFields = {
    first_name,
    last_name,
    email,
    username,
    password,
    role,
    palika_id,
  };

  // Check for missing fields
  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "failure",
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  if (!ALL_ADMINS.includes(role)) {
    return res.status(400).json({
      status: "failure",
      message: "Can't create admin with this role.",
    });
  }
  const password_hash = await hashPassword(password);
  const user = await User.create({
    palika_id,
    jurisdiction_level: "PALIKA",
    first_name: first_name,
    last_name: last_name,
    email,
    username,
    password_hash,
    role,
  });

  user.password_hash = undefined;

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    user,
  });
});

export const createUser = catchAsync(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    role,
    palika_id,
    jurisdiction_level,
    jurisdiction_wards,
    jurisdiction_departments,
  } = req.body;

  const requiredFields = {
    first_name,
    last_name,
    email,
    username,
    password,
    role,
    palika_id,
    jurisdiction_level,
  };

  // Check for missing fields
  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "failure",
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // Hash the password
  const password_hash = await hashPassword(password);

  // Create a new instance of the User model
  const user = User.build({
    first_name: first_name,
    last_name: last_name,
    email,
    username,
    password_hash,
    role,
    palika_id,
    jurisdiction_level,
    jurisdiction_wards,
    jurisdiction_departments,
  });

  // Save the user to the database
  await user.save();

  // Remove the password hash from the user object
  user.password_hash = undefined;

  // Send success response
  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    user,
  });
});

export const postUpdatePalikaWards = catchAsync(async (req, res) => {
  const { wards } = req.body;
  if (!wards) {
    return res.status(400).json({
      status: "failure",
      message: "Wards are required",
    });
  }

  // Get the palika of the ADMIN
  const userId = res.locals.userId;
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(400).json({
      status: "failure",
      message:
        "Attempted to update wards through credentials of a non-existent user",
    });
  }
  const palika = await user.getPalika();

  if (!palika) {
    return res.status(400).json({
      status: "failure",
      message: "User is not associated with any palika!",
    });
  }

  // Update the wards
  await palika.update({ wards }, { returning: true });

  // Send success response
  return res.status(201).json({
    status: "success",
    message: "Wards created/updated successfully",
  });
});

export const postCreateDepartment = catchAsync(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "failure",
      message: "name is required",
    });
  }

  const userPalikaId = res.locals.userPalikaId;

  const department = await Department.create({
    name,
    palika_id: userPalikaId,
  });

  return res.status(201).json({
    status: "success",
    message: "Department created successfully",
    department,
  });
});

export const postBulkCreateStrategyCodes = catchAsync(async (req, res) => {
  const { strategyCodes } = req.body;

  // Validate input structure
  if (!Array.isArray(strategyCodes) || strategyCodes.length === 0) {
    return res.status(400).json({
      status: "failure",
      message: "strategyCodes must be a non-empty array.",
    });
  }

  // Validate each strategy code
  const invalidEntries = strategyCodes.filter(
    (code) => typeof code.code !== "string" || typeof code.label !== "string"
  );

  if (invalidEntries.length > 0) {
    return res.status(400).json({
      status: "failure",
      message:
        "Each strategy code must have both a 'code' and 'label' as strings.",
      invalidEntries,
    });
  }

  // Step 1: Delete all existing strategy codes for this palika
  const palikaId = res.locals.userPalikaId;
  await StrategyCode.destroy({
    where: {
      palika_id: palikaId,
    },
  });

  // Step 2: Bulk create new strategy codes for the palika
  const createdStrategyCodes = await StrategyCode.bulkCreate(
    strategyCodes.map((item) => ({
      code: item.code,
      label: item.label,
      palika_id: palikaId,
    }))
  );

  res.status(201).json({
    status: "success",
    message: `${createdStrategyCodes.length} strategy codes created successfully.`,
    strategyCodes: createdStrategyCodes,
  });
});

export const patchStrategyCode = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { code, label } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "failure",
      message: "'id' param must be provided.",
    });
  }

  // Validate input
  if (!code || !label) {
    return res.status(400).json({
      status: "failure",
      message: "Both 'code' and 'label' must be provided in payload.",
    });
  }

  // Find the strategy code by ID
  const strategyCode = await StrategyCode.findByPk(id);

  // Check if strategy code exists
  if (!strategyCode) {
    return res.status(404).json({
      status: "failure",
      message: "Strategy code not found.",
    });
  }

  // Update the strategy code with new values
  strategyCode.code = code;
  strategyCode.label = label;

  // Save the changes
  await strategyCode.save();

  res.status(200).json({
    status: "success",
    message: "Strategy code updated successfully.",
    strategyCode,
  });
});

export const deleteStrategyCode = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Find the strategy code by ID
  const strategyCode = await StrategyCode.findByPk(id);

  // Check if strategy code exists
  if (!strategyCode) {
    return res.status(404).json({
      status: "failure",
      message: "Strategy code not found.",
    });
  }

  // Delete the strategy code
  await strategyCode.destroy();

  res.status(200).json({
    status: "success",
    message: "Strategy code deleted successfully.",
  });
});

export const postCreateStrategyCode = catchAsync(async (req, res) => {
  const { code, label } = req.body;

  // Validate input
  if (!code || !label) {
    return res.status(400).json({
      status: "failure",
      message: "Both 'code' and 'label' must be provided in payload.",
    });
  }

  // Get the palika of the ADMIN
  const palikaId = res.locals.userPalikaId;

  // Create the strategy code
  const strategyCode = await StrategyCode.create({
    code,
    label,
    palika_id: palikaId,
  });

  res.status(201).json({
    status: "success",
    message: "Strategy code created successfully.",
    strategyCode,
  });
});

export const getAdminsPalika = catchAsync(async (req, res) => {
  const userPalikaId = res.locals.userPalikaId;
  const palika = await Palika.findOne({
    where: { id: userPalikaId },
    include: [{ model: Department }, { model: StrategyCode }],
  });

  if (!palika) {
    return res.status(400).json({
      status: "failure",
      message: "Fatal: Admin is not associated with any palika",
    });
  }

  return res.status(200).json({
    status: "success",
    data: palika,
  });
});

export const patchUpdatePalikaDetails = catchAsync(async (req, res) => {
  const { name, address } = req.body;

  // Validate input
  if (!name && !address) {
    return res.status(400).json({
      status: "failure",
      message: "Either 'name' or 'address' must be provided in payload.",
    });
  }

  // Get the palika of the ADMIN
  const palikaId = res.locals.userPalikaId;

  // Update the palika details
  await Palika.update({ name, address }, { where: { id: palikaId } });
  const updatedPalika = await Palika.findByPk(palikaId);
  res.status(201).json({
    status: "success",
    message: "Palika details updated successfully.",
    updatedPalika,
  });
});
