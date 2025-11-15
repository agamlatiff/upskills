describe('Authentication E2E', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('should display login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('button', /sign in/i).should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.contains('button', /sign in/i).click();
    cy.contains(/email is required/i).should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    // Note: This test requires a test user in the database
    // You may need to seed test data before running this test
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('button', /sign in/i).click();

    // Should redirect to dashboard or home
    cy.url().should('not.include', '/signin');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains('button', /sign in/i).click();

    // Should show error message
    cy.contains(/invalid credentials/i).should('be.visible');
  });

  it('should navigate to signup page', () => {
    cy.contains(/sign up/i).click();
    cy.url().should('include', '/signup');
  });
});

