describe('Reset Password', () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env('Project_API')}auth/password-request`, {
      statusCode: 200,
      fixture: 'auth/password-request.json',
    }).as('password-request');
  });

  it('should visit sign-up, open sign in modal, open request password modal and write in email and submit and wait for success message', () => {
    cy.visit('/sign-up');
    cy.wait(500);
    cy.get('[data-testid="signInButton"]').click();
    cy.get('[data-testid="forgotPasswordLink"]').click();
    cy.get('[data-testid="requestPasswordResetModal"]').should('be.visible');
    cy.wait(100);
    cy.get('[data-testid="resetEmail"]').type('test@test.com');
    cy.get('[data-testid="submitRequestPasswordResetButton"]').click();
    cy.wait('@password-request');
    cy.get('[data-testid="requestPasswordResetModal"]').should(
      'not.be.visible',
    );
    cy.findByText('Password reset email sent. Please check your email.').should(
      'be.visible',
    );
  });

  it('should visit sign-up, open sign in modal, try signing in with invalid credentials, open request password modal and the email should be prefilled', () => {
    cy.visit('/sign-up');
    cy.wait(500);
    cy.get('[data-testid="signInButton"]').click();
    cy.get('[data-testid=email]').type('test@test.com');
    cy.get('[data-testid=password]').type('123456');
    cy.get('[data-testid=submitSignInButton]').click();
    cy.get('[data-testid=inputErrorContainer]').should('have.class', 'active');
    cy.get('[data-testid="forgotPasswordLink"]').click();
    cy.get('[data-testid="requestPasswordResetModal"]').should('be.visible');
    cy.get('[data-testid="resetEmail"]').should('have.value', 'test@test.com');

    cy.get('[data-testid="submitRequestPasswordResetButton"]').click();
    cy.wait('@password-request');
    cy.get('[data-testid="requestPasswordResetModal"]').should(
      'not.be.visible',
    );
    cy.findByText('Password reset email sent. Please check your email.').should(
      'be.visible',
    );
  });
});
