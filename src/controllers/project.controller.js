import {
  DATA_APPROVE_ROLES,
  DATA_DRAFT_ROLES,
  PROJECT_ASSIGNED_TO_DATA_APPROVE,
  PROJECT_ASSIGNED_TO_DATA_SUBMIT,
} from "../constants/userConstants.js";
import Project from "../models/project.model.js";
import Sector from "../models/sector.model.js";
import { Op } from "sequelize"; // Sequelize operators for querying
import User from "../models/user.model.js";
import sequelize from "../utils/database.js";
import Rejection from "../models/rejection.model.js";
import Notification from "../models/notification.model.js";
import { createPalikaNotification } from "../utils/notification.js";
import {
  PROJECT_APPROVABLE,
  PROJECT_EVALUABLE,
  PROJECT_SUBMITTABLE,
  PROJECT_VERIFIABLE,
  SDG_CODES,
} from "../constants/projectConstants.js";

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
    const filter = {
      approval_status: {
        [Op.ne]: "DRAFT",
      },
    };
    const sector_id = res.locals.userDepartmentId;

    if (!DATA_APPROVE_ROLES.includes(res.locals.userRole)) {
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
      annual_allocation,
      associated_documents,
      beneficiaries_dalit,
      beneficiaries_diff_abled,
      beneficiaries_female,
      beneficiaries_indigenous,
      beneficiaries_janajati,
      beneficiaries_male,
      beneficiaries_population,
      beneficiaries_total_houses,
      budget_cycle_type,
      budget_term_period,
      budget,
      climate_code,
      description,
      expected_outcomes,
      funding_policy,
      funding_source,
      gender_code,
      id,
      implementation_area,
      implementation_method,
      implementation_wards,
      inception_status,
      name,
      nepali_name,
      objectives,
      priority_code,
      priority,
      project_nature,
      requested_by,
      responsible_officer_contact,
      responsible_officer_email,
      responsible_officer_name,
      sdg_code,
      sector_id,
      selected_by,
      selected_date,
      selection_document,
      selection_status,
      state,
      strategic_code_id,
      sub_sector_id,
    } = req.body;

    const userId = res.locals.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    // Create the project in the database
    const project = await Project.create({
      annual_allocation,
      approval_status: "DRAFT",
      associated_documents,
      beneficiaries_dalit,
      beneficiaries_diff_abled,
      beneficiaries_female,
      beneficiaries_indigenous,
      beneficiaries_janajati,
      beneficiaries_male,
      beneficiaries_population,
      beneficiaries_total_houses,
      budget_cycle_type,
      budget_term_period,
      budget,
      climate_code,
      description,
      entry_by: user.getDataValue("id"),
      expected_outcomes,
      funding_policy,
      funding_source,
      gender_code,
      id,
      implementation_area,
      implementation_method,
      implementation_wards,
      inception_status,
      name,
      nepali_name,
      objectives,
      prepared_by: user.getDataValue("id"),
      priority_code,
      priority,
      project_nature,
      requested_by,
      responsible_officer_contact,
      responsible_officer_email,
      responsible_officer_name,
      sdg_code: SDG_CODES[parseInt(sdg_code)].code,
      sdg_name: SDG_CODES[parseInt(sdg_code)].name,
      sector_id,
      selected_by,
      selected_date,
      selection_document,
      selection_status,
      state,
      strategic_code_id,
      sub_sector_id,
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
      id,
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

    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Project ID is required",
      });
    }
    // Find the existing project by id
    const project = await Project.findOne({
      where: { id },
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
      prepared_by: user.getDataValue("id"),
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

export const getDraftProjects = async (req, res) => {
  try {
    const { userRole } = res.locals; // Assuming user role is available in res.locals
    const filter = {};

    // Define approval status based on user role
    let approvalStatus = "DRAFT";

    if (!DATA_DRAFT_ROLES.includes("DATA_PREPARE")) {
      return res.status(403).json({
        status: "failure",
        message: "You do not have permission to view these projects.",
      });
    }

    // Add the approval status filter to the query
    filter.approval_status = approvalStatus;
    filter.entry_by = res.locals.userId;

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
      sector_name: project.Sector ? project.Sector.name : null,
      Sector: null,
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

export const postVerifyProject = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { id } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided 'id' not found",
      });
    }

    if (project.approval_status === "VERIFIED") {
      return res.status(400).json({
        status: "failure",
        message: "Project is already verified.",
      });
    }

    if (!PROJECT_VERIFIABLE.includes(project.approval_status)) {
      return res.status(400).json({
        status: "failure",
        message: "Project is not VERIFIABLE.",
      });
    }

    const userId = res.locals.userId;
    const userPalikaId = res.locals.userPalikaId;

    // Update the project's approval_status to "VERIFIED"
    project.verified_by = userId;
    project.approval_status = "VERIFIED";

    // Save the updated project
    await project.save();

    // const notification = await createPalikaNotification({
    //   palika_id: userPalikaId,
    //   type: "PROJECT_ASSIGNED:SUBMIT",
    //   message: `Project ${project.name} has been prepared by ${userId}`,
    //   redirect_id: project.id,
    // });

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

export const postSubmitProject = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { id } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }
    if (project.approval_status === "SUBMITTED") {
      return res.status(400).json({
        status: "failure",
        message: "Project is already submitted.",
      });
    }

    if (!PROJECT_SUBMITTABLE.includes(project.approval_status)) {
      return res.status(400).json({
        status: "failure",
        message: "Project is not SUBMITTABLE.",
      });
    }

    const userId = res.locals.userId;
    const userPalikaId = res.locals.userPalikaId;

    //TODO don't expose string 'SUBMITTED' directly
    // Update the project's approval_status to "SUBMITTED"
    project.submitted_by = userId;
    project.approval_status = "SUBMITTED";

    // Save the updated project
    await project.save();

    // const notification = await createPalikaNotification({
    //   palika_id: userPalikaId,
    //   type: "PROJECT_APPROVAL_STATUS:SUBMITTED",
    //   message: `Project ${project.name} has been submitted by ${userId}`,
    //   redirect_id: project.id,
    // });

    return res.status(200).json({
      status: "success",
      message: "Project submitted successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failure",
      message: "Error submitting project",
      error: error.message,
    });
  }
};
export const postApproveProject = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { id } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    if (project.approval_status === "APPROVED") {
      return res.status(400).json({
        status: "failure",
        message: "Project is already approved.",
      });
    }
    if (!PROJECT_APPROVABLE.includes(project.approval_status)) {
      return res.status(400).json({
        status: "failure",
        message: "Project is not APPROVABLE.",
      });
    }

    const userId = res.locals.userId;
    const userPalikaId = res.locals.userPalikaId;

    // Update the project's approval_status to "SUBMITTED"
    project.approved_by = userId;
    project.approval_status = "APPROVED";

    // Save the updated project
    await project.save();

    // const notification = await createPalikaNotification({
    //   palikaId: userPalikaId,
    //   type: "PROJECT_NOTICE",
    //   message: `Project ${project.name} has been approved by ${userId}`,
    //   redirectId: project.id,
    // });

    return res.status(200).json({
      status: "success",
      message: "Project approved successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: "Error approving project",
      error: error.message,
    });
  }
};

