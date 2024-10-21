import {VenueAdminData} from '@/types/venues';
import {OrdersAdminData, OrdersAdminListData} from '../../types/orders';
const Orders: OrdersAdminListData[] = Array.from({length: 30}, (_, i) => ({
  id: `id${i}`,
  business_id: 'biz_1',
  product_id: `product_id${i}`,
  venue_id: `venue_id${i}`,
  shipping_id: `shipping_id${i}`,
  name: `name${i}`,
  status: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const GetOrders: OrdersAdminData[] = Array.from({length: 30}, (_, i) => ({
  product_id: `product_id${i}`,
  venue_id: `venue_id${i}`,
  business_id: 'biz_1',
  quantity: 3,
  shipping_address_1: `shipping_address_1${i}`,
  shipping_address_2: `shipping_address_2${i}`,
  shipping_city: `shipping_city${i}`,
  shipping_state_code: `US-NY`,
  shipping_country_code: `US`,
  shipping_zip: `12345`,
  notes: {
    order_notes: `order_notes${i}`,
  },
  id: `id${i}`,
  shipping_id: `shipping_id${i}`,
  name: `name${i}`,
  status: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const VenueList: VenueAdminData[] = Array.from({length: 20}, (_, i) => ({
  id: `venue_id${i}`,
  business_id: 'biz_1',
  name: `name${i}`,
  description: `description${i}`,
  address_1: `address_1${i}`,
  address_2: `address_2${i}`,
  city: `city${i}`,
  state_code: `US-NY`,
  country_code: `US`,
  zip: `12345`,
  latitude: 0,
  longitude: 0,
  status: 2,
  venue_type_id: 'venue_type_id',
  notes: {
    venue_notes: `venue_notes${i}`,
    approved_by: '',
    declined_by: '',
    decline_reason: '',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

describe('Orders', () => {
  beforeEach(() => {
    cy.fixture('userData.json').then((user) => {
      const {email, password} = user;
      cy.login(email, password, '/sign-up');
    });

    cy.intercept(
      `${Cypress.env('Project_API')}admin/order/list?business_id=biz_1&limit=10&offset=0&order_by=name&direction=asc&status=2`,
      {
        success: true,
        data: {
          total: Orders.length,
          orders: [...Orders].slice(0, 10).map((order) => ({
            ...order,
            status: 2,
          })),
        },
      },
    ).as('listOrders');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/order/list?business_id=biz_1&limit=10&offset=0&order_by=name&direction=asc&status=1`,
      {
        success: true,
        data: {
          total: Orders.length,
          orders: Orders,
        },
      },
    ).as('pendingListOrders');

    cy.intercept(`/admin/businesses/orders/items/id1/`, {
      success: true,
      data: GetOrders[0],
    }).as('getOrder');

    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/order/?order_id=id1`,
      {
        success: true,
        data: GetOrders[0],
      },
    ).as('fetchOrder');

    cy.intercept('POST', `${Cypress.env('Project_API')}admin/order`, {
      success: true,
      data: {
        id: 'new_order_id',
      },
    }).as('createOrder');

    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/order`, {
      success: true,
      data: {
        id: 'id1',
      },
    }).as('updateOrder');

    cy.intercept(
      `${Cypress.env('Project_API')}admin/venue/list?business_id=biz_1`,
      {
        success: true,
        data: {
          total: VenueList.length,
          venues: VenueList,
        },
      },
    ).as('venueList');

    cy.intercept(
      'DELETE',
      `${Cypress.env('Project_API')}admin/order?order_id=id1`,
      {
        success: true,
        data: null,
      },
    ).as('deleteOrder');

    /*
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/order/list?&limit=10&offset=0&order_by=name&direction=asc&search=test&status=1`,
      {
        success: true,
        data: {
          total: {...Orders}.slice(0, 5).length,
          orders: Orders.map((order, i) => ({
            ...order,
            name: `Test Name ${i}`,
          })),
        },
      },
    ).as('searchOrders');
    */
  });

  it('should list orders', () => {
    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.wait(500);
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('.ag-row').should('exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .first()
      .should('have.text', 'name0');
  });

  it('should switch filter to pending orders', () => {
    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('[data-testid="filterButton"]').click();
    cy.get(
      '[data-testid="filterDesktopDropdown"] [data-testid="checkmarkButton_Pending"]',
    ).click();
    cy.wait('@pendingListOrders');
    cy.get('[data-testid="pageHeading"]').should('have.text', 'Pending Orders');
    cy.get('.ag-row').should('exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .eq(1)
      .should('have.text', 'PENDING');
  });

  it('should switch filter to pending orders and edit order', () => {
    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('[data-testid="filterButton"]').click();
    cy.get(
      '[data-testid="filterDesktopDropdown"] [data-testid="checkmarkButton_Pending"]',
    ).click();
    cy.wait('@pendingListOrders');
    cy.get('[data-testid="pageHeading"]').should('have.text', 'Pending Orders');
    cy.get('.ag-row').should('exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .eq(1)
      .should('have.text', 'PENDING');
    cy.get('[data-testid="editButton_id1"]').click();
    cy.wait('@getOrder');
    cy.get('[data-testid="editOrderModal"]').should('be.visible');
    cy.get(
      '[data-testid="editOrderModal"] [data-testid="submitEditOrderButton"]',
    ).should('have.text', 'Update');
    cy.get(
      '[data-testid="editOrderModal"] [data-testid="backEditOrderButton"]',
    ).should('have.text', 'Cancel');
    cy.get('[data-testid="editOrderModal"] [data-testid="address_2"]').type(
      'test',
    );
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/order/?order_id=id1`,
      {
        ...GetOrders[0],
        address_2: 'test',
      },
    ).as('getUpdatedOrder');
    cy.get(
      '[data-testid="editOrderModal"] [data-testid="submitEditOrderButton"]',
    ).click();
    cy.wait('@updateOrder');
    cy.wait('@getUpdatedOrder');
    cy.get('[data-testid="editOrderModal"]').should('not.exist');
  });

  it('should switch filter to pending orders and delete order', () => {
    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('[data-testid="filterButton"]').click();
    cy.get(
      '[data-testid="filterDesktopDropdown"] [data-testid="checkmarkButton_Pending"]',
    ).click();
    cy.wait('@pendingListOrders');
    cy.get('[data-testid="pageHeading"]').should('have.text', 'Pending Orders');
    cy.get('.ag-row').should('exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .eq(1)
      .should('have.text', 'PENDING');
    cy.get('[data-testid="deleteButton_id1"]').click();
    cy.get('[data-testid="deleteOrderModal"]').should('be.visible');
    cy.get(
      '[data-testid="deleteOrderModal"] [data-testid="adminDeleteOrderButton"]',
    ).click();
    cy.wait('@deleteOrder');
    cy.get('[data-testid="deleteButton_id1"]').should('not.exist');
    cy.get('[data-testid="deleteOrderModal"]').should('not.be.visible');
  });

  it('should create order', () => {
    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('[data-testid="filterButton"]').click();
    cy.get(
      '[data-testid="filterDesktopDropdown"] [data-testid="checkmarkButton_Pending"]',
    ).click();
    cy.wait('@pendingListOrders');
    cy.get('[data-testid="pageHeading"]').should('have.text', 'Pending Orders');
    cy.get('[data-testid="adminAddOrderButton"]').click();
    cy.get('[data-testid="orderModal"]').should('be.visible');
    cy.wait(500);
    cy.get('[data-testid="orderModal"] [data-testid="nextOrderButton"]').should(
      'have.text',
      'Next',
    );
    cy.get('[data-testid="orderModal"] [data-testid="increaseCounter"]')
      .click()
      .click()
      .click();
    cy.get('[data-testid="projectPlayerCounter"]').should('have.value', '4');
    cy.get(
      '[data-testid="orderModal"] [data-testid="nextOrderButton"]',
    ).click();
    cy.wait(500);
    cy.get(
      '[data-testid="orderModal"] [data-testid="selectVenueForOrderDropdown"]',
    ).click();
    cy.get(
      '[data-testid="selectFuzzyModal_selectVenueForOrderDropdown"] [data-testid="dropdownItem_name1"]',
    ).click();
    cy.get(
      '[data-testid="orderModal"] [data-testid="nextOrderButton"]',
    ).click();
    cy.wait(1000);
    cy.get('[data-testid="checkmarkButton_shipToVenue"]').click();
    cy.get('[data-testid="orderModal"] [data-testid="address_1"]').type('1234');
    cy.wait(1000);
    cy.get('.pac-item').first().click();
    cy.get('[data-testid="orderModal"] [data-testid="address_2"]').type('Test');
    cy.get(
      '[data-testid="orderModal"] [data-testid="nextOrderButton"]',
    ).click();
    cy.wait(1000);
    cy.get('[data-testid="checkInfoProjectPlayerCounter"]').should(
      'have.text',
      '4',
    );
    cy.get('[data-testid="checkInfoProjectVenueName"]').should(
      'have.text',
      'name1',
    );
    cy.get('[data-testid="checkInfoShippingAddress"]').should(
      'have.text',
      '1234 Long Pond Road, Test Long Pond, US-PA, 18334US',
    );
    cy.get(
      '[data-testid="orderModal"] [data-testid="nextOrderButton"]',
    ).click();
    const newOrder = {
      id: 'new_order_id',
      product_id: 'product_id_create',
      venue_id: 'venue_id_create',
      shipping_id: 'shipping_id_create',
      name: 'A New Order 1',
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as OrdersAdminListData;
    //console.log('newOrder', newOrder, Orders);
    cy.intercept(
      'GET',
      `${Cypress.env('Project_API')}admin/order/?order_id=new_order_id`,
      {
        success: true,
        data: newOrder,
      },
    ).as('fetchNewOrder');
    cy.intercept(
      `${Cypress.env('Project_API')}admin/order/list?business_id=biz_1&limit=10&offset=0&order_by=name&direction=asc&status=1`,
      {
        success: true,
        data: {
          total: Orders.length + 1,
          orders: [newOrder, ...[...Orders].slice(0, 9)],
        },
      },
    ).as('newPendingListOrders');
    cy.intercept(
      `${Cypress.env('Project_API')}admin/order/list?business_id=biz_1&limit=10&offset=10&order_by=name&direction=asc&status=1`,
      {
        success: true,
        data: {
          total: Orders.length + 1,
          orders: [...Orders].slice(9, 19),
        },
      },
    ).as('newPendingListOrders2');
    cy.intercept(
      `${Cypress.env('Project_API')}admin/order/list?business_id=biz_1&limit=10&offset=20&order_by=name&direction=asc&status=1`,
      {
        success: true,
        data: {
          total: Orders.length + 1,
          orders: [...Orders].slice(19, 29),
        },
      },
    ).as('newPendingListOrders3');
    cy.wait('@createOrder');
    cy.get(
      '[data-testid="orderModal"] [data-testid="nextOrderButton"]',
    ).click();
    //cy.wait('@fetchNewOrder');
    cy.wait('@newPendingListOrders');
  });

  it('should approve a pending order', () => {
    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/order/approve`, {
      success: true,
      data: null,
    }).as('approveOrder');

    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('[data-testid="filterButton"]').click();
    cy.get(
      '[data-testid="filterDesktopDropdown"] [data-testid="checkmarkButton_Pending"]',
    ).click();
    cy.wait('@pendingListOrders');
    cy.get('[data-testid="pageHeading"]').should('have.text', 'Pending Orders');
    cy.get('.ag-row').should('exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .first()
      .should('have.text', 'name0');
    cy.intercept('/admin/businesses/orders/items/id0/', {
      success: true,
      data: GetOrders[0],
    }).as('getOrder0');
    cy.get('[data-testid="editButton_id0"]').click();
    cy.wait('@getOrder0');
    cy.get('[data-testid="editOrderModal"]').should('be.visible');
    cy.get('[data-testid="approveEditOrderButton"]').click();
    cy.get('[data-testid="approveOrderSubmit"]').click();
    cy.wait('@approveOrder');
    cy.get('[data-testid="editOrderModal"]').should('not.exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .first()
      .should('not.have.text', 'name0');
  });

  it('should decline a pending order', () => {
    cy.intercept('PUT', `${Cypress.env('Project_API')}admin/order/decline`, {
      success: true,
      data: null,
    }).as('declineOrder');

    cy.visit('/admin/businesses/orders/biz_1/');
    cy.wait('@listOrders');
    cy.get('[data-testid="pageHeading"]').should(
      'have.text',
      'Approved Orders',
    );
    cy.get('[data-testid="filterButton"]').click();
    cy.get(
      '[data-testid="filterDesktopDropdown"] [data-testid="checkmarkButton_Pending"]',
    ).click();
    cy.wait('@pendingListOrders');
    cy.get('[data-testid="pageHeading"]').should('have.text', 'Pending Orders');
    cy.get('.ag-row').should('exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .first()
      .should('have.text', 'name0');
    cy.intercept('/admin/businesses/orders/items/id0/', {
      success: true,
      data: GetOrders[0],
    }).as('getOrder0');
    cy.get('[data-testid="editButton_id0"]').click();
    cy.wait('@getOrder0');
    cy.get('[data-testid="editOrderModal"]').should('be.visible');
    cy.get('[data-testid="denyEditOrderButton"]').click();
    cy.get('[data-testid="denyOrderSubmit"]').click();
    cy.wait('@declineOrder');
    cy.get('[data-testid="editOrderModal"]').should('not.exist');
    cy.get('.ag-row')
      .first()
      .get('.ag-cell')
      .first()
      .should('not.have.text', 'name0');
  });
});
