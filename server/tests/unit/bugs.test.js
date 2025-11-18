const { validateBugData } = require('../../src/utils/validation');

describe('Bug Validation Utils', () => {
  describe('validateBugData', () => {
    it('should validate correct bug data', () => {
      const validBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'medium',
        reporter: 'John Doe'
      };

      const result = validateBugData(validBug);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject bug with missing title', () => {
      const invalidBug = {
        description: 'This is a test bug description',
        status: 'open',
        priority: 'medium',
        reporter: 'John Doe'
      };

      const result = validateBugData(invalidBug);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should reject bug with title too long', () => {
      const invalidBug = {
        title: 'a'.repeat(101), // 101 characters
        description: 'This is a test bug description',
        status: 'open',
        priority: 'medium',
        reporter: 'John Doe'
      };

      const result = validateBugData(invalidBug);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title cannot be more than 100 characters');
    });

    it('should reject bug with invalid status', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'invalid-status',
        priority: 'medium',
        reporter: 'John Doe'
      };

      const result = validateBugData(invalidBug);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status value');
    });

    it('should reject bug with invalid priority', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'invalid-priority',
        reporter: 'John Doe'
      };

      const result = validateBugData(invalidBug);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid priority value');
    });

    it('should reject bug with missing reporter', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'medium'
      };

      const result = validateBugData(invalidBug);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Reporter is required');
    });
  });
});
