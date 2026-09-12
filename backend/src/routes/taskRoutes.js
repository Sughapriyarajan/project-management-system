const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", authenticateToken, createTask);
router.get("/", authenticateToken, getTasks);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);
module.exports = router;