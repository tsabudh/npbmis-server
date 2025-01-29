import Project from "../models/project.model.js";

export const getProjectsSummary = async (req, res) => {
  try {
    // Get total projects
    const totalProjects = await Project.count();

    // Get ongoing projects
    const ongoingProjects = await Project.count({
      where: {
        state: "ONGOING",
      },
    });

    // Get future projects (NEW_OR_UPCOMING)
    const futureProjects = await Project.count({
      where: {
        state: "NEW_OR_UPCOMING",
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        totalProjects,
        ongoingProjects,
        futureProjects,
      },
    });
  } catch (error) {
    console.error("Error fetching project summary:", error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
};
