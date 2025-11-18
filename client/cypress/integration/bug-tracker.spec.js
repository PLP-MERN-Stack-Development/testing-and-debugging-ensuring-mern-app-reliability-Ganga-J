describe('Bug Tracker E2E Tests', () => {
  beforeEach(() => {
    // Reset database before each test
    cy.request('POST', '/api/test/reset');
    cy.visit('/');
  });

  it('should load the bug tracker homepage', () => {
    cy.contains('Bug Tracker').should('be.visible');
    cy.contains('All Bugs').should('be.visible');
    cy.contains('Report Bug').should('be.visible');
  });

  it('should display empty state when no bugs exist', () => {
    cy.contains('No bugs found').should('be.visible');
    cy.contains('Report First Bug').should('be.visible');
  });

  it('should navigate to report bug form', () => {
    cy.contains('Report Bug').click();
    cy.url().should('include', '/bugs/new');
    cy.contains('Report New Bug').should('be.visible');
  });

  it('should create a new bug', () => {
    // Navigate to new bug form
    cy.contains('Report Bug').click();

    // Fill out the form
    cy.get('#title').type('Test Bug Title');
    cy.get('#description').type('This is a test bug description');
    cy.get('#reporter').type('John Doe');
    cy.get('#assignee').type('Jane Smith');

    // Add a tag
    cy.get('input[placeholder="Add a tag"]').type('frontend');
    cy.contains('Add Tag').click();

    // Submit the form
    cy.contains('Report Bug').click();

    // Should redirect to home and show the bug
    cy.url().should('not.include', '/bugs/new');
    cy.contains('Test Bug Title').should('be.visible');
    cy.contains('This is a test bug description').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.contains('Report Bug').click();

    // Try to submit without required fields
    cy.contains('Report Bug').click();

    // Should show validation errors
    cy.get('#title:invalid').should('exist');
    cy.get('#description:invalid').should('exist');
    cy.get('#reporter:invalid').should('exist');
  });

  it('should view bug details', () => {
    // First create a bug
    cy.contains('Report Bug').click();
    cy.get('#title').type('Detail Test Bug');
    cy.get('#description').type('Description for detail view test');
    cy.get('#reporter').type('Test Reporter');
    cy.contains('Report Bug').click();

    // Click on the bug to view details
    cy.contains('Detail Test Bug').click();
    cy.url().should('include', '/bugs/');
    cy.contains('Detail Test Bug').should('be.visible');
    cy.contains('Description for detail view test').should('be.visible');
    cy.contains('Test Reporter').should('be.visible');
  });

  it('should edit a bug', () => {
    // Create a bug first
    cy.contains('Report Bug').click();
    cy.get('#title').type('Original Bug');
    cy.get('#description').type('Original description');
    cy.get('#reporter').type('Original Reporter');
    cy.contains('Report Bug').click();

    // Navigate to edit
    cy.contains('Original Bug').click();
    cy.contains('Edit').click();

    // Edit the bug
    cy.get('#title').clear().type('Updated Bug');
    cy.get('#description').clear().type('Updated description');
    cy.contains('Update Bug').click();

    // Verify changes
    cy.contains('Updated Bug').should('be.visible');
    cy.contains('Updated description').should('be.visible');
  });

  it('should delete a bug', () => {
    // Create a bug first
    cy.contains('Report Bug').click();
    cy.get('#title').type('Bug to Delete');
    cy.get('#description').type('This bug will be deleted');
    cy.get('#reporter').type('Delete Tester');
    cy.contains('Report Bug').click();

    // Delete the bug
    cy.contains('Bug to Delete').click();
    cy.contains('Delete').click();

    // Confirm deletion
    cy.on('window:confirm', () => true);

    // Should redirect to home and bug should be gone
    cy.contains('Bug to Delete').should('not.exist');
  });

  it('should filter bugs by status', () => {
    // Create bugs with different statuses
    cy.request('POST', '/api/bugs', {
      title: 'Open Bug',
      description: 'Open status',
      reporter: 'Reporter',
      status: 'open'
    });
    cy.request('POST', '/api/bugs', {
      title: 'Resolved Bug',
      description: 'Resolved status',
      reporter: 'Reporter',
      status: 'resolved'
    });

    cy.reload();

    // Filter by open status
    cy.get('select').first().select('open');
    cy.contains('Open Bug').should('be.visible');
    cy.contains('Resolved Bug').should('not.be.visible');

    // Filter by resolved status
    cy.get('select').first().select('resolved');
    cy.contains('Resolved Bug').should('be.visible');
    cy.contains('Open Bug').should('not.be.visible');
  });

  it('should handle error states gracefully', () => {
    // Simulate network error by visiting invalid route
    cy.visit('/invalid-route');
    cy.contains('Bug Tracker').should('be.visible'); // Should still show header
  });

  it('should handle form submission errors', () => {
    cy.contains('Report Bug').click();

    // Fill form with invalid data (title too long)
    cy.get('#title').type('a'.repeat(101));
    cy.get('#description').type('Valid description');
    cy.get('#reporter').type('Valid Reporter');
    cy.contains('Report Bug').click();

    // Should show error message
    cy.contains('error').should('be.visible');
  });
});
