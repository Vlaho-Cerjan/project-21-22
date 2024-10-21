import type {BusinessData} from '../../types/businesses';

const regData: BusinessData[] = [
  {
    id: 'asfasfjqwrjqwiorqwjr',
    phone_number: '+1234567890',
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
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
  },
  {
    id: 'asfasfjqwrjqwiorafsasfqwjr',
    phone_number: '+1234567890',
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
    created_at: '2021-10-01T00:00:00Z',
    updated_at: '2021-10-01T00:00:00Z',
  },
];

const regPaginationData: BusinessData[] = Array.from({length: 20}, (_, i) => ({
  id: `asfasfjqwrjqwiorqwjr${i}`,
  phone_number: `+123456789${i}`,
  business_name: `John Doe Inc. ${i}`,
  business_type_id: '121281259128512958',
  address_1: '123 Main St',
  address_2: 'Apt 1',
  city: 'New York',
  state_code: 'NY',
  zip: '10001',
  country_code: 'US',
  latitude: 40.7128,
  longitude: -74.006,
  created_at: '2021-10-01T00:00:00Z',
  updated_at: '2021-10-01T00:00:00Z',
}));

describe('Business Management', () => {
  beforeEach(() => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData,
        },
      },
    ).as('businessesList');
    cy.fixture('userData.json').then((user) => {
      const {email, password} = user;
      cy.login(email, password, '/sign-up');
    });
  });

  it('should redirect to businesses page', () => {
    cy.visit('/admin/businesses/');

    cy.get('[data-testid=pageHeading]').should('have.text', 'Businesses');
  });

  it('should load businesses list from api', () => {
    cy.visit('/admin/businesses');
    cy.wait('@businessesList').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should display no data because of api error', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        statusCode: 500,
        success: false,
        error: 'Error',
      },
    ).as('businessesList');
    cy.visit('/admin/businesses/');
    cy.wait('@businessesList').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(500);
    });
    cy.get('.Toastify__toast-body').should('contain', 'An error occurred');
    cy.get('.ag-row').should('not.exist');
  });

  it('should update business', () => {
    cy.intercept(`/admin/businesses/items/${regData[0]?.id}`, {
      success: true,
      data: {
        ...regData[0],
      },
    }).as('getBusiness');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/business`, {
      success: true,
      data: {
        id: regData[0]?.id,
      },
    }).as('updateBusiness');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/?business_id=${regData[0]?.id}`,
      {
        success: true,
        data: {
          ...regData[0],
          business_name: 'Jane Doe Inc.',
        },
      },
    ).as('getUpdatedBusiness');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');

    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get(`[data-testid=editButton_${regData[0]?.id}]`).click();
    cy.wait('@getBusiness');
    cy.get('.editBusinessModal').should('be.visible');
    cy.get('.editBusinessModal [data-testid=business_name]').focus();
    cy.get('.editBusinessModal [data-testid=business_name]').clear();
    cy.get('.editBusinessModal [data-testid=business_name]').type(
      'Jane Doe Inc.',
    );
    cy.get('.editBusinessModal [data-testid=submitEditRegButton]').click();
    cy.wait('@updateBusiness').then((interception) => {
      expect(interception?.response?.statusCode).to.equal(200);
    });
    cy.wait('@getUpdatedBusiness');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'Jane Doe Inc.');
  });

  it.skip('should remove filter by pressing on the clear button on the active filter chip', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData,
        },
      },
    ).as('businessesListNoFilter');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');
    cy.get('[data-testid=activeFilter_2]').should('be.visible');
    cy.get('[data-testid=clearFilter_2]').click();
    cy.wait('@businessesListNoFilter');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
  });

  it('should sort businesses by phone number and change sort directions', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=phone_number&direction=desc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData.sort((a, b) =>
            a.phone_number.localeCompare(b.phone_number),
          ),
        },
      },
    ).as('businessesListDesc');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=phone_number&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData.sort((a, b) =>
            b.phone_number.localeCompare(a.phone_number),
          ),
        },
      },
    ).as('businessesListAsc');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');
    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('contain', 'John Doe Inc.');
    cy.get('[data-testid=openSortDropdownButton]').click();
    cy.get('[data-testid=sortKey_phone_number]').click();
    cy.wait('@businessesListAsc');
    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('contain', 'John Doe Inc.');
    cy.get('[data-testid=sortDirectionButton]').click();
    cy.wait('@businessesListDesc');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'Jan Doe Inc.');
    cy.get('[data-testid=openSortDropdownButton]').click();
    cy.get('[data-testid=sortKey_phone_number]').click();
    cy.wait('@businessesListAsc');
    cy.get('.ag-cell[col-id=business_name]')
      .first()
      .should('contain', 'John Doe Inc.');
  });

  it('should search for a business by business name', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc&search=John`,
      {
        success: true,
        data: {
          total: 1,
          businesses: [regData[0]],
        },
      },
    ).as('businessesListSearch');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc&search=${encodeURI(regData[0]?.business_name || '')}`,
      {
        success: true,
        data: {
          total: 1,
          businesses: [regData[0]],
        },
      },
    ).as('businessesGetSearch');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get('[data-testid=openBusinessSearchModal]').click();
    cy.get('[data-testid=searchModalInput]').should('be.visible');
    cy.get('[data-testid=searchModalInput]').type('John');
    cy.wait('@businessesListSearch');
    cy.get(`[data-testid=dropdownItem_${regData[0]?.id}`).should('be.visible');
    cy.get(`[data-testid=dropdownItem_${regData[0]?.id}`).click();
    cy.wait('@businessesGetSearch');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'John Doe Inc.');
    cy.get('[data-testid=searchText]').should('contain', 'John Doe Inc.');
    cy.get('[data-testid=clearBusinessSearch]').click();
    cy.wait('@businessesList');
    cy.get('.ag-cell[col-id=business_name]').should('contain', 'Jan Doe Inc.');
  });

  it.skip('should paginate through businesses', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 20,
          businesses: regPaginationData.slice(0, 10),
        },
      },
    ).as('businessesListPage1');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=10&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 20,
          businesses: regPaginationData.slice(10),
        },
      },
    ).as('businessesListPage2');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesListPage1');
    cy.get('.ag-cell[col-id=business_name]').should(
      'contain',
      'John Doe Inc. 1',
    );
    cy.get('[data-testid=folderViewPaginationButtonRight]').click();
    cy.wait('@businessesListPage2');
    cy.get('.ag-cell[col-id=business_name]').should(
      'contain',
      'John Doe Inc. 11',
    );
  });

  it('should go to businesses venue page when clicking on venues button of a business', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData,
        },
      },
    ).as('businessesList');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=asfasfjqwrjqwiorqwjr&limit=10&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: 0,
          venues: [],
        },
      },
    ).as('venuesList');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');
    cy.get(`[data-testid=venuesButton_${regData[0]?.id}]`).click();
    cy.url().should('include', `/admin/businesses/${regData[0]?.id}`);
    cy.wait('@venuesList');
    cy.get('[data-testid=pageHeading]').should('have.text', 'Approved Venues');
  });

  it('should go to businesses screens page when clicking on screens button of a business', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData,
        },
      },
    ).as('businessesList');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/search?search=&business_id=asfasfjqwrjqwiorqwjr&limit=10&offset=0`,
      {
        success: true,
        data: {
          total: 0,
          venues: [],
        },
      },
    ).as('venuesList');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/search?business_id=asfasfjqwrjqwiorqwjr&limit=10&offset=0&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: 0,
          venues: [],
        },
      },
    ).as('venuesSearchList');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/screen/list?business_id=asfasfjqwrjqwiorqwjr&limit=10&offset=0&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: 0,
          screens: [],
        },
      },
    ).as('screensList');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');
    cy.get(`[data-testid=screensButton_${regData[0]?.id}]`).click();
    cy.url().should('include', `/admin/businesses/screens/${regData[0]?.id}`);
    cy.wait('@screensList');
    cy.get('[data-testid=pageHeading]').should('have.text', 'Screens');
  });

  it('should go to businesses orders page when clicking on orders button of a business', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/business/search?limit=10&offset=0&order_by=business_name&direction=asc`,
      {
        success: true,
        data: {
          total: 1,
          businesses: regData,
        },
      },
    ).as('businessesList');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/order/list?business_id=asfasfjqwrjqwiorqwjr&limit=10&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: 0,
          orders: [],
        },
      },
    ).as('ordersList');

    cy.visit('/admin/businesses/');
    cy.wait('@businessesList');
    cy.get(`[data-testid=ordersButton_${regData[0]?.id}]`).click();
    cy.url().should('include', `/admin/businesses/orders/${regData[0]?.id}`);
    cy.wait('@ordersList');
    cy.get('[data-testid=pageHeading]').should('have.text', 'Approved Orders');
  });
});
