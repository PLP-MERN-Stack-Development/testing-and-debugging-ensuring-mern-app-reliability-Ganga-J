const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');

// Reset database for testing (only in development)
router.post('/reset', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
      return res.status(403).json({ error: 'Not allowed in production' });
    }

    await Bug.deleteMany({});
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Get test data
router.get('/data', async (req, res) => {
  try {
    const bugs = await Bug.find({});
    res.json({ bugs });
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({ error: 'Failed to fetch test data' });
  }
});

module.exports = router;
