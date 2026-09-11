const prisma = require("../utils/prisma");

const createProject = async (req, res) => {
  try {
    const { userId, projectName, description, status, startDate, endDate } = req.body;

    if (!userId || !projectName) {
      return res.status(400).json({
        message: "userId and projectName are required"
      });
    }

    const project = await prisma.project.create({
      data: {
        userId: Number(userId),
        projectName,
        description,
        status: status || "NOT_STARTED",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create project"
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true
      }
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch projects"
    });
  }
};

module.exports = {
  createProject,
  getProjects
};