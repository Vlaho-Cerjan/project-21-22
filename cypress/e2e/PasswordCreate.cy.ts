describe('Password Create', () => {
  it('shoud visit /password-create/?token=9e0b6cb0-cd06-11ee-a60c-5f55d255dff5 and see the password create form', () => {
    cy.task('mockServer');
    cy.intercept(`${Cypress.env('Project_API')}auth/password-create`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: '9e0b6cb0-cd06-11ee-a60c-5f55d255dff5',
        },
      },
    }).as('create-password');

    cy.intercept(`${Cypress.env('Project_API')}api/user`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: '9e0b6cb0-cd06-11ee-a60c-5f55d255dff5',
            email: 'vlaho@project.tv',
            mobile_number: null,
            first_name: 'Vlaho',
            last_name: 'Cerjan',
            job_title: 'Senior Frontend Developer',
            image: 0,
            created_at: '2024-02-16T20:04:40+00:00',
            updated_at: '2024-04-04T18:03:25+00:00',
            roles: [
              {
                id: '816ee690-cb95-11ee-99d3-9fe18e1a734d',
                name: 'project_admin',
              },
            ],
          },
        },
      },
    });

    cy.visit('/create-password/?token=9e0b6cb0-cd06-11ee-a60c-5f55d255dff5');
    cy.get('[data-testid="landingHeader"]').should('be.visible');
    cy.get('[data-testid="landingContent"]').should('be.visible');
    cy.get('[data-testid="landingForm"]').should('be.visible');
    cy.get('[data-testid="newPassword"]').should('be.visible');
    cy.get('[data-testid="confirmPassword"]').should('be.visible');
    cy.get('[data-testid="createPasswordButton"]').should('be.visible');

    // password has to contain at least 8 characters, upper and lowercase letters, numbers and special characters
    cy.get('[data-testid="newPassword"]').type('12345678');
    cy.get('[data-testid="confirmPassword"]').should('not.be.disabled');
    cy.get('[data-testid="confirmPassword"]').type('12345678');
    cy.get('[data-testid="createPasswordButton"]').click();

    cy.findByText(
      'Password must contain at least 8 characters, upper and lowercase letters, numbers and special characters.',
    ).should('be.visible');

    cy.get('[data-testid="newPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="confirmPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="createPasswordButton"]').click();
    cy.wait('@create-password');
    cy.wait(1100);
    cy.url().should('equal', `${Cypress.config().baseUrl}/`);
  });

  it('should visit /password-create and see the token is missing message and get redirected to /sign-up after 1 second', () => {
    cy.visit('/create-password');
    cy.wait(1100);
    cy.url().should('include', '/sign-up');
  });

  it('should visit /create-password/?token=1234 and set the confirm password different and see an error message', () => {
    cy.visit('/create-password/?token=1234');
    cy.get('[data-testid="newPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="confirmPassword"]').type('G4m3Fr34k004$$');
    cy.get('[data-testid="createPasswordButton"]').click();
    cy.findByText('Passwords do not match.').should('be.visible');
  });

  it('should visit /create-password/?token=1234 and handle an error on server side', () => {
    cy.intercept(`${Cypress.env('Project_API')}auth/password-create`, {
      statusCode: 400,
      body: {
        success: false,
        data: null,
      },
    }).as('create-password');

    cy.visit('/create-password/?token=1234');
    cy.get('[data-testid="newPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="confirmPassword"]').type('G4m3Fr34k004$$$');
    cy.get('[data-testid="createPasswordButton"]').click();
    cy.wait('@create-password');
    cy.findByText('Password creation failed. Please try again.').should(
      'be.visible',
    );
  });
});
