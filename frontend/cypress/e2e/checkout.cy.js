describe('Ticket Checkout Flow', () => {
  beforeEach(() => {
    // Intercept API calls to mock responses instead of hitting real DB/Stripe
    cy.intercept('GET', '/api/events/*', {
      statusCode: 200,
      body: {
        _id: 'fake-event-id',
        title: 'Tech Conference 2026',
        description: 'A great tech conference.',
        date: '2026-10-10T00:00:00.000Z',
        time: '10:00 AM',
        location: 'Main Hall',
        category: 'tech',
        totalSeats: 100,
        availableSeats: 50,
        price: 25.00,
        isPaid: true
      }
    }).as('getEvent');

    cy.intercept('POST', '/api/tickets/create-checkout-session', {
      statusCode: 200,
      body: {
        url: '/my-tickets?success=true' // Mock redirecting to success page directly
      }
    }).as('createSession');
    
    cy.intercept('GET', '/api/tickets/my-tickets', {
      statusCode: 200,
      body: [{
        _id: 'fake-ticket-id',
        status: 'paid',
        qrCodeData: 'fake-uuid-123',
        purchaseDate: new Date().toISOString(),
        event: {
          _id: 'fake-event-id',
          title: 'Tech Conference 2026',
          price: 25.00,
          date: '2026-10-10T00:00:00.000Z',
          location: 'Main Hall',
          time: '10:00 AM'
        }
      }]
    }).as('getMyTickets');

    // Mute login prompt for testing RSVP button
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-token');
      win.localStorage.setItem('user', JSON.stringify({
        _id: 'fake-user-id',
        name: 'Test Student',
        email: 'student@test.com',
        role: 'student'
      }));
    });
  });

  it('Allows a student to click buy ticket and see the generated QR code', () => {
    // 1. Visit the event details page
    cy.visit('/events/fake-event-id');
    cy.wait('@getEvent');

    // 2. Button should display the price
    cy.get('button').contains('Buy Ticket — $25.00').should('be.visible');

    // 3. Click the Buy Ticket button
    cy.get('button').contains('Buy Ticket — $25.00').click();
    cy.wait('@createSession');

    // 4. Assuming the app redirects to the mocked Stripe URL (which we mocked to /my-tickets?success=true)
    cy.visit('/my-tickets?success=true');
    cy.wait('@getMyTickets');

    // 5. Verify the success banner appears
    cy.contains('Payment Successful!').should('be.visible');

    // 6. Verify the QR Code SVG is rendered
    cy.get('svg').should('exist'); // qrcode.react renders an SVG
    
    // 7. Verify ticket details
    cy.contains('Tech Conference 2026').should('be.visible');
    cy.contains('PAID').should('be.visible');
    cy.contains('$25.00').should('be.visible');
  });
});
