import Project from "../models/project.model.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    return res.status(200).json({ status: "success", data: projects });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching projects", error });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      sector,
      nepaliName,
      priority,
      budgetCode,
      identificationStage,
      appraisalStage,
    } = req.body;

    const project = await Project.create({
      name,
      description,
      status,
      priority,
      sector,
      nepali_name: nepaliName,
      budget_code: budgetCode,
      identification_stage: identificationStage,
      appraisal_stage: appraisalStage,
    });
    return res.status(201).json({
      status: "success",
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "failure",
      message: error.message + ". " + error.errors[0]?.message,
      source: "createUser",
    });
  }
};

export const getAProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ status: "failure", message: "Project not found" });
    }
    return res.status(200).json({ status: "success", data: project });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failure", message: "Error fetching project", error });
  }
};
