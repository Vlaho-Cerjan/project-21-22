describe('Email Verified', () => {
  it('should visit /email-verification/?token=1234 and see the email verified message', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}api/registration/email-verification`,
      {
        statusCode: 200,
        body: {
          success: true,
          data: null,
        },
      },
    ).as('email-verification');
    cy.visit('/email-verification/?token=1234');
    cy.wait('@email-verification');
    cy.get('[data-testid="landingHeader"]').should('be.visible');
    cy.get('[data-testid="landingContent"]').should('be.visible');
    cy.findByText('Email verification success! Spot on!').should('be.visible');
    cy.findByText(
      'We will send you an email with a link when your account is verified.',
    ).should('be.visible');
  });

  it('should visit /email-verification and see the verification is missing message and get redirected to /sign-up after 1 second', () => {
    cy.visit('/email-verification');
    cy.wait(500);
    cy.findByText('Verification is missing.').should('be.visible');
    cy.findByText('Email verification failed! Please contact support.').should(
      'be.visible',
    );
    cy.wait(1000);
    cy.url().should('include', '/sign-up');
  });
});
