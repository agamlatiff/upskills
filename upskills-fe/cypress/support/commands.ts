/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL') || 'http://localhost:8000/api'}/login`,
    body: {
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const token = response.body.token;
    window.localStorage.setItem('auth_token', token);
  });
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('auth_token');
  cy.visit('/');
});

