import {
  PROJECT_ASSIGNED_TO_DATA_APPROVE,
  PROJECT_ASSIGNED_TO_DATA_SUBMIT,
} from "../constants/userRoles.js";
import Project from "../models/project.model.js";
import Sector from "../models/sector.model.js";
import { Op } from "sequelize"; // Sequelize operators for querying
import User from "../models/user.model.js";

export const getAllProjectsAssigned = async (req, res) => {
  try {
    const { userRole } = res.locals; // Assuming user role is available in res.locals
    const filter = {};

    // Define approval status based on user role
    let approvalStatuses;

    switch (userRole) {
      case "DATA_PREPARE":
        approvalStatuses = ["DRAFT", "SUBMISSION_REJECTED"];
        break;
      case "DATA_SUBMIT":
        approvalStatuses = ["PREPARED", "APPROVAL_REJECTED"];
        break;
      case "DATA_APPROVE":
        approvalStatuses = ["SUBMITTED"];
        break;
      default:
        return res.status(403).json({
          status: "failure",
          message: "You do not have permission to view these projects.",
        });
    }

    // Add the approval status filter to the query
    filter.approval_status = {
      [Op.in]: approvalStatuses, // Only include projects with one of the approval statuses
    };

    // Fetch projects based on the filter
    const projects = await Project.findAll({
      where: filter,
      include: [
        {
          model: Sector,
          attributes: ["name"], // Include sector name in the result
          required: false,
        },
      ],
    });

    // Map results to include sector_name and return them
    const projectsWithSectorName = projects.map((project) => ({
      ...project.toJSON(),
      sector_name: project.Sector ? project.Sector.name : null, // Add sector_name to each project
    }));

    return res.status(200).json({
      status: "success",
      data: projectsWithSectorName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, error });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const filter = {};
    const sector_id = res.locals.userSectorId;

    if (res.locals.userRole !== "SUPER_ADMIN") {
      filter.sector_id = sector_id;
    }
    const results = await Project.findAll({
      where: { ...filter },
      include: [
        {
          model: Sector,
          attributes: ["name"], // Only include the 'name' of the sector
          required: false, // This means the sector_name will be null if no sector is associated
        },
      ],
    });

    const projects = results.map((project) => {
      const { Sector, ...projectData } = project.toJSON(); // Exclude the Sector object
      return {
        ...projectData,
        sector_name: Sector ? Sector.name : null, // Add sector_name
      };
    });
    return res.status(200).json({ status: "success", data: projects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, error });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      sector_id,
      nepali_name,
      priority_code,
      budget_total_cost,
      budget_annual_allocation,
      time_period,
      beneficiaries,
      objectives,
      expected_outcomes,
      implementation_area,
      responsible_officer_name,
      responsible_officer_contact,
      responsible_officer_email,
      implementation_method,
      associated_documents,
      requested_by,
      sdg_code,
      sdg_name,
      gender_code,
      climate_code,
      strategic_code,
      project_nature,
      inception_status,
      priority,
      budget_code,
    } = req.body;

    const userId = res.locals.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    // Create the project in the database
    const project = await Project.create({
      name,
      description,
      status,
      sector_id,
      nepali_name,
      priority_code,
      budget_total_cost,
      budget_annual_allocation,
      time_period,
      beneficiaries,
      objectives,
      expected_outcomes,
      implementation_area,
      responsible_officer_name,
      responsible_officer_contact,
      responsible_officer_email,
      implementation_method,
      entry_by: user.getDataValue("user_id"),
      associated_documents,
      requested_by,
      sdg_code,
      sdg_name,
      gender_code,
      climate_code,
      strategic_code,
      project_nature,
      inception_status,
      priority,
      budget_code,
    });

    return res.status(201).json({
      status: "success",
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);

    return res.status(500).json({
      status: "failure",
      message: error.message + ". " + error.errors?.[0]?.message || "",
      source: "createProject",
    });
  }
};

