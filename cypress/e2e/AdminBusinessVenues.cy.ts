import type {VenueAdminData, VenueAdminGroupData} from '@/types/venues';

const venuesGroupData: VenueAdminGroupData[] = Array.from(
  {length: 30},
  (_, i) => ({
    id: 'Group_' + (i + 1),
    name: `Group ${i + 1}`,
    description: `Group ${i + 1} description`,
    business_id: '1',
    venues: venuesPaginationData,
    created_at: '2021-01-01T00:00:00.000Z',
    updated_at: '2021-01-01T00:00:00.000Z',
    total_venues: 30,
  }),
);

const venuesPaginationData: VenueAdminData[] = Array.from(
  {length: 30},
  (_, i) => ({
    id: 'Venues_' + (i + 1),
    name: `Venue ${i + 1}`,
    description: `Venue ${i + 1} description`,
    address_1: `${i + 1} Elm St`,
    city: 'Springfield',
    state_code: 'IL',
    country_code: 'US',
    zip: '62702',
    latitude: 39.781721,
    longitude: -89.650148,
    status: 2,
    venue_type_id: '2',
    business_id: '1',
    notes: {
      venue_notes: `Venue ${i + 1} notes`,
      decline_reason: '',
      declined_by: '2',
      approved_by: '1',
    },
  }),
);

const venuesGroupListData: VenueAdminData[] = Array.from(
  {length: 30},
  (_, i) => ({
    id: 'GroupVenues_' + (i + 1),
    name: `Venue ${i + 1}`,
    description: `Venue ${i + 1} description`,
    address_1: `${i + 1} Elm St`,
    city: 'Springfield',
    state_code: 'IL',
    country_code: 'US',
    zip: '62702',
    latitude: 39.781721,
    longitude: -89.650148,
    status: 2,
    venue_type_id: '2',
    business_id: '1',
    notes: {
      venue_notes: `Venue ${i + 1} notes`,
      decline_reason: '',
      declined_by: '2',
      approved_by: '1',
    },
  }),
);

