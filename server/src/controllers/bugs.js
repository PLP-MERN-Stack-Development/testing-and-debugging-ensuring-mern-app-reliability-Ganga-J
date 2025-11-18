const Bug = require('../models/Bug');
const { validationResult } = require('express-validator');

// Get all bugs with optional filtering
exports.getBugs = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const bugs = await Bug.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Bug.countDocuments(filter);

    res.json({
      bugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bugs:', error);
    res.status(500).json({ error: 'Failed to fetch bugs' });
  }
};

// Get single bug by ID
exports.getBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.json(bug);
  } catch (error) {
    console.error('Error fetching bug:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid bug ID' });
    }
    res.status(500).json({ error: 'Failed to fetch bug' });
  }
};

// Create new bug
exports.createBug = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = new Bug(req.body);
    const savedBug = await bug.save();
    res.status(201).json(savedBug);
  } catch (error) {
    console.error('Error creating bug:', error);
    res.status(500).json({ error: 'Failed to create bug' });
  }
};

// Update bug
exports.updateBug = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    res.json(bug);
  } catch (error) {
    console.error('Error updating bug:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid bug ID' });
    }
    res.status(500).json({ error: 'Failed to update bug' });
  }
};

// Delete bug
exports.deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    console.error('Error deleting bug:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid bug ID' });
    }
    res.status(500).json({ error: 'Failed to delete bug' });
  }
};