export const saveDraftProject = async (req, res) => {
  try {
    const {
      project_id,
      name,
      description,
      status,
      sector_id,
      nepali_name,
      priority_code,
      budget_total_cost,
      budget_annual_allocation,
      time_period,
      beneficiaries,
      objectives,
      expected_outcomes,
      implementation_area,
      responsible_officer_name,
      responsible_officer_contact,
      responsible_officer_email,
      implementation_method,
      prepared_by,
      associated_documents,
      entry_by,
      requested_by,
      sdg_code,
      sdg_name,
      gender_code,
      climate_code,
      strategic_code,
      project_nature,
      inception_status,
      priority,
      budget_code,
    } = req.body;

    const userId = res.locals.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    if (!project_id) {
      return res.status(400).json({
        status: "failure",
        message: "Project ID is required",
      });
    }
    // Find the existing project by project_id
    const project = await Project.findOne({
      where: { project_id },
    });

    // If the project does not exist, return an error
    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project not found",
      });
    }

    // Update the project with the provided data
    await project.update({
      name,
      description,
      status,
      sector_id,
      nepali_name,
      priority_code,
      budget_total_cost,
      budget_annual_allocation,
      time_period,
      beneficiaries,
      objectives,
      expected_outcomes,
      implementation_area,
      responsible_officer_name,
      responsible_officer_contact,
      responsible_officer_email,
      implementation_method,
      prepared_by: user.getDataValue("user_id"),
      associated_documents,
      requested_by,
      sdg_code,
      sdg_name,
      gender_code,
      climate_code,
      strategic_code,
      project_nature,
      inception_status,
      priority,
      budget_code,
      approval_status: "DRAFT",
    });

    return res.status(200).json({
      status: "success",
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Error updating project:", error);

    return res.status(500).json({
      status: "failure",
      message: error.message + ". " + error.errors?.[0]?.message || "",
      source: "saveDraftProject",
    });
  }
};

export const getAProject = async (req, res) => {
  try {
    // Fetch the project by its primary key
    const project = await Project.findByPk(req.params.projectId);

    if (!project) {
      return res
        .status(404)
        .json({ status: "failure", message: "Project not found" });
    }

    // Check if the fields are not null and fetch user data for each
    const userFields = [
      "entry_by",
      "prepared_by",
      "submitted_by",
      "approved_by",
    ];
    const userNames = {};

    for (let field of userFields) {
      if (project[field] !== null) {
        const user = await User.findByPk(project[field]);

        if (user) {
          userNames[`${field}_name`] = `${user.first_name} ${user.last_name}`;
        }
      }
    }

    // Attach the user names to the project object
    const projectWithNames = { ...project.toJSON(), ...userNames };

    return res.status(200).json({ status: "success", data: projectWithNames });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failure", message: "Error fetching project", error });
  }
};

export const prepareProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { project_id: projectId } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    const userId = res.locals.userId;
    // Update the project's approval_status to "PREPARED"
    project.prepared_by = userId;
    project.approval_status = "PREPARED";

    // Save the updated project
    await project.save();

    return res.status(200).json({
      status: "success",
      message: "Project prepared successfully.",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Error submitting project",
      error: error.message,
    });
  }
};

export const submitProject = async (req, res) => {
  try {
    const { project_id } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { project_id } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    const userId = res.locals.userId;
    // Update the project's approval_status to "SUBMITTED"
    project.submitted_by = userId;
    project.approval_status = "SUBMITTED";

    // Save the updated project
    await project.save();

    return res.status(200).json({
      status: "success",
      message: "Project submitted successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Error submitting project",
      error: error.message,
    });
  }
};
export const approveProject = async (req, res) => {
  try {
    const { project_id } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { project_id } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    const userId = res.locals.userId;

    // Update the project's approval_status to "SUBMITTED"
    project.approved_by = userId;
    project.approval_status = "APPROVED";

    // Save the updated project
    await project.save();

    return res.status(200).json({
      status: "success",
      message: "Project approved successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Error submitting project",
      error: error.message,
    });
  }
};

export const rejectProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { project_id: projectId } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    // Update the project's approval_status to:
    let newStatus;
    if (
      res.locals.userRole === "DATA_APPROVE" &&
      PROJECT_ASSIGNED_TO_DATA_APPROVE.includes(
        project.dataValues.approval_status
      )
    ) {
      newStatus = "APPROVAL_REJECTED";
    } else if (
      res.locals.userRole === "DATA_SUBMIT" &&
      PROJECT_ASSIGNED_TO_DATA_SUBMIT.includes(
        project.dataValues.approval_status
      )
    ) {
      newStatus = "SUBMISSION_REJECTED";
    } else {
      return res.status(404).json({
        status: "failure",
        message:
          "You are trying to reject a project that is not assigned to you.",
      });
    }
    project.approval_status = newStatus;

    // Save the updated project
    await project.save();

    return res.status(200).json({
      status: "success",
      message: "Project rejected successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Error submitting project",
      error: error.message,
    });
  }
};
