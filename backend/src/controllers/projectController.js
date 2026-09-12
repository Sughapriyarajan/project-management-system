const prisma = require("../utils/prisma");

const createProject = async (req, res) => {
  try {
    const { projectName, description, status, startDate, endDate } = req.body;

    if (!projectName || !projectName.trim()) {
  return res.status(400).json({
    message: "projectName is required"
  });
}

    const project = await prisma.project.create({
      data: {
       userId: req.user.userId,
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
  where: {
    userId: req.user.userId
  },
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
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: Number(id),
        userId: req.user.userId
      },
      include: {
        tasks: true
      }
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch project"
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, description, status, startDate, endDate } = req.body;

    if (!projectName) {
      return res.status(400).json({
        message: "projectName is required"
      });
    }

   const existingProject = await prisma.project.findFirst({
  where: {
    id: Number(id),
    userId: req.user.userId
  }
});

if (!existingProject) {
  return res.status(404).json({
    message: "Project not found"
  });
}

const project = await prisma.project.update({
  where: {
    id: Number(id)
  },
      data: {
        projectName,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.json({
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update project"
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

  const existingProject = await prisma.project.findFirst({
  where: {
    id: Number(id),
    userId: req.user.userId
  }
});

if (!existingProject) {
  return res.status(404).json({
    message: "Project not found"
  });
}

await prisma.project.delete({
  where: {
    id: Number(id)
  }
});

    res.json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete project"
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};