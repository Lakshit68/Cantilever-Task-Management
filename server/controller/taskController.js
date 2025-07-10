const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Find tasks belonging to the authenticated user
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Add a new task
// @route   POST /api/tasks
// @access  Private
const addTask = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a title' });
  }

  try {
    const newTask = new Task({
      title,
      user: req.user.id, // Associate task with the authenticated user
    });

    const createdTask = await newTask.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, completed } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    task.title = title || task.title;
    task.completed = typeof completed === 'boolean' ? completed : task.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
