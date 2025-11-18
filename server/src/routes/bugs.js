const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bugsController = require('../controllers/bugs');

// Validation middleware
const validateBug = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority value'),
  body('reporter')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Reporter name is required'),
  body('assignee')
    .optional()
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// Routes
router.get('/', bugsController.getBugs);
router.get('/:id', bugsController.getBug);
router.post('/', validateBug, bugsController.createBug);
router.put('/:id', validateBug, bugsController.updateBug);
router.delete('/:id', bugsController.deleteBug);

module.exports = router;
