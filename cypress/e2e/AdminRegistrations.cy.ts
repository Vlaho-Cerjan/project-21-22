import type {RegistrationList} from '../../types/registrations';

const regData: RegistrationList[] = [
  {
    id: 'asfasfjqwrjqwiorqwjr',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    phone_number: '+1234567890',
    mobile_number: '+1234567890',
    business_name: 'John Doe Inc.',
    business_type_id: '121281259128512958',
    address_1: '123 Main St',
    address_2: 'Apt 1',
    city: 'New York',
    state_code: 'NY',
    zip: '10001',
    country_code: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    status: 2,
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
    job_title: 'CEO',
    notes: {
      decline_reason: 'Disqualified',
      dma_top_20: 0,
      skip_email: true,
      business_id: 'asfasfjqwrjqwiorqwjr',
      approved_by: 'asfasfjqwrjqwiorqwjr',
      declined_by: 'asfasfjqwrjqwiorqwjr',
      do_not_ship_player: true,
      registration_notes: 'Notes',
    },
  },
  {
    id: 'asfasfjqwrjqwiorafsasfqwjr',
    first_name: 'Jan',
    last_name: 'Doe',
    email: 'jan@doe.com',
    phone_number: '+1234567890',
    mobile_number: '+1234567890',
    business_name: 'Jan Doe Inc.',
    business_type_id: '121281259128512958',
    address_1: '123 Main St',
    address_2: 'Apt 1',
    city: 'New York',
    state_code: 'NY',
    zip: '10001',
    country_code: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    status: 2,
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
    job_title: 'CEO',
    notes: {
      decline_reason: 'Disqualified',
      dma_top_20: 0,
      skip_email: true,
      business_id: 'asfasfjqwrjqwiorqwjr',
      approved_by: 'asfasfjqwrjqwiorqwjr',
      declined_by: 'asfasfjqwrjqwiorqwjr',
      do_not_ship_player: true,
      registration_notes: 'Notes',
    },
  },
];

const regPaginationData: RegistrationList[] = [
  {
    id: 'asfasfjqwrjqwiorqwjr',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    phone_number: '+1234567890',
    mobile_number: '+1234567890',
    business_name: 'John Doe Inc.',
    business_type_id: '121281259128512958',
    address_1: '123 Main St',
    address_2: 'Apt 1',
    city: 'New York',
    state_code: 'NY',
    zip: '10001',
    country_code: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    status: 2,
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
    job_title: 'CEO',
    notes: {
      decline_reason: 'Disqualified',
      dma_top_20: 0,
      skip_email: true,
      business_id: 'asfasfjqwrjqwiorqwjr',
      approved_by: 'asfasfjqwrjqwiorqwjr',
      declined_by: 'asfasfjqwrjqwiorqwjr',
      do_not_ship_player: true,
      registration_notes: 'Notes',
    },
  },
  {
    id: 'asfasfjqwrjqwiorafsasfqwjr',
    first_name: 'Jan',
    last_name: 'Doe',
    email: 'jan@doe.com',
    phone_number: '+1234567890',
    mobile_number: '+1234567890',
    business_name: 'Jan Doe Inc.',
    business_type_id: '121281259128512958',
    address_1: '123 Main St',
    address_2: 'Apt 1',
    city: 'New York',
    state_code: 'NY',
    zip: '10001',
    country_code: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    status: 2,
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
    job_title: 'CEO',
    notes: {
      decline_reason: 'Disqualified',
      dma_top_20: 0,
      skip_email: true,
      business_id: 'asfasfjqwrjqwiorqwjr',
      approved_by: 'asfasfjqwrjqwiorqwjr',
      declined_by: 'asfasfjqwrjqwiorqwjr',
      do_not_ship_player: true,
      registration_notes: 'Notes',
    },
  },
  ...Array.from({length: 20}, (_, i) => ({
    id: `asfasfjqwrjqwiorqwjr${i}`,
    first_name: `John ${i}`,
    last_name: `Doe ${i}`,
    email: `john${i}@doe.com`,
    phone_number: `+123456789${i}`,
    mobile_number: `+123456789${i}`,
    business_name: `John Doe Inc. ${i}`,
    business_type_id: `121281259128512958${i}`,
    address_1: '123 Main St',
    address_2: 'Apt 1',
    city: 'New York',
    state_code: 'NY',
    zip: '10001',
    country_code: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    status: 2,
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
    job_title: 'CEO',
    notes: {
      decline_reason: 'Disqualified',
      dma_top_20: 0,
      skip_email: true,
      business_id: 'asfasfjqwrjqwiorqwjr',
      approved_by: 'asfasfjqwrjqwiorqwjr',
      declined_by: 'asfasfjqwrjqwiorqwjr',
      do_not_ship_player: true,
      registration_notes: 'Notes',
    },
  })),
];

