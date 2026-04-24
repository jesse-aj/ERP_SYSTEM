const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, managerOrAdmin, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, managerOrAdmin, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, managerOrAdmin, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;