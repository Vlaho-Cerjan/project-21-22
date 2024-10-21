// Import Cypress Percy plugin command (https://docs.percy.io/docs/cypress)
import '@percy/cypress';
// import 'cypress-ssr-localhost-mocker/commands';

Cypress.Commands.add('login', (email, password, url) => {
  cy.session([email, password], () => {
    cy.intercept('/api/auth/callback/credentials/').as('credentials');
    cy.intercept('/api/auth/session/').as('session');
    cy.visit(url);
    cy.wait(500);
    cy.get('[data-testid="signInButton"]').click();
    cy.get('[data-testid=email]').type(email);
    cy.get('[data-testid=password]').type(password);
    cy.get('[data-testid=submitSignInButton]').click();
    cy.wait('@credentials').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    cy.wait('@session').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    // expect the user to be redirected to front page "/"
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${url === '/sign-up' ? '/' : url}`,
    );

    cy.wait('@session').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
  });
});
