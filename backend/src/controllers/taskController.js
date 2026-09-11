const prisma = require("../utils/prisma");

const createTask = async (req, res) => {
  try {
    const {
      projectId,
      taskName,
      description,
      priority,
      status,
      dueDate
    } = req.body;

    if (!projectId || !taskName) {
      return res.status(400).json({
        message: "projectId and taskName are required"
      });
    }

    const task = await prisma.task.create({
      data: {
        projectId: Number(projectId),
        taskName,
        description,
        priority: priority || "MEDIUM",
        status: status || "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create task"
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};

module.exports = {
  createTask,
  getTasks
};