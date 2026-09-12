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
const project = await prisma.project.findFirst({
  where: {
    id: Number(projectId),
    userId: req.user.userId
  }
});

if (!project) {
  return res.status(404).json({
    message: "Project not found"
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
  where: {
    project: {
      userId: req.user.userId
    }
  },
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
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      taskName,
      description,
      priority,
      status,
      dueDate
    } = req.body;

    if (!taskName) {
      return res.status(400).json({
        message: "taskName is required"
      });
    }
const existingTask = await prisma.task.findFirst({
  where: {
    id: Number(id),
    project: {
      userId: req.user.userId
    }
  }
});

if (!existingTask) {
  return res.status(404).json({
    message: "Task not found"
  });
}
    const task = await prisma.task.update({
      where: {
        id: Number(id)
      },
      data: {
        taskName,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update task"
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
const existingTask = await prisma.task.findFirst({
  where: {
    id: Number(id),
    project: {
      userId: req.user.userId
    }
  }
});

if (!existingTask) {
  return res.status(404).json({
    message: "Task not found"
  });
}
    await prisma.task.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete task"
    });
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};