const Task = require('../models/Task');

// @route   POST /api/tasks
// @access  Admin, Manager
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/tasks
// @access  All logged in users
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'Admin') {
      tasks = await Task.find()
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
    } else {
      tasks = await Task.find({
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      })
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/tasks/project/:projectId
// @access  All logged in users
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/tasks/:id
// @access  All logged in users
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
// @access  Admin, Manager
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTasksByProject,
  updateTask,
  deleteTask
};