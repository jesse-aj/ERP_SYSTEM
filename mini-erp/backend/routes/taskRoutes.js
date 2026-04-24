const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect, managerOrAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, managerOrAdmin, createTask);
router.get('/', protect, getTasks);
router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, managerOrAdmin, deleteTask);

module.exports = router;