import {VenueUserData} from '@/types/venues';
import {GetUserScreen, ListScreen} from '../../types/screens';

const screensScreensData: VenueUserData[] = Array.from(
  {length: 30},
  (_, i) => ({
    id: 'Venue_' + (i + 1),
    name: `Venue ${i + 1}`,
    description: `Venue ${i + 1} description`,
    created_at: '2021-01-01T00:00:00.000Z',
    updated_at: '2021-01-01T00:00:00.000Z',
    status: 2,
    notes: {
      venue_notes: `Venue ${i + 1} notes`,
      decline_reason: '',
      declined_by: '2',
      approved_by: '1',
    },
    address_1: `${i + 1} Elm St`,
    address_2: '',
    city: 'Springfield',
    state_code: 'IL',
    country_code: 'US',
    zip: '62702',
    latitude: 39.781721,
    longitude: -89.650148,
    venue_type_id: '2',
    business_id: '1',
    screens: [],
    total_screens: 30,
  }),
);

const screensData: ListScreen[] = Array.from({length: 30}, (_, i) => ({
  id: 'Screen_' + (i + 1),
  venue_id: '1',
  name: `Screen ${i + 1}`,
  dooh_enabled: 1,
  status: 2,
  user_count: 1,
  last_activity: '2021-01-01T00:00:00.000Z',
  created_at: '2021-01-01T00:00:00.000Z',
  updated_at: '2021-01-01T00:00:00.000Z',
}));

const screensVenueListData: ListScreen[] = Array.from({length: 30}, (_, i) => ({
  id: 'VenueScreens_' + (i + 1),
  venue_id: '1',
  name: `Screen ${i + 1}`,
  dooh_enabled: 1,
  status: 2,
  user_count: 1,
  last_activity: '2021-01-01T00:00:00.000Z',
  created_at: '2021-01-01T00:00:00.000Z',
  updated_at: '2021-01-01T00:00:00.000Z',
}));