describe('Registration Management', () => {
  beforeEach(() => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: regPaginationData.length,
          registrations: regPaginationData.slice(0, 10),
        },
      },
    ).as('registrationsList');
    cy.fixture('userData.json').then((user) => {
      const {email, password} = user;
      cy.login(email, password, '/sign-up');
    });
  });

  it('should redirect to registrations page', () => {
    cy.visit('/admin/registrations/');

    cy.get('[data-testid=pageHeading]').should(
      'have.text',
      'Pending Registrations',
    );
  });

  it('should load registrations list from api', () => {
    cy.visit('/admin/registrations');
    cy.wait('@registrationsList').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should display no data because of api error', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=2`,
      {
        statusCode: 500,
        success: false,
        error: 'Error',
      },
    ).as('registrationsList');
    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(500);
    });
    cy.get('.Toastify__toast-body').should('contain', 'An error occurred');
    cy.get('.ag-row').should('not.exist');
  });

  it('should update registration', () => {
    cy.intercept(`/admin/registrations/items/${regData[0]?.id}`, {
      success: true,
      data: {
        ...regData[0],
      },
    }).as('getRegistration');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/registration`, {
      success: true,
      data: {
        id: regData[0]?.id,
      },
    }).as('updateRegistration');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/?registration_id=${regData[0]?.id}`,
      {
        success: true,
        data: {
          ...regData[0],
          business_name: 'Jane Doe Inc.',
        },
      },
    ).as('getUpdatedRegistration');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');

    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get(`[data-testid=editButton_${regData[0]?.id}]`).click();
    cy.wait('@getRegistration');
    cy.get('.editRegistrationModal').should('be.visible');
    cy.get('.editRegistrationModal [data-testid=business_name]').focus();
    cy.get('.editRegistrationModal [data-testid=business_name]').clear();
    cy.get('.editRegistrationModal [data-testid=business_name]').type(
      'Jane Doe Inc.',
    );
    cy.get('.editRegistrationModal [data-testid=submitEditRegButton]').click();
    cy.wait('@updateRegistration').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.wait('@getUpdatedRegistration');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'Jane Doe Inc.');
  });

  it('should deny registration', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=4`,
      {
        success: true,
        data: {
          total: regPaginationData.length,
          registrations: regPaginationData.slice(0, 10).map((reg) => ({
            ...reg,
            status: 4,
          })),
        },
      },
    ).as('declinedRegistrationsList');

    cy.intercept(`/admin/registrations/items/${regData[0]?.id}`, {
      success: true,
      data: {
        ...regData[0],
      },
    }).as('getRegistration');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/registration`, {
      success: true,
      data: {
        id: regData[0]?.id,
      },
    }).as('updateRegistration');

    cy.intercept(
      'POST',
      `${Cypress.env('Project_API')}admin/registration/decline`,
      {
        success: true,
        data: {
          id: regData[0]?.id,
        },
      },
    ).as('denyRegistration');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');

    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get(`[data-testid=editButton_${regData[0]?.id}]`).click();
    cy.wait('@getRegistration');
    cy.get('.editRegistrationModal').should('be.visible');
    cy.get('[data-testid=denyEditRegButton]').click();
    cy.get('.denyModal').should('be.visible');
    cy.get('[data-testid=denyReason]').focus();
    cy.get('[data-testid=denyReason]').type('Reason');
    cy.get('[data-testid=denyRegSubmit]').click();
    cy.wait('@updateRegistration').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.wait('@denyRegistration').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.get('.ag-cell[col-id=business_name]').should(
      'not.contain',
      'John Doe Inc.',
    );
    cy.get('[data-testid=filterButton]').click();
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Declined]',
    ).should('be.visible');
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Declined]',
    ).click();
    cy.wait('@declinedRegistrationsList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should approve registration', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=3`,
      {
        success: true,
        data: {
          total: regPaginationData.length,
          registrations: regPaginationData.slice(0, 10).map((reg) => ({
            ...reg,
            status: 3,
          })),
        },
      },
    ).as('approvedRegistrationsList');

    cy.intercept(`/admin/registrations/items/${regData[0]?.id}`, {
      success: true,
      data: {
        ...regData[0],
      },
    }).as('getRegistration');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/registration`, {
      success: true,
      data: {
        id: regData[0]?.id,
      },
    }).as('updateRegistration');

    cy.intercept(
      'POST',
      `${Cypress.env('Project_API')}admin/registration/approve`,
      {
        success: true,
        data: {
          id: regData[0]?.id,
        },
      },
    ).as('approveRegistration');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');

    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get(`[data-testid=editButton_${regData[0]?.id}]`).click();
    cy.wait('@getRegistration');
    cy.get('.editRegistrationModal').should('be.visible');
    cy.get('[data-testid=approveEditRegButton]').click();
    cy.get('.approveModal').should('be.visible');
    cy.get('[data-testid=approveRegSubmit]').click();
    cy.wait('@updateRegistration').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.wait('@approveRegistration').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.get('.ag-cell[col-id=business_name]').should(
      'not.contain',
      'John Doe Inc.',
    );
    cy.get('[data-testid=filterButton]').click();
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Approved]',
    ).should('be.visible');
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Approved]',
    ).click();
    cy.wait('@approvedRegistrationsList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should undo deny registration and make it pending', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=4`,
      {
        success: true,
        data: {
          total: 5,
          registrations: regPaginationData.slice(0, 5).map((reg) => ({
            ...reg,
            status: 4,
          })),
        },
      },
    ).as('declinedRegistrationsList');

    cy.intercept(`/admin/registrations/items/${regData[0]?.id}`, {
      success: true,
      data: {
        ...regData[0],
        status: 4,
      },
    }).as('getRegistration');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/registration`, {
      success: true,
      data: {
        id: regData[0]?.id,
      },
    }).as('updateRegistration');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/registration`, {
      success: true,
      data: {
        id: regData[0]?.id,
      },
    }).as('undoDenyRegistration');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');
    cy.get('[data-testid=filterButton]').click();
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Declined]',
    ).should('be.visible');
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Declined]',
    ).click();
    cy.wait('@declinedRegistrationsList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get(`[data-testid=editButton_${regData[0]?.id}]`).click();
    cy.wait('@getRegistration');
    cy.get('.editRegistrationModal').should('be.visible');
    cy.get('[data-testid=denyEditRegButton]').click();
    cy.wait('@undoDenyRegistration');

    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('not.contain', 'John Doe Inc.');
    cy.get('[data-testid=filterButton]').click();
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Pending]',
    ).should('be.visible');
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Pending]',
    ).click();
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: 10,
          registrations: regPaginationData.slice(0, 10).map((reg) => ({
            ...reg,
            status: 2,
          })),
        },
      },
    ).as('pendingRegistrationsList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should remove filter by pressing on the clear button on the active filter chip', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          registrations: regData,
        },
      },
    ).as('registrationsListNoFilter');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');
    cy.get('[data-testid=activeFilter_2]').should('be.visible');
    cy.get('[data-testid=clearFilter_2]').click();
    cy.wait('@registrationsListNoFilter');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should sort registrations by first name and change sort directions', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=first_name&direction=desc&status=2`,
      {
        success: true,
        data: {
          total: regData.length,
          registrations: regData.sort((a, b) =>
            a.first_name.localeCompare(b.first_name),
          ),
        },
      },
    ).as('registrationsListDesc');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=first_name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: 1,
          registrations: regData.sort((a, b) =>
            b.first_name.localeCompare(a.first_name),
          ),
        },
      },
    ).as('registrationsListAsc');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');
    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('contain', 'John Doe Inc.');
    cy.get('[data-testid=openSortDropdownButton]').click();
    cy.get('[data-testid=sortKey_first_name]').click();
    cy.wait('@registrationsListAsc');
    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('contain', 'John Doe Inc.');
    cy.get('[data-testid=sortDirectionButton]').click();
    cy.wait('@registrationsListDesc');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'Jan Doe Inc.');
    cy.get('[data-testid=openSortDropdownButton]').click();
    cy.get('[data-testid=sortKey_first_name]').click();
    cy.wait('@registrationsListAsc');
    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('contain', 'John Doe Inc.');
  });

  it('should search for a registration by business name', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&search=John&status=2`,
      {
        success: true,
        data: {
          total: 1,
          registrations: [regData[0]],
        },
      },
    ).as('registrationsListSearch');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&search=${encodeURI(regData[0]?.business_name || '')}&status=2`,
      {
        success: true,
        data: {
          total: 1,
          registrations: [regData[0]],
        },
      },
    ).as('registrationsGetSearch');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get('[data-testid=openRegistrationSearchModal]').click();
    cy.get('[data-testid=searchModalInput]').should('be.visible');
    cy.get('[data-testid=searchModalInput]').type('John');
    cy.wait('@registrationsListSearch');
    cy.get(`[data-testid=dropdownItem_${regData[0]?.id}`).should('be.visible');
    cy.get(`[data-testid=dropdownItem_${regData[0]?.id}`).click();
    cy.wait('@registrationsGetSearch');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get('[data-testid=searchText]').should('contain', 'John Doe Inc.');
    cy.get('[data-testid=clearRegistrationSearch]').click();
    cy.wait('@registrationsList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'Jan Doe Inc.');
  });

  it.skip('should paginate through the registrations list', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=0&order_by=business_name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: 20,
          registrations: regPaginationData.slice(0, 10),
        },
      },
    ).as('registrationsListPage1');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/registration/search?limit=10&offset=10&order_by=business_name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: 20,
          registrations: regPaginationData.slice(10, 20),
        },
      },
    ).as('registrationsListPage2');

    cy.visit('/admin/registrations/');
    cy.wait('@registrationsListPage1');
    cy.get('.ag-cell[col-id=business_name]').should(
      'contain',
      'John Doe Inc. 0',
    );
    cy.get('[data-testid=folderViewPaginationButtonRight]').click();
    cy.wait('@registrationsListPage2');
    cy.get('.ag-cell[col-id=business_name]').should(
      'contain',
      'John Doe Inc. 10',
    );
    cy.get('[data-testid=folderViewPaginationButtonLeft]').click();
    cy.wait('@registrationsListPage1');
    cy.get('.ag-cell[col-id=business_name]').should(
      'contain',
      'John Doe Inc. 0',
    );
  });
});