describe('Business Venues', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=100&offset=0&search=`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].slice(0, 10),
        },
      },
    ).as('getGroups');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&limit=10&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesPaginationData.length,
          venues: [...venuesPaginationData].slice(0, 10),
        },
      },
    ).as('getVenues');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&limit=10&offset=10&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesPaginationData.length,
          venues: [...venuesPaginationData].slice(10, 20),
        },
      },
    ).as('getVenues2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&limit=10&offset=20&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesPaginationData.length,
          venues: [...venuesPaginationData].slice(20, 30),
        },
      },
    ).as('getVenues3');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=9&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].slice(0, 10),
        },
      },
    ).as('getVenueGroups');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=10&offset=9&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].slice(10, 20),
        },
      },
    ).as('getVenueGroups2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=10&offset=19&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].slice(20, 30),
        },
      },
    ).as('getVenueGroups3');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&group_id=${venuesGroupData[0]?.id}&limit=10&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupListData.length,
          venues: [...venuesGroupListData].slice(0, 10).map((venue) => ({
            ...venue,
            group_id: venuesGroupData[0]?.id,
          })),
        },
      },
    ).as('getGroupedVenues');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&group_id=${venuesGroupData[0]?.id}&limit=10&offset=10&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupListData.length,
          venues: [...venuesGroupListData].slice(10, 20).map((venue) => ({
            ...venue,
            group_id: venuesGroupData[0]?.id,
          })),
        },
      },
    ).as('getGroupedVenues2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&group_id=${venuesGroupData[0]?.id}&limit=10&offset=20&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupListData.length,
          venues: [...venuesGroupListData].slice(20, 30).map((venue) => ({
            ...venue,
            group_id: venuesGroupData[0]?.id,
          })),
        },
      },
    ).as('getGroupedVenues3');

    cy.fixture('userData.json').then((user) => {
      const {email, password} = user;
      cy.login(email, password, '/sign-up');
    });
  });

  it('should display a list of venues', () => {
    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.get('.ag-row').should('exist');
    cy.get('.filename').eq(1).should('contain', 'Group 1');
  });

  it('should display no data because of api error', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=9&offset=0&order_by=name&direction=asc&status=2`,
      {
        statusCode: 500,
        success: false,
        error: 'Internal server error',
      },
    ).as('getGroupsError');

    cy.visit('/admin/businesses/1');
    cy.wait('@getGroupsError');
    cy.get('.Toastify__toast-body').should('contain', 'An error occurred');
    cy.get('.ag-row').should('not.exist');
  });

  it('should create a new venue', () => {
    cy.intercept('POST', `${Cypress.env('Project_API')}admin/venue`, {
      success: true,
      data: {
        id: 'Venue_New',
      },
    }).as('createVenue');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').first().should('contain', 'Non Grouped Venues');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenues');
    cy.get('[data-testid=addVenueButton]').click();
    cy.get('.addVenueModal').should('be.visible');
    cy.get('.addVenueModal [data-testid=name]').focus();
    cy.get('.addVenueModal [data-testid=name]').type('Venue New');
    cy.get('.addVenueModal [data-testid=description]').focus();
    cy.wait(200);
    cy.get('.addVenueModal [data-testid=description]').type(
      'Venue New Description',
    );
    cy.wait(200);
    cy.get('.addVenueModal [data-testid=address_1]').focus();
    cy.wait(200);
    cy.get('.addVenueModal [data-testid=address_1]').type('1234');
    cy.get('.pac-container .pac-item').first().click();
    cy.wait(500);
    cy.get('.addVenueModal [data-testid=venue_type_id]').click();
    cy.wait(200);
    cy.get('[data-testid=dropdownItem_CasualDining]').click();
    cy.wait(200);
    cy.get('.addVenueModal [data-testid=venue_notes]').focus();
    cy.wait(200);
    cy.get('.addVenueModal [data-testid=venue_notes]').type('Venue New Notes');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/?venue_id=Venue_New`,
      {
        success: true,
        data: {
          id: 'Venue_New',
          name: 'Venue New',
          description: 'Venue New Description',
          address_1: '1234',
          city: 'Springfield',
          state_code: 'IL',
          country_code: 'US',
          zip: '62702',
          latitude: 39.781721,
          longitude: -89.650148,
          status: 2,
          group_id: null,
          venue_type_id: '2',
          business_id: '1',
          notes: {
            venue_notes: 'Venue New Notes',
          },
        },
      },
    ).as('getNewVenue');

    cy.get('.addVenueModal [data-testid=submitAddVenueButton]').click();
    cy.wait('@createVenue');
    cy.wait('@getNewVenue');

    cy.findByDisplayValue('Venue New').should('exist');
  });

  it('should update venue', () => {
    cy.intercept(`/admin/venues/items/${venuesGroupListData[0]?.id}`, {
      success: true,
      data: venuesPaginationData[0],
    }).as('getVenue');

    cy.intercept('PUT', '/admin/venue', {
      success: true,
      data: {
        ...venuesGroupListData[0],
        name: 'Venue Test 1',
        venue_id: venuesGroupListData[0]?.id,
      },
    }).as('updateVenue');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&group_id=${venuesGroupData[0]?.id}&limit=10&offset=10&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupListData.length,
          venues: [...venuesGroupListData].slice(0, 10).map((venue) => ({
            ...venue,
            group_id: venuesGroupData[0]?.id,
          })),
        },
      },
    ).as('getGroupedVenues');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/?venue_id=${venuesGroupListData[0]?.id}`,
      {
        success: true,
        data: {
          ...venuesGroupListData[0],
          name: 'Venue Test 1',
          group_id: venuesGroupData[0]?.id,
        },
      },
    ).as('getUpdatedVenue');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/group/?group_id=${venuesGroupData[0]?.id}`,
      {
        success: true,
        data: {
          ...venuesGroupData[0],
        },
      },
    ).as('getUpdatedGroup');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue 1');
    cy.get(`[data-testid=editButton_${venuesGroupListData[0]?.id}]`).click({
      force: true,
    });
    cy.wait('@getVenue');
    cy.get('.editVenueModal').should('be.visible');
    cy.get('.editVenueModal [data-testid=name]').focus();
    cy.wait(500);
    cy.get('.editVenueModal [data-testid=name]').clear();
    cy.wait(500);
    cy.get('.editVenueModal [data-testid=name]').type('Venue Test 1');
    cy.wait(500);
    cy.get('.editVenueModal [data-testid=submitEditVenueButton]').click();

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&group_id=${venuesGroupData[0]?.id}&limit=10&offset=10&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupListData.length,
          venues: [...venuesGroupListData].slice(0, 10).map((venue, i) => ({
            ...venue,
            name: i === 0 ? 'Venue Test 1' : venue.name,
            group_id: venuesGroupData[0]?.id,
          })),
        },
      },
    ).as('getGroupedVenues');

    cy.wait('@updateVenue');
    cy.wait('@getUpdatedVenue');
    cy.wait('@getUpdatedGroup');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue Test 1');
  });

  it('should delete venue', () => {
    cy.intercept(
      'DELETE',
      `${Cypress.env('Project_API')}admin/venue?venue_id=${venuesGroupListData[0]?.id}`,
      {
        success: true,
        data: null,
      },
    ).as('deleteVenue');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/?group_id=${venuesGroupData[0]?.id}`,
      {
        success: true,
        data: {
          ...venuesGroupData[0],
        },
      },
    ).as('getUpdatedGroup');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue 1');
    cy.get(`[data-testid=deleteButton_${venuesGroupListData[0]?.id}]`).click({
      force: true,
    });
    cy.get('[data-testid=deleteVenueModal]').should('be.visible');
    cy.get(
      '[data-testid=deleteVenueModal] [data-testid=deleteVenueButton]',
    ).click();

    cy.wait('@deleteVenue');
    cy.wait('@getUpdatedGroup');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`).should(
      'not.exist',
    );
  });

  it('should create a new venue group', () => {
    cy.intercept('POST', `${Cypress.env('Project_API')}admin/group`, {
      success: true,
      data: {
        id: 'Group_New',
      },
    }).as('createGroup');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=9&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].slice(0, 10),
        },
      },
    ).as('getOnlyGroups');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=10&offset=29&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length + 1,
          groups: [
            {
              id: 'Group_New',
              name: 'Group New',
              description: 'Group New Description',
              created_at: '2021-01-01T00:00:00.000Z',
              updated_at: '2021-01-01T00:00:00.000Z',
            } as VenueAdminGroupData,
          ],
        },
      },
    ).as('getVenueGroups4');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getOnlyGroups', '@getOnlyGroups']);
    cy.wait(1000);

    cy.get('.ag-body-viewport').scrollTo('bottom');
    cy.get('[data-testid=addVenueGroupButton]').click();
    cy.get('[data-testid=addVenueGroupModal]').should('be.visible');
    cy.get('[data-testid=addVenueGroupModal] [data-testid=name]').focus();
    cy.get('[data-testid=addVenueGroupModal] [data-testid=name]').type(
      'Group New',
    );
    cy.get(
      '[data-testid=addVenueGroupModal] [data-testid=description]',
    ).focus();
    cy.wait(200);
    cy.get('[data-testid=addVenueGroupModal] [data-testid=description]').type(
      'Group New Description',
    );
    cy.wait(200);
    cy.get(
      '[data-testid=addVenueGroupModal] [data-testid=submitButton]',
    ).click();

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/?group_id=Group_New`,
      {
        success: true,
        data: {
          id: 'Group_New',
          name: 'Group New',
          description: 'Group New Description',
          created_at: '2021-01-01T00:00:00.000Z',
          updated_at: '2021-01-01T00:00:00.000Z',
        },
      },
    ).as('getNewGroup');

    cy.wait('@createGroup');
    cy.wait('@getNewGroup');
    cy.wait('@getVenueGroups4');
    cy.wait(1500);
    cy.get('.filename').should('contain', 'Group New');
  });

  it('should update venue group', () => {
    cy.intercept('PUT', '/admin/group', {
      success: true,
      data: {
        id: venuesGroupData[0]?.id,
      },
    }).as('updateGroup');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/group/?group_id=${venuesGroupData[0]?.id}`,
      {
        success: true,
        data: {
          ...venuesGroupData[0],
          name: 'Group Test 1',
        },
      },
    ).as('getUpdatedGroup');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get(`[data-testid=editButton_${venuesGroupData[0]?.id}]`).click({
      force: true,
    });
    cy.get('[data-testid=editVenueGroupModal]').should('be.visible');
    cy.get('[data-testid=editVenueGroupModal] [data-testid=name]').focus();
    cy.wait(500);
    cy.get('[data-testid=editVenueGroupModal] [data-testid=name]').clear();
    cy.wait(500);
    cy.get('[data-testid=editVenueGroupModal] [data-testid=name]').type(
      'Group Test 1',
    );
    cy.wait(500);
    cy.get(
      '[data-testid=editVenueGroupModal] [data-testid=submitButton]',
    ).click();

    cy.intercept(
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=9&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].slice(0, 10).map((group, i) => ({
            ...group,
            name: i === 0 ? 'Group Test 1' : group.name,
          })),
        },
      },
    ).as('getVenueGroups');

    cy.wait('@updateGroup');
    cy.wait('@getUpdatedGroup');
    cy.wait(500);
    cy.get('.filename').eq(1).should('contain', 'Group Test 1');
  });

  it('should delete venue group', () => {
    cy.intercept(
      'DELETE',
      `${Cypress.env('Project_API')}admin/group?group_id=${venuesGroupData[0]?.id}`,
      {
        success: true,
        data: null,
      },
    ).as('deleteGroup');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get(`[data-testid=deleteButton_${venuesGroupData[0]?.id}]`).click({
      force: true,
    });
    cy.get('[data-testid=deleteVenueModal]').should('be.visible');
    cy.get(
      '[data-testid=deleteVenueModal] [data-testid=deleteVenueButton]',
    ).click();

    cy.wait('@deleteGroup');
    cy.get('.filename').eq(1).should('not.contain', 'Group 1');
  });

  it('should sort venues by name and change sort directions', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=9&offset=0&order_by=name&direction=desc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].reverse().slice(0, 10),
        },
      },
    ).as('getVenueGroupsDesc');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=10&offset=9&order_by=name&direction=desc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].reverse().slice(10, 20),
        },
      },
    ).as('getVenueGroupsDesc2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=10&offset=19&order_by=name&direction=desc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: [...venuesGroupData].reverse().slice(20, 30),
        },
      },
    ).as('getVenueGroupsDesc3');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&group_id=${venuesGroupData[venuesGroupData.length - 1]?.id}&limit=10&offset=0&order_by=name&direction=desc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupListData.length,
          venues: [...venuesGroupListData]
            .reverse()
            .slice(0, 10)
            .map((venue) => ({
              ...venue,
              group_id: venuesGroupData[venuesGroupData.length - 1]?.id,
            })),
        },
      },
    ).as('getGroupedVenuesDesc');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue 1');
    cy.get('[data-testid=openSortDropdownButton]').click();
    cy.get('[data-testid=sortKey_name]').click();
    cy.wait('@getVenueGroupsDesc');
    cy.get('.filename').eq(1).should('contain', 'Group 30');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenuesDesc');
    cy.wait(1000);
    cy.get(
      `.ag-row[row-id=${venuesGroupListData[venuesGroupListData.length - 1]?.id}] .filename`,
    )
      .first()
      .should('contain', 'Venue 30');
    cy.get('[data-testid=sortDirectionButton]').click();
    cy.wait('@getVenueGroups');
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue 1');
  });

  it('should search for a venue by name', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=10&offset=0&order_by=name&direction=asc&search=Venue%201&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: venuesGroupData.slice(0, 10),
        },
      },
    ).as('fetchGroups');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/search?business_id=1&limit=10&offset=0&order_by=name&direction=asc&search=Venue%201&status=2`,
      {
        success: true,
        data: {
          total: 1,
          venues: [venuesPaginationData[0]],
        },
      },
    ).as('searchVenues');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&limit=10&offset=0&order_by=name&direction=asc&search=Venue%201&status=2`,
      {
        success: true,
        data: {
          total: 1,
          businesses: [venuesPaginationData[0]],
        },
      },
    ).as('venuesGetSearch');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue 1');
    cy.get('[data-testid=openVenueSearchModal]').click();
    cy.get('[data-testid=searchModalInput]').should('be.visible');
    cy.get('[data-testid=searchModalInput]').type('Venue 1');
    cy.wait('@fetchGroups');
    cy.wait('@searchVenues');
    cy.get(`[data-testid=dropdownItem_${venuesPaginationData[0]?.id}]`).should(
      'be.visible',
    );
    cy.get(`[data-testid=dropdownItem_${venuesPaginationData[0]?.id}]`).click();
    cy.wait('@searchVenues');
    cy.wait(500);
    cy.get('.ag-cell[col-id=name]').first().should('contain', 'Venue 1');
    cy.get('[data-testid=searchText]').should('contain', 'Venue 1');
    cy.get('[data-testid=clearVenueSearch]').click();
    cy.wait('@getVenues');
    cy.wait('@getVenueGroups');
    cy.get('.filename').eq(1).should('contain', 'Group 1');
  });

  it('should filter venues by status to Pending', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}admin/group/list?business_id=1&limit=9&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesGroupData.length,
          groups: venuesGroupData.slice(0, 10),
        },
      },
    ).as('getVenueGroups');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&limit=10&offset=0&order_by=name&direction=asc&status=1`,
      {
        success: true,
        data: {
          total: 0,
          venues: [],
        },
      },
    ).as('getVenuesPending');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=1&limit=10&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: venuesPaginationData.length,
          venues: venuesPaginationData.slice(0, 10),
        },
      },
    ).as('getVenues');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(2000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.get('[data-testid=filterButton]').click();
    cy.get(
      '[data-testid=filterDesktopDropdown] [data-testid=checkmarkButton_Pending]',
    ).click();
    cy.wait('@getVenuesPending');
    cy.get('.ag-row').should('not.exist');
  });

  it('should drag and drop a venue to a group', () => {
    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/venue/toggle`, {
      success: true,
      data: null,
    }).as('toggleVenues');

    cy.visit('/admin/businesses/1');
    cy.wait(['@getVenues', '@getVenues']);
    cy.wait(['@getVenueGroups', '@getVenueGroups']);
    cy.wait(1000);
    cy.get('.filename').eq(1).should('contain', 'Group 1');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getGroupedVenues');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${venuesGroupListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Venue 1');
    cy.get('.ag-body-viewport').scrollTo(0, 0);
    cy.get('.ag-row[row-id=GroupVenues_1] .ag-row-drag')
      .first()
      .trigger('mousedown', {button: 0, force: true});
    cy.get('.ag-body-viewport').trigger('mousemove', 50, 0, {force: true});
    cy.wait(500);
    cy.get('.ag-body-viewport').trigger('mouseup', {force: true});
    cy.wait('@toggleVenues');
    cy.get('.filename').eq(1).should('contain', 'Group 1');
  });
});