export const postEvaluateProject = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the project by its ID
    const project = await Project.findOne({ where: { id } });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    if (project.approval_status === "EVALUATED") {
      return res.status(400).json({
        status: "failure",
        message: "Project is already evaluated.",
      });
    }
    if (!PROJECT_EVALUABLE.includes(project.approval_status)) {
      return res.status(400).json({
        status: "failure",
        message: "Project is not EVALUABLE.",
      });
    }

    const userId = res.locals.userId;

    // Update the project's approval_status to "SUBMITTED"
    project.approved_by = userId;
    project.approval_status = "EVALUATED";

    // Save the updated project
    await project.save();

    // const notification = await createPalikaNotification({
    //   palikaId: userPalikaId,
    //   type: "PROJECT_NOTICE",
    //   message: `Project ${project.name} has been approved by ${userId}`,
    //   redirectId: project.id,
    // });

    return res.status(200).json({
      status: "success",
      message: "Project evaluated successfully",
      project,
    });
  } catch (error) {
    
    return res.status(500).json({
      status: "failure",
      message: "Error approving project",
      error: error.message,
    });
  }
};

// Reject a project
export const rejectProject = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const { id, message } = req.body;

    const userId = res.locals.userId;
    const userPalikaId = res.locals.userPalikaId;

    // Ensure rejection message is provided
    if (!message) {
      return res.status(400).json({
        status: "failure",
        message: "Rejection message:'message' is required",
      });
    }
    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Field projectId is required",
      });
    }

    // Find the project by its ID
    const project = await Project.findOne({
      where: { id },
      transaction, // Include the transaction
    });

    if (!project) {
      return res.status(404).json({
        status: "failure",
        message: "Project of provided Id not found",
      });
    }

    // Determine the new approval status
    let newStatus;
    if (
      res.locals.userRole === "DATA_APPROVE" &&
      PROJECT_ASSIGNED_TO_DATA_APPROVE.includes(
        project.dataValues.approval_status
      )
    ) {
      newStatus = "SUBMISSION_REJECTED";
    } else if (
      res.locals.userRole === "DATA_SUBMIT" &&
      PROJECT_ASSIGNED_TO_DATA_SUBMIT.includes(
        project.dataValues.approval_status
      )
    ) {
      newStatus = "SUBMISSION_REJECTED";
    } else {
      return res.status(403).json({
        status: "failure",
        message:
          "You are trying to reject a project that is not assigned to you.",
      });
    }

    // Update project's approval_status
    project.approval_status = newStatus;
    await project.save({ transaction }); // Save within the transaction

    // DelEte previous rejection record
    await Rejection.destroy({
      where: {
        id,
      },
      transaction,
    });

    // Create a rejection record
    await Rejection.create(
      {
        message,
        id,
        rejected_by: res.locals.userId, // Assuming user ID is stored in res.locals
      },
      { transaction }
    );

    // Commit the transaction if all operations succeed
    await transaction.commit();

    const notification = await createPalikaNotification({
      palikaId: userPalikaId,
      type: "PROJECT_NOTICE",
      message: `Project ${project.name} has been REJECTED by ${userId}`,
      redirectId: project.id,
    });

    return res.status(200).json({
      status: "success",
      message: "Project rejected successfully",
      project,
    });
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    return res.status(500).json({
      status: "failure",
      message: "Error rejecting project",
      error: error.message,
    });
  }
};
