// Utility functions for data validation

const validateBugData = (bugData) => {
  const errors = [];

  // Title validation
  if (!bugData.title || typeof bugData.title !== 'string') {
    errors.push('Title is required');
  } else if (bugData.title.trim().length === 0) {
    errors.push('Title cannot be empty');
  } else if (bugData.title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }

  // Description validation
  if (!bugData.description || typeof bugData.description !== 'string') {
    errors.push('Description is required');
  } else if (bugData.description.trim().length === 0) {
    errors.push('Description cannot be empty');
  } else if (bugData.description.length > 1000) {
    errors.push('Description cannot be more than 1000 characters');
  }

  // Status validation
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (bugData.status && !validStatuses.includes(bugData.status)) {
    errors.push('Invalid status value');
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (bugData.priority && !validPriorities.includes(bugData.priority)) {
    errors.push('Invalid priority value');
  }

  // Reporter validation
  if (!bugData.reporter || typeof bugData.reporter !== 'string') {
    errors.push('Reporter is required');
  } else if (bugData.reporter.trim().length === 0) {
    errors.push('Reporter cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateBugData
};