describe('Business Screens', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=100&offset=0&search=`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].slice(0, 10),
        },
      },
    ).as('getVenues');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?limit=10&offset=0&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensData.length,
          screens: [...screensData].slice(0, 10),
        },
      },
    ).as('getScreens');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?limit=10&offset=10&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensData.length,
          screens: [...screensData].slice(10, 20),
        },
      },
    ).as('getScreens2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?limit=10&offset=20&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensData.length,
          screens: [...screensData].slice(20, 30),
        },
      },
    ).as('getScreens3');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=0&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].slice(0, 10),
        },
      },
    ).as('getScreenVenues');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=10&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].slice(10, 20),
        },
      },
    ).as('getScreenVenues2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=20&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].slice(20, 30),
        },
      },
    ).as('getScreenVenues3');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?venue_id=${screensScreensData[0]?.id}&limit=10&offset=0&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensVenueListData.length,
          screens: [...screensVenueListData].slice(0, 10).map((screen) => ({
            ...screen,
            venue_id: screensScreensData[0]?.id,
          })),
        },
      },
    ).as('getVenuedScreens');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?venue_id=${screensScreensData[0]?.id}&limit=10&offset=10&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensVenueListData.length,
          screens: [...screensVenueListData].slice(10, 20).map((screen) => ({
            ...screen,
            venue_id: screensScreensData[0]?.id,
          })),
        },
      },
    ).as('getVenuedScreens2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?venue_id=${screensScreensData[0]?.id}&limit=10&offset=20&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensVenueListData.length,
          screens: [...screensVenueListData].slice(20, 30).map((screen) => ({
            ...screen,
            venue_id: screensScreensData[0]?.id,
          })),
        },
      },
    ).as('getVenuedScreens3');

    cy.fixture('clientUserData.json').then((user) => {
      const {email, password} = user;
      cy.login(email, password, '/sign-up');
    });
  });

  it('should display a list of screens', () => {
    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(1000);
    cy.get('.filename').first().should('contain', 'Venue 1');
  });

  it('should display no data because of api error', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=0&order_by=name&direction=asc`,
      {
        statusCode: 500,
        success: false,
        error: 'Internal server error',
      },
    ).as('getVenuesError');

    cy.visit('/resources/screens');
    cy.wait('@getVenuesError');
    cy.get('.Toastify__toast-body').should('contain', 'An error occurred');
    cy.get('.ag-row').should('not.exist');
  });

  it.skip('should create a new screen', () => {
    cy.intercept('POST', `${Cypress.env('Project_API')}api/screen`, {
      success: true,
      data: {
        id: 'Screen_New',
      },
    }).as('createScreen');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(500);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getScreens');
    cy.get('[data-testid=addScreenButton]').click();
    cy.get('.addScreenModal').should('be.visible');
    cy.get('.addScreenModal [data-testid=name]').focus();
    cy.get('.addScreenModal [data-testid=name]').type('Screen New');
    cy.get('.addScreenModal [data-testid=description]').focus();
    cy.wait(200);
    cy.get('.addScreenModal [data-testid=description]').type(
      'Screen New Description',
    );
    cy.wait(200);
    cy.get('.addScreenModal [data-testid=address_1]').focus();
    cy.wait(200);
    cy.get('.addScreenModal [data-testid=address_1]').type('1234');
    cy.get('.pac-container .pac-item').first().click();
    cy.wait(500);
    cy.get('.addScreenModal [data-testid=screen_type_id]').click();
    cy.wait(200);
    cy.get('[data-testid=dropdownItem_CasualDining]').click();
    cy.wait(200);

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/?screen_id=Screen_New`,
      {
        success: true,
        data: {
          id: 'Screen_New',
          name: 'Screen New',
          description: 'Screen New Description',
          address_1: '1234',
          city: 'Springfield',
          state_code: 'IL',
          country_code: 'US',
          zip: '62702',
          latitude: 39.781721,
          longitude: -89.650148,
          status: 2,
          venue_id: null,
          screen_type_id: '2',
        },
      },
    ).as('getNewScreen');

    cy.get('.addScreenModal [data-testid=submitAddScreenButton]').click();
    cy.wait('@createScreen');
    cy.wait('@getNewScreen');

    cy.wait(1000);
    cy.findByDisplayValue('Screen New').should('exist');
  });

  it('should update screen', () => {
    cy.intercept(`/resources/screens/items/${screensVenueListData[0]?.id}`, {
      success: true,
      data: {
        ...screensVenueListData[0],
        name: 'Screen Test 1',
        venue_id: screensScreensData[0]?.id,
        data: {},
        notes: {
          screen_notes: '',
        },
        settings: {
          genre_edm: 0,
          genre_pop: 0,
          genre_rnb: 0,
          rating_14: 0,
          rating_ma: 0,
          genre_folk: 0,
          genre_rock: 0,
          genre_indie: 0,
          genre_latin: 0,
          genre_family: 0,
          genre_hiphop: 0,
          genre_reggae: 0,
          genre_country: 0,
          genre_acoustic: 0,
          genre_americana: 0,
          genre_christian: 0,
          content_explicit: 0,
          content_interactive: 0,
        },
      } as GetUserScreen,
    }).as('getScreen');

    cy.intercept('PUT', '/api/screen', {
      success: true,
      data: {
        ...screensVenueListData[0],
        name: 'Screen Test 1',
        venue_id: screensVenueListData[0]?.id,
      },
    }).as('updateScreen');

    cy.intercept(
      `${Cypress.env('Project_API')}api/screen/list?venue_id=${screensScreensData[0]?.id}&limit=10&offset=10&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensVenueListData.length,
          screens: [...screensVenueListData].slice(0, 10).map((screen) => ({
            ...screen,
            venue_id: screensScreensData[0]?.id,
          })),
        },
      },
    ).as('getVenuedScreens');

    cy.intercept(
      `${Cypress.env('Project_API')}api/screen/?screen_id=${screensVenueListData[0]?.id}`,
      {
        success: true,
        data: {
          ...screensVenueListData[0],
          name: 'Screen Test 1',
          venue_id: screensScreensData[0]?.id,
          data: {},
          notes: {
            screen_notes: '',
          },
          settings: {
            genre_edm: 0,
            genre_pop: 0,
            genre_rnb: 0,
            rating_14: 0,
            rating_ma: 0,
            genre_folk: 0,
            genre_rock: 0,
            genre_indie: 0,
            genre_latin: 0,
            genre_family: 0,
            genre_hiphop: 0,
            genre_reggae: 0,
            genre_country: 0,
            genre_acoustic: 0,
            genre_americana: 0,
            genre_christian: 0,
            content_explicit: 0,
            content_interactive: 0,
          },
        } as GetUserScreen,
      },
    ).as('getUpdatedScreen');

    cy.intercept(
      `${Cypress.env('Project_API')}api/venue/?venue_id=${screensScreensData[0]?.id}`,
      {
        success: true,
        data: {
          ...screensScreensData[0],
        },
      },
    ).as('getUpdatedVenue');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(500);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenuedScreens');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen 1');
    cy.get(`[data-testid=editButton_${screensVenueListData[0]?.id}]`).click({
      force: true,
    });
    cy.wait('@getScreen');
    cy.wait(1000);
    cy.get('[data-testid=editScreenModal]').should('be.visible');
    cy.get('[data-testid=editScreenModal] [data-testid=name]').focus();
    cy.wait(300);
    cy.get('[data-testid=editScreenModal] [data-testid=name]').clear();
    cy.wait(300);
    cy.get('[data-testid=editScreenModal] [data-testid=name]').type(
      'Screen Test 1',
    );
    cy.wait(300);
    cy.get(
      '[data-testid=editScreenModal] [data-testid=submitEditScreenButton]',
    ).click();

    cy.intercept(
      `${Cypress.env('Project_API')}api/screen/list?venue_id=${screensScreensData[0]?.id}&limit=10&offset=10&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensVenueListData.length,
          screens: [...screensVenueListData].slice(0, 10).map((screen, i) => ({
            ...screen,
            name: i === 0 ? 'Screen Test 1' : screen.name,
            venue_id: screensScreensData[0]?.id,
          })),
        },
      },
    ).as('getVenuedScreens');

    cy.wait('@updateScreen');
    cy.wait('@getUpdatedScreen');
    cy.wait('@getUpdatedVenue');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen Test 1');
  });

  it.skip('should delete screen', () => {
    cy.intercept(
      'DELETE',
      `${Cypress.env('Project_API')}api/screen?screen_id=${screensVenueListData[0]?.id}`,
      {
        success: true,
        data: null,
      },
    ).as('deleteScreen');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/?venue_id=${screensScreensData[0]?.id}`,
      {
        success: true,
        data: {
          ...screensScreensData[0],
        },
      },
    ).as('getUpdatedVenue');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(500);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenuedScreens');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen 1');
    cy.get(`[data-testid=deleteButton_${screensVenueListData[0]?.id}]`).click({
      force: true,
    });
    cy.get('[data-testid=deleteScreenModal]').should('be.visible');
    cy.get(
      '[data-testid=deleteScreenModal] [data-testid=deleteScreenButton]',
    ).click();

    cy.wait('@deleteScreen');
    cy.wait('@getUpdatedVenue');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`).should(
      'not.exist',
    );
  });

  it.skip('should create a new screen venue', () => {
    cy.intercept('POST', `${Cypress.env('Project_API')}api/venue`, {
      success: true,
      data: {
        id: 'Venue_New',
      },
    }).as('createVenue');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(500);
    cy.get('[data-testid=addScreenVenueButton]').click();
    cy.get('[data-testid=addScreenVenueModal]').should('be.visible');
    cy.get('[data-testid=addScreenVenueModal] [data-testid=name]').focus();
    cy.get('[data-testid=addScreenVenueModal] [data-testid=name]').type(
      'Venue New',
    );
    cy.get(
      '[data-testid=addScreenVenueModal] [data-testid=description]',
    ).focus();
    cy.wait(200);
    cy.get('[data-testid=addScreenVenueModal] [data-testid=description]').type(
      'Venue New Description',
    );
    cy.wait(200);
    cy.get(
      '[data-testid=addScreenVenueModal] [data-testid=submitButton]',
    ).click();

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/?venue_id=Venue_New`,
      {
        success: true,
        data: {
          id: 'Venue_New',
          name: 'Venue New',
          description: 'Venue New Description',
          created_at: '2021-01-01T00:00:00.000Z',
          updated_at: '2021-01-01T00:00:00.000Z',
        },
      },
    ).as('getNewVenue');

    cy.wait('@createVenue');
    cy.wait('@getNewVenue');

    cy.wait(500);
    cy.get('.filename').should('contain', 'Venue New');
  });

  it.skip('should update screen venue', () => {
    cy.intercept('PUT', '/api/venue', {
      success: true,
      data: {
        id: screensScreensData[0]?.id,
      },
    }).as('updateVenue');

    cy.intercept(
      `${Cypress.env('Project_API')}api/venue/?venue_id=${screensScreensData[0]?.id}`,
      {
        success: true,
        data: {
          ...screensScreensData[0],
          name: 'Venue Test 1',
        },
      },
    ).as('getUpdatedVenue');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(500);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get(`[data-testid=editButton_${screensScreensData[0]?.id}]`).click({
      force: true,
    });
    cy.get('[data-testid=editScreenVenueModal]').should('be.visible');
    cy.get('[data-testid=editScreenVenueModal] [data-testid=name]').focus();
    cy.wait(500);
    cy.get('[data-testid=editScreenVenueModal] [data-testid=name]').clear();
    cy.wait(500);
    cy.get('[data-testid=editScreenVenueModal] [data-testid=name]').type(
      'Venue Test 1',
    );
    cy.wait(500);
    cy.get(
      '[data-testid=editScreenVenueModal] [data-testid=submitButton]',
    ).click();

    cy.intercept(
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=0&order_by=name&direction=asc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].slice(0, 10).map((venue, i) => ({
            ...venue,
            name: i === 0 ? 'Venue Test 1' : venue.name,
          })),
        },
      },
    ).as('getScreenVenues');

    cy.wait('@updateVenue');
    cy.wait('@getUpdatedVenue');
    cy.wait(500);
    cy.get('.filename').first().should('contain', 'Venue Test 1');
  });

  it.skip('should delete screen venue', () => {
    cy.intercept(
      'DELETE',
      `${Cypress.env('Project_API')}api/venue?venue_id=${screensScreensData[0]?.id}`,
      {
        success: true,
        data: null,
      },
    ).as('deleteVenue');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.wait(500);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get(`[data-testid=deleteButton_${screensScreensData[0]?.id}]`).click({
      force: true,
    });
    cy.get('[data-testid=deleteScreenModal]').should('be.visible');
    cy.get(
      '[data-testid=deleteScreenModal] [data-testid=deleteScreenButton]',
    ).click();

    cy.wait('@deleteVenue');
    cy.get('.filename').first().should('not.contain', 'Venue 1');
  });

  it('should sort screens by name and change sort directions', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=0&order_by=name&direction=desc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].reverse().slice(0, 10),
        },
      },
    ).as('getScreenVenuesDesc');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=10&order_by=name&direction=desc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].reverse().slice(10, 20),
        },
      },
    ).as('getScreenVenuesDesc2');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=20&order_by=name&direction=desc`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: [...screensScreensData].reverse().slice(20, 30),
        },
      },
    ).as('getScreenVenuesDesc3');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}api/screen/list?venue_id=${screensScreensData[screensScreensData.length - 1]?.id}&limit=10&offset=0&order_by=name&direction=desc`,
      {
        success: true,
        data: {
          total: screensVenueListData.length,
          screens: [...screensVenueListData]
            .reverse()
            .slice(0, 10)
            .map((screen) => ({
              ...screen,
              venue_id: screensScreensData[screensScreensData.length - 1]?.id,
            })),
        },
      },
    ).as('getVenuedScreensDesc');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenuedScreens');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen 1');
    cy.get('[data-testid=openSortDropdownButton]').click();
    cy.get('[data-testid=sortKey_name]').click();
    cy.wait('@getScreenVenuesDesc');
    cy.get('.filename').first().should('contain', 'Venue 30');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenuedScreensDesc');
    cy.wait(1000);
    cy.get(
      `.ag-row[row-id=${screensVenueListData[screensVenueListData.length - 1]?.id}] .filename`,
    )
      .first()
      .should('contain', 'Screen 30');
    cy.get('[data-testid=sortDirectionButton]').click();
    cy.wait('@getScreenVenues');
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenuedScreens');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen 1');
  });

  it('should search for a screen by name', () => {
    cy.intercept(
      `${Cypress.env('Project_API')}api/venue/search?limit=10&offset=0&order_by=name&direction=asc&search=Screen%201`,
      {
        success: true,
        data: {
          total: screensScreensData.length,
          venues: screensScreensData.slice(0, 10),
        },
      },
    ).as('fetchVenues');

    cy.intercept(
      `${Cypress.env('Project_API')}api/screen/search?limit=10&offset=0&order_by=name&direction=asc&search=Screen%201`,
      {
        success: true,
        data: {
          total: 1,
          screens: [screensData[0]],
        },
      },
    ).as('searchScreens');

    cy.intercept(
      `${Cypress.env('Project_API')}api/screen/list?limit=10&offset=0&order_by=name&direction=asc&search=Screen%201`,
      {
        success: true,
        data: {
          total: 1,
          businesses: [screensData[0]],
        },
      },
    ).as('screensGetSearch');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.get('.filename').first().should('contain', 'Venue 1');
    cy.get('.ag-group-contracted').first().click();
    cy.wait('@getVenuedScreens');
    cy.wait(1000);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen 1');
    cy.get('[data-testid=openScreenSearchModal]').click();
    cy.get('[data-testid=searchModalInput]').should('be.visible');
    cy.get('[data-testid=searchModalInput]').type('Screen 1');
    cy.wait('@searchScreens');
    cy.get(`[data-testid=dropdownItem_${screensData[0]?.id}]`).should(
      'be.visible',
    );
    cy.get(`[data-testid=dropdownItem_${screensData[0]?.id}]`).click();
    cy.wait('@searchScreens');
    cy.wait(500);
    cy.get('.ag-cell[col-id=name]').first().should('contain', 'Screen 1');
    cy.get('[data-testid=searchText]').should('contain', 'Screen 1');
    cy.get('[data-testid=clearScreenSearch]').click();
    cy.wait('@getScreens');
    cy.wait('@getScreenVenues');
    cy.get('.filename').first().should('contain', 'Venue 1');
  });

  it.skip('should drag and drop a screen to a venue', () => {
    cy.intercept('PUT', `${Cypress.env('Project_API')}api/screen/toggle`, {
      success: true,
      data: null,
    }).as('toggleScreens');

    cy.visit('/resources/screens');
    cy.wait(['@getScreenVenues', '@getScreens']);
    cy.get('.filename').eq(1).should('contain', 'Venue 2');
    cy.get('.ag-group-contracted').eq(1).click();
    cy.wait('@getVenuedScreens');
    cy.wait(500);
    cy.get(`.ag-row[row-id=${screensVenueListData[0]?.id}] .filename`)
      .first()
      .should('contain', 'Screen 1');
    cy.get('.ag-body-viewport').scrollTo(0, 0);
    cy.get('.ag-row[row-id=VenueScreens_2] .ag-row-drag')
      .first()
      .trigger('mousedown', {button: 0, force: true});
    cy.get('.ag-body-viewport').trigger('mousemove', 50, 0, {force: true});
    cy.wait(500);
    cy.get('.ag-body-viewport').trigger('mouseup', {force: true});
    cy.wait('@toggleScreens');
    cy.get('.filename').first().should('contain', 'Venue 1');
  });
});
