describe('Sign Up', () => {
  beforeEach(() => {
    cy.intercept(
      `${Cypress.env('Project_API')}auth/phone-verification-request`,
      {
        statusCode: 200,
        body: {
          success: true,
          message: 'Verification code sent',
        },
      },
    ).as('phoneVerificationRequest');

    cy.intercept(`${Cypress.env('Project_API')}auth/phone-verification-code`, {
      statusCode: 200,
      body: {
        success: true,
        message: 'Phone number verified',
      },
    }).as('phoneVerificationCode');

    cy.intercept(`${Cypress.env('Project_API')}api/registration`, {
      statusCode: 200,
      body: {
        success: true,
      },
    }).as('registerBusiness');

    /*
    cy.intercept(`${Cypress.env('Project_API')}api/order`, {
      statusCode: 200,
      body: {
        success: true,
      },
    }).as('submitOrder');
    */
  });

  it('should sign up the user', () => {
    cy.visit('/sign-up');
    cy.get('[data-testid=title_businessName]').should(
      'have.text',
      "Let's start with your business name.",
    );
    cy.get('[data-testid=input_businessName]').type('Test Business');
    cy.get('[data-testid=nextButton_businessName').click();

    cy.wait(300);
    cy.get('[data-testid=input_businessName]').should('not.be.visible');
    cy.get('[data-testid=input_businessLocation]').type(
      '12340 Boggy Creek Road',
    );
    cy.get('.pac-item').first().click();
    cy.wait(200);
    cy.get('[data-testid=nextButton_businessLocation').click();

    cy.wait(300);
    cy.get('[data-testid=input_businessLocation]').should('not.be.visible');
    cy.get('[data-testid=input_businessWebsite]').type('http://test.com');
    cy.get('[data-testid=nextButton_businessWebsite').click();

    cy.wait(300);
    cy.get('[data-testid=input_businessWebsite]').should('not.be.visible');
    cy.get('[data-testid=input_fullName]').type('Test User');
    cy.get('[data-testid=nextButton_fullName').click();

    cy.wait(300);
    cy.get('[data-testid=input_fullName]').should('not.be.visible');
    cy.get('[data-testid=select_venueTypeButton').click();
    cy.get('[data-testid=dropdownItem_Grocery').click();
    cy.get('[data-testid=nextButton_venueType').click();

    cy.wait(300);
    cy.get('[data-testid=select_venueType]').should('not.be.visible');
    cy.get('[data-testid=input_phoneNumber]').type('(555) 555-5555');
    cy.get('[data-testid=nextButton_phoneNumber').click();

    cy.wait(300);
    cy.get('[data-testid=input_phoneNumber]').should('not.be.visible');
    cy.get('[data-testid=input_mobileNumber]').type('955608459');
    cy.get('[data-testid=nextButton_mobileNumber').click();
    cy.wait('@phoneVerificationRequest');
    cy.get('[data-testid=verificationCode').should('be.visible');
    cy.get('[data-testid=verificationCode]').type('123456');
    cy.get('[data-testid=verifyButton').click();
    cy.wait('@phoneVerificationCode');

    cy.wait(300);
    cy.get('[data-testid=verificationCode').should('not.be.visible');
    cy.get('[data-testid=input_mobileNumber]').should('not.be.visible');
    cy.get('[data-testid=input_email]').type('test@test.com');
    cy.get('[data-testid=nextButton_email').click();

    cy.wait('@registerBusiness');
    /*
    cy.get('[data-testid=projectPlayerCounter]').should('be.visible');
    cy.get('[data-testid=projectPlayerCounter]').should('have.value', '1');
    cy.get('[data-testid=increaseCounter]').click();
    cy.get('[data-testid=increaseCounter]').click();
    cy.get('[data-testid=increaseCounter]').click();
    cy.get('[data-testid=projectPlayerCounter]').should('have.value', '4');
    cy.get('[data-testid=nextOrderButton').click();

    cy.get('[data-testid=projectPlayerCounter').should('not.be.visible');
    cy.get('[data-testid=shipToVenueContainer').should('be.visible');
    cy.get('.shipToVenueContainer [data-testid=checkmarkInput]').should(
      'be.checked',
    );
    cy.get('[data-testid=destination]').should('have.value', 'Test Business');
    cy.get('[data-testid=address_1]').should(
      'have.value',
      '12340 Boggy Creek Road',
    );
    cy.get('[data-testid=address_2]').should('have.value', '');
    cy.get('[data-testid=city]').should('have.value', 'Orlando');
    cy.get('[data-testid=state]').should('have.value', 'FL');
    cy.get('[data-testid=zip]').should('have.value', '32824');

    cy.get('.useAccountDetailsContainer [data-testid=checkmarkInput]').should(
      'be.checked',
    );
    cy.get('[data-testid=contactName]').should('have.value', 'Test User');
    cy.get('[data-testid=contactEmail]').should('have.value', 'test@test.com');
    cy.get('[data-testid=contactPhone]').should('have.value', '+385955608459');
    cy.get('[data-testid=nextOrderButton').click();

    cy.get('[data-testid=checkInfoProjectPlayerCounter]').should('be.visible');
    cy.get('[data-testid=checkInfoProjectPlayerCounter]').should('have.text', '4');
    cy.get('[data-testid=checkInfoContact]').should(
      'have.text',
      'Test User +385955608459 test@test.com',
    );
    cy.get('[data-testid=checkInfoShippingAddress]').should(
      'have.text',
      'Test Business 12340 Boggy Creek Road Orlando, FL 32824',
    );
    cy.get('[data-testid=checkInfoBillingAddress]').should(
      'have.text',
      'Test Business 12340 Boggy Creek Road Orlando, FL 32824',
    );
    cy.get('[data-testid=nextOrderButton').click();
    cy.wait('@submitOrder');
    cy.get('.Toastify__toast-body').should(
      'contain',
      'Order submitted, it will be processed once your account is verified.',
    );
    cy.get('[data-testid=orderHeaderTitle]').should('have.text', 'Thank You');
    cy.get('[data-testid=nextOrderButton]').click();

    cy.get('.orderModal').should('not.be.visible');
    */
    cy.wait(1000);
    cy.url().should('include', 'registration-complete');
  });

  it('should test all the input validations (inputs are supposed to have an error class and .errorContainer is supposed to have active class)', () => {
    cy.visit('/sign-up');
    cy.get('[data-testid=nextButton_businessName').click();
    cy.get('[data-testid=input_businessName]').should('have.class', 'error');
    cy.get('.errorContainer.businessName').should('have.class', 'active');
    cy.get('[data-testid=input_businessName]').type('Test Business');
    cy.get('[data-testid=nextButton_businessName').click();
    cy.get('[data-testid=input_businessName]').should(
      'not.have.class',
      'error',
    );
    cy.get('.errorContainer.businessName').should('not.have.class', 'active');
    cy.get('[data-testid=input_businessName]').should('not.be.visible');

    cy.get('[data-testid=nextButton_businessLocation').click();
    cy.get('[data-testid=input_businessLocation]').should(
      'have.class',
      'error',
    );
    cy.get('.errorContainer.businessLocation').should('have.class', 'active');
    cy.get('[data-testid=input_businessLocation]').type(
      '12340 Boggy Creek Road',
    );
    cy.get('.pac-item').first().click();
    cy.get('.errorContainer.businessLocation').should(
      'not.have.class',
      'active',
    );
    cy.get('[data-testid=nextButton_businessLocation').click();
    cy.get('[data-testid=input_businessLocation]').should(
      'not.have.class',
      'error',
    );
    cy.get('.errorContainer.businessLocation').should(
      'not.have.class',
      'active',
    );
    cy.get('[data-testid=input_businessLocation]').should('not.be.visible');

    cy.get('[data-testid=input_businessWebsite]').type('test');
    cy.get('[data-testid=nextButton_businessWebsite').click();
    cy.get('[data-testid=input_businessWebsite]').should('have.class', 'error');
    cy.get('.errorContainer.businessWebsite').should('have.class', 'active');
    cy.get('[data-testid=input_businessWebsite]').clear();
    cy.get('[data-testid=input_businessWebsite]').type('http://test.com');
    cy.get('[data-testid=nextButton_businessWebsite').click();
    cy.get('[data-testid=input_businessWebsite]').should(
      'not.have.class',
      'error',
    );
    cy.get('.errorContainer.businessWebsite').should(
      'not.have.class',
      'active',
    );

    cy.get('[data-testid=input_fullName]').type('User');
    cy.get('[data-testid=nextButton_fullName').click();
    cy.get('[data-testid=input_fullName]').should('have.class', 'error');
    cy.get('.errorContainer.fullName').should('have.class', 'active');
    cy.get('[data-testid=input_fullName]').clear();
    cy.get('[data-testid=input_fullName]').type('Test User');
    cy.get('[data-testid=nextButton_fullName').click();
    cy.get('[data-testid=input_fullName]').should('not.have.class', 'error');
    cy.get('.errorContainer.fullName').should('not.have.class', 'active');

    cy.get('[data-testid=nextButton_venueType').click();

    cy.get('[data-testid=input_phoneNumber]').type('test');
    cy.get('[data-testid=nextButton_phoneNumber').click();
    cy.get('[data-testid=input_phoneNumber]').should('have.class', 'error');
    cy.get('.errorContainer.phoneNumber').should('have.class', 'active');
    cy.get('[data-testid=input_phoneNumber]').clear();
    cy.get('[data-testid=input_phoneNumber]').type('(555) 555 5555');
    cy.get('[data-testid=nextButton_phoneNumber').click();
    cy.get('[data-testid=input_phoneNumber]').should('not.have.class', 'error');
    cy.get('.errorContainer.mobileNumber').should('not.have.class', 'active');

    cy.get('[data-testid=input_mobileNumber]').type('test');
    cy.get('[data-testid=nextButton_mobileNumber').click();
    cy.get('[data-testid=input_mobileNumber]').should('have.class', 'error');
    cy.get('.errorContainer.mobileNumber').should('have.class', 'active');
    cy.get('[data-testid=input_mobileNumber]').clear();
    cy.get('[data-testid=input_mobileNumber]').type('+385955608459');
    cy.get('[data-testid=nextButton_mobileNumber').click();
    cy.get('[data-testid=input_mobileNumber]').should(
      'not.have.class',
      'error',
    );
    cy.get('.errorContainer.mobileNumber').should('not.have.class', 'active');
    cy.wait('@phoneVerificationRequest');
    cy.get('[data-testid=verificationCode').should('be.visible');
    cy.get('[data-testid=verifyButton').click();
    cy.get('[data-testid=verificationCode').should('have.class', 'error');
    cy.get('.errorContainer.verificationCode').should('have.class', 'active');
    cy.get('[data-testid=verificationCode]').type('123456');
    cy.get('[data-testid=verifyButton').click();
    cy.get('[data-testid=verificationCode]').should('not.have.class', 'error');
    cy.get('.errorContainer.verificationCode').should(
      'not.have.class',
      'active',
    );
    cy.wait('@phoneVerificationCode');

    cy.get('[data-testid=input_email]').type('test');
    cy.get('[data-testid=nextButton_email').click();
    cy.get('[data-testid=input_email]').should('have.class', 'error');
    cy.get('.errorContainer.email').should('have.class', 'active');
    cy.get('[data-testid=input_email]').clear();
    cy.get('[data-testid=input_email]').type('test@test.com');
    cy.get('[data-testid=nextButton_email').click();
    cy.get('[data-testid=input_email]').should('not.have.class', 'error');
    cy.get('.errorContainer.email').should('not.have.class', 'active');

    cy.wait('@registerBusiness');
    /*
    cy.get('[data-testid=projectPlayerCounter]').should('be.visible');
    cy.get('[data-testid=projectPlayerCounter]').should('have.value', '1');
    cy.get('[data-testid=increaseCounter]').click();
    cy.get('[data-testid=increaseCounter]').click();
    cy.get('[data-testid=increaseCounter]').click();
    cy.get('[data-testid=projectPlayerCounter]').should('have.value', '4');
    cy.get('[data-testid=nextOrderButton').click();

    cy.get('[data-testid=projectPlayerCounter').should('not.be.visible');
    cy.get('[data-testid=shipToVenueContainer').should('be.visible');
    cy.get('.shipToVenueContainer [data-testid=checkmarkInput]').should(
      'be.checked',
    );
    cy.get('.shipToVenueContainer [data-testid=checkmarkButton]').click();
    cy.get('[data-testid=destination]').clear();
    cy.get('[data-testid=address_1]').clear();
    cy.get('[data-testid=city]').clear();
    cy.get('[data-testid=zip]').clear();
    cy.get('.useAccountDetailsContainer [data-testid=checkmarkInput]').should(
      'be.checked',
    );
    cy.get('.useAccountDetailsContainer [data-testid=checkmarkButton]').click();
    cy.get('[data-testid=contactName]').clear();
    cy.get('[data-testid=contactEmail]').clear();
    cy.get('[data-testid=contactPhone]').clear();
    cy.get('[data-testid=nextOrderButton').click();
    cy.get('[data-testid=destination]').should('have.class', 'error');
    cy.get('.errorContainer.destination').should('have.class', 'active');
    cy.get('[data-testid=address_1]').should('have.class', 'error');
    cy.get('.errorContainer.address_1').should('have.class', 'active');
    cy.get('[data-testid=city]').should('have.class', 'error');
    cy.get('.errorContainer.city').should('have.class', 'active');
    cy.get('[data-testid=zip]').should('have.class', 'error');
    cy.get('.errorContainer.zip').should('have.class', 'active');
    cy.get('[data-testid=contactName]').should('have.class', 'error');
    cy.get('.errorContainer.contactName').should('have.class', 'active');
    cy.get('[data-testid=contactEmail]').should('have.class', 'error');
    cy.get('.errorContainer.contactEmail').should('have.class', 'active');
    cy.get('[data-testid=contactPhone]').should('have.class', 'error');
    cy.get('.errorContainer.contactPhone').should('have.class', 'active');

    cy.get('[data-testid=destination]').type('Test Business');
    cy.get('[data-testid=address_1]').type('12340 Boggy Creek Road');
    cy.get('[data-testid=city]').type('Orlando');
    cy.get('[data-testid=zip]').type('32824');
    cy.get('[data-testid=dropdownButton_state').click();
    cy.get('.modalSelectOverlay_state').should('be.visible');
    cy.get('[data-testid=modalSelectOption_FL').click();
    cy.get('[data-testid=contactName]').type('Test User');
    cy.get('[data-testid=contactEmail]').type('test@test.com');
    cy.get('[data-testid=contactPhone]').type('+385955608459');

    cy.get('[data-testid=nextOrderButton').click();
    cy.get('[data-testid=checkInfoProjectPlayerCounter]').should('be.visible');
    cy.get('[data-testid=checkInfoProjectPlayerCounter]').should('have.text', '4');
    cy.get('[data-testid=checkInfoContact]').should(
      'have.text',
      ' TestUser +385955608459 test@test.com',
    );
    cy.get('[data-testid=checkInfoShippingAddress]').should(
      'have.text',
      'Test Business 12340 Boggy Creek Road Orlando, FL 32824',
    );
    cy.get('[data-testid=checkInfoBillingAddress]').should(
      'have.text',
      'Test Business 12340 Boggy Creek Road Orlando, FL 32824',
    );
    cy.get('[data-testid=nextOrderButton').click();
    cy.wait('@submitOrder');
    cy.get('.Toastify__toast-body').should(
      'contain',
      'Order submitted, it will be processed once your account is verified.',
    );
    cy.get('[data-testid=orderHeaderTitle]').should('have.text', 'Thank You');
    cy.get('[data-testid=nextOrderButton]').click();

    cy.get('.orderModal').should('not.be.visible');
    */
    cy.wait(1000);
    cy.url().should('include', 'registration-complete');
  });
});
