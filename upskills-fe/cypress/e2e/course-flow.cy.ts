describe('Course Flow E2E', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'password123');
  });

  it('should browse courses on dashboard', () => {
    cy.visit('/dashboard');
    cy.contains(/courses/i).should('be.visible');
  });

  it('should view course details', () => {
    cy.visit('/dashboard');
    // Click on first course card
    cy.get('[data-testid="course-card"]').first().click();
    cy.url().should('include', '/courses/');
  });

  it('should join a course', () => {
    cy.visit('/courses/test-course');
    cy.contains(/join course/i).click();
    // Should redirect to success page or show success message
    cy.url().should('include', '/success');
  });
});

