describe('Phone Verified', () => {
  it('should visit /phone-verified?verified=true and see the phone verified message', () => {
    cy.visit('/phone-verified?verified=true');
    cy.get('[data-testid="landingHeader"]').should('be.visible');
    cy.get('[data-testid="landingContent"]').should('be.visible');
    cy.findByText('Phone number verification success! Spot on!').should(
      'be.visible',
    );
    cy.findByText(
      'You can safely close this window and finish registering.',
    ).should('be.visible');
    cy.get('[data-testid="goToSignIn"]').should('not.exist');
  });

  it('should visit /phone-verified and see the verification is missing message and get redirected to /sign-up after 1 second', () => {
    cy.visit('/phone-verified');
    cy.wait(500);
    cy.findByText('Verification is missing.').should('be.visible');
    cy.wait(1000);
    cy.url().should('include', '/sign-up');
  });
});
