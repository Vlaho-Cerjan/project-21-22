describe('Password Reset', () => {
  it('shoud visit /password-reset/?token=1234 and see the password reset form', () => {
    cy.intercept(`${Cypress.env('Project_API')}auth/password-reset`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: '1234',
        },
      },
    }).as('reset-password');

    cy.visit('/reset-password/?token=1234');
    cy.get('[data-testid="landingHeader"]').should('be.visible');
    cy.get('[data-testid="landingContent"]').should('be.visible');
    cy.get('[data-testid="landingForm"]').should('be.visible');
    cy.get('[data-testid="newPassword"]').should('be.visible');
    cy.get('[data-testid="confirmPassword"]').should('be.visible');
    cy.get('[data-testid="resetPasswordButton"]').should('be.visible');

    // password has to contain at least 8 characters, upper and lowercase letters, numbers and special characters
    cy.get('[data-testid="newPassword"]').type('12345678');
    cy.get('[data-testid="confirmPassword"]').type('12345678');
    cy.get('[data-testid="resetPasswordButton"]').click();

    cy.findByText(
      'Password must contain at least 8 characters, upper and lowercase letters, numbers and special characters.',
    ).should('be.visible');

    cy.get('[data-testid="newPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="confirmPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="resetPasswordButton"]').click();
    cy.wait('@reset-password');
    cy.wait(1100);
    cy.url().should('equal', `${Cypress.config().baseUrl}/`);
  });

  it('should visit /password-reset and see the token is missing message and get redirected to /sign-up after 1 second', () => {
    cy.visit('/reset-password');
    cy.wait(1100);
    cy.url().should('include', '/sign-up');
  });

  it('should visit /reset-password/?token=1234 and set the confirm password different and see an error message', () => {
    cy.visit('/reset-password/?token=1234');
    cy.get('[data-testid="newPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="confirmPassword"]').type('G4m3Fr34k004$$');
    cy.get('[data-testid="resetPasswordButton"]').click();
    cy.findByText('Passwords do not match.').should('be.visible');
  });

  it('should visit /reset-password/?token=1234 and handle an error on server side', () => {
    cy.intercept(`${Cypress.env('Project_API')}auth/password-reset`, {
      statusCode: 400,
      body: {
        success: false,
        data: null,
      },
    }).as('reset-password');

    cy.visit('/reset-password/?token=1234');
    cy.get('[data-testid="newPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="confirmPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="resetPasswordButton"]').click();
    cy.wait('@reset-password');
    cy.findByText('Password reset failed. Please try again.').should(
      'be.visible',
    );
  });
});
