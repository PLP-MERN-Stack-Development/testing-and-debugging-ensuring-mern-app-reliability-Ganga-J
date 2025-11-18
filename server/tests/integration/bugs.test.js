const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

describe('Bugs API Integration Tests', () => {
  let testBugId;

  // Clean up after each test
  afterEach(async () => {
    await Bug.deleteMany({});
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug with valid data', async () => {
      const newBug = {
        title: 'Test Bug Title',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
        assignee: 'Jane Smith',
        tags: ['frontend', 'urgent']
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(newBug);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(newBug.title);
      expect(res.body.description).toBe(newBug.description);
      expect(res.body.status).toBe(newBug.status);
      expect(res.body.priority).toBe(newBug.priority);
      expect(res.body.reporter).toBe(newBug.reporter);
      expect(res.body.assignee).toBe(newBug.assignee);
      expect(res.body.tags).toEqual(newBug.tags);

      testBugId = res.body._id;
    });

    it('should return 400 for invalid data', async () => {
      const invalidBug = {
        // Missing required fields
        status: 'open'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should return 400 for title too long', async () => {
      const invalidBug = {
        title: 'a'.repeat(101),
        description: 'Valid description',
        reporter: 'John Doe'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidBug);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      // Create test bugs
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description 1',
          status: 'open',
          priority: 'high',
          reporter: 'Reporter 1'
        },
        {
          title: 'Bug 2',
          description: 'Description 2',
          status: 'resolved',
          priority: 'medium',
          reporter: 'Reporter 2'
        }
      ]);
    });

    it('should return all bugs', async () => {
      const res = await request(app).get('/api/bugs');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('bugs');
      expect(Array.isArray(res.body.bugs)).toBe(true);
      expect(res.body.bugs.length).toBe(2);
      expect(res.body).toHaveProperty('total');
      expect(res.body.total).toBe(2);
    });

    it('should filter bugs by status', async () => {
      const res = await request(app).get('/api/bugs?status=open');

      expect(res.status).toBe(200);
      expect(res.body.bugs.length).toBe(1);
      expect(res.body.bugs[0].status).toBe('open');
    });

    it('should filter bugs by priority', async () => {
      const res = await request(app).get('/api/bugs?priority=high');

      expect(res.status).toBe(200);
      expect(res.body.bugs.length).toBe(1);
      expect(res.body.bugs[0].priority).toBe('high');
    });

    it('should paginate results', async () => {
      // Create more bugs for pagination
      const bugs = [];
      for (let i = 0; i < 15; i++) {
        bugs.push({
          title: `Bug ${i + 3}`,
          description: `Description ${i + 3}`,
          status: 'open',
          priority: 'medium',
          reporter: `Reporter ${i + 3}`
        });
      }
      await Bug.insertMany(bugs);

      const res = await request(app).get('/api/bugs?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.bugs.length).toBe(10);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe('1');
    });
  });

  describe('GET /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test Description',
        reporter: 'Test Reporter'
      });
      bugId = bug._id;
    });

    it('should return a bug by ID', async () => {
      const res = await request(app).get(`/api/bugs/${bugId}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(bugId.toString());
      expect(res.body.title).toBe('Test Bug');
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Bug not found');
    });

    it('should return 400 for invalid ID', async () => {
      const res = await request(app).get('/api/bugs/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid bug ID');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Original Bug',
        description: 'Original Description',
        status: 'open',
        reporter: 'Original Reporter'
      });
      bugId = bug._id;
    });

    it('should update a bug', async () => {
      const updates = {
        title: 'Updated Bug',
        description: 'Updated Description',
        status: 'in-progress'
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(updates.title);
      expect(res.body.description).toBe(updates.description);
      expect(res.body.status).toBe(updates.status);
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Bug to Delete',
        description: 'Description',
        reporter: 'Reporter'
      });
      bugId = bug._id;
    });

    it('should delete a bug', async () => {
      const res = await request(app).delete(`/api/bugs/${bugId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Bug deleted successfully');

      // Verify bug is deleted
      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
    });
  });
});
