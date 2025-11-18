const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function setupTestDb() {
  try {
    console.log('Setting up test database...');

    // Start in-memory MongoDB server
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    console.log('Test database URI:', mongoUri);

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    console.log('Test database connected successfully');

    // Create some sample data for testing
    const Bug = require('../src/models/Bug');

    const sampleBugs = [
      {
        title: 'Sample Bug 1',
        description: 'This is a sample bug for testing',
        status: 'open',
        priority: 'high',
        reporter: 'Test User 1',
        tags: ['sample', 'test']
      },
      {
        title: 'Sample Bug 2',
        description: 'Another sample bug for testing',
        status: 'in-progress',
        priority: 'medium',
        reporter: 'Test User 2',
        assignee: 'Developer 1',
        tags: ['sample']
      },
      {
        title: 'Sample Bug 3',
        description: 'Third sample bug for testing',
        status: 'resolved',
        priority: 'low',
        reporter: 'Test User 3',
        assignee: 'Developer 2',
        tags: ['sample', 'resolved']
      }
    ];

    await Bug.insertMany(sampleBugs);
    console.log('Sample data inserted');

    console.log('Test database setup complete');
    console.log(`Database URI: ${mongoUri}`);

    // Keep the process running for testing
    console.log('Test database is ready. Press Ctrl+C to stop.');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down test database...');
      await mongoose.disconnect();
      await mongoServer.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupTestDb();
}

module.exports = setupTestDb;
