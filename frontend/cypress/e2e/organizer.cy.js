describe('Organizer Check-In Flow', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('GET', '/api/analytics/overview', {
      statusCode: 200,
      body: {
        totalEvents: 5,
        totalRSVPs: 120,
        totalCapacity: 500,
        totalRevenue: 1250.50
      }
    }).as('getOverview');

    cy.intercept('GET', '/api/tickets/validate/fake-uuid-123', {
      statusCode: 200,
      body: {
        _id: 'fake-ticket-id',
        status: 'paid',
        isValid: true,
        user: {
           name: 'Valid Student',
           email: 'student@test.com'
        },
        event: {
          title: 'Awesome Workshop'
        }
      }
    }).as('validateTicket');

    cy.intercept('POST', '/api/tickets/checkin/fake-uuid-123', {
      statusCode: 200,
      body: {
        message: 'Ticket successfully checked-in.',
        ticket: { status: 'checked-in' }
      }
    }).as('checkInTicket');

    // Mock Organizer Login
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-organizer-token');
      win.localStorage.setItem('user', JSON.stringify({
        _id: 'fake-organizer-id',
        name: 'Test Organizer',
        email: 'organizer@test.com',
        role: 'organizer'
      }));
    });
  });

  it('Allows an organizer to view revenue, scan a valid ticket, and admit the attendee', () => {
    // 1. Visit Dashboard
    cy.visit('/dashboard');
    cy.wait('@getOverview'); // Wait for mock to resolve

    // 2. Verify Revenue Card Exists
    cy.contains('Ticket Revenue').should('be.visible');
    cy.contains('$1250.50').should('be.visible'); // Validate the revenue displays correctly
    
    // 3. Find the Ticket Scanner input
    cy.get('input[placeholder="Enter Ticket UUID..."]').should('be.visible');

    // 4. Type the Mock UUID and Submit
    cy.get('input[placeholder="Enter Ticket UUID..."]').type('fake-uuid-123');
    cy.get('button[type="submit"]').click();

    // Wait for the validation API call
    cy.wait('@validateTicket');

    // 5. Verify the Student Name and "Admit Attendee" button appear
    cy.contains('Valid Student').should('be.visible');
    cy.get('button').contains('Admit Attendee').should('be.visible');

    // 6. Click Admit
    cy.get('button').contains('Admit Attendee').click();
    cy.wait('@checkInTicket');

    // 7. Button should transition to "Already Checked-In"
    cy.get('button').contains('Already Checked-In').should('be.disabled');
  });
});
