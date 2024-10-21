describe('Authentication', () => {
  describe('Unauthorized user', () => {
    it('should redirect to login page', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/sign-up');
    });
  });

  describe('Login', () => {
    it('should login the user', () => {
      cy.fixture('userData.json').then((user) => {
        const {email, password} = user;
        cy.login(email, password, '/sign-up');
      });
    });

    it('should login the user and redirect to /network/devices', () => {
      cy.fixture('userData.json').then((user) => {
        const {email, password} = user;
        cy.login(email, password, '/network/devices/');
      });
    });
  });

  describe('Invalid login', () => {
    it('should show error message', () => {
      cy.intercept('/api/auth/callback/credentials/').as('credentials');
      cy.intercept('/api/auth/session/').as('session');
      cy.visit('/sign-up');

      cy.wait(500);
      cy.get('[data-testid="signInButton"]').click();
      cy.get('[data-testid=email]').type('vlaho@project.tv');
      cy.get('[data-testid=password]').type('123456');
      cy.get('[data-testid=submitSignInButton]').click();

      cy.get('[data-testid=submitSignInButton]').should('have.text', 'Error!');
      cy.get('[data-testid=inputErrorContainer]').should(
        'have.class',
        'active',
      );
    });
  });
});
