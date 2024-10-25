import Department from "../models/department.model.js";

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    return res.status(200).json(departments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching departments", error });
  }
};

// Controller function to create a new department
export const createDepartment = async (req, res) => {
  const { department_name, ministry_id } = req.body;

  try {
    // Validate input
    if (!department_name || !ministry_id) {
      return res
        .status(400)
        .json({ message: "Department name and ministry ID are required" });
    }

    // Check if the provided ministry_id exists in the Ministry table
    const ministry = await Ministry.findByPk(ministry_id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    // Create a new department
    const department = await Department.create({
      department_name,
      ministry_id,
    });

    // Send response with the newly created department
    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Error creating department", error });
  }
};
