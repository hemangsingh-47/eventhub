const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_fallback_key_12345');
const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create Stripe Checkout Session
// @route   POST /api/tickets/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.availableSeats <= 0) return res.status(400).json({ message: 'Event is sold out' });

    const existingTicket = await Ticket.findOne({ user: req.user._id, event: eventId, status: { $in: ['paid', 'checked-in'] } });
    if (existingTicket) return res.status(400).json({ message: 'You already have a valid ticket for this event.' });

    // Ensure frontend URL is set properly in .env for redirects
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Create a pending ticket first to hold the reference
    const pendingTicket = await Ticket.create({
      user: req.user._id,
      event: eventId,
      stripeSessionId: 'pending', // Will be updated shortly
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ticket: ${event.title}`,
              description: `Admission to ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
            },
            unit_amount: event.price * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/my-tickets?success=true`,
      cancel_url: `${frontendUrl}/events/${eventId}?canceled=true`,
      client_reference_id: pendingTicket._id.toString(), // Extremely important for the webhook
      customer_email: req.user.email,
    });

    // Update pending ticket with the real session ID
    pendingTicket.stripeSessionId = session.id;

    // --- Developer Convenience: Auto-Fulfill in Local Dev ---
    // Since local webhooks are hard to set up, we auto-fulfill in dev mode
    // so the user can immediately see their tickets and QR codes.
    if (process.env.NODE_ENV !== 'production' || !process.env.STRIPE_WEBHOOK_SECRET) {
      pendingTicket.status = 'paid';
      pendingTicket.purchaseDate = new Date();
      pendingTicket.qrCodeData = uuidv4();
      await pendingTicket.save();

      // Deduct seat
      await Event.findByIdAndUpdate(eventId, {
        $inc: { availableSeats: -1 },
        $addToSet: { attendees: req.user._id }
      });
      console.log('DEV MODE: Ticket auto-fulfilled for testing.');
    } else {
      await pendingTicket.save();
    }

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle Stripe Webhook
// @route   POST /api/tickets/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const ticketId = session.client_reference_id;

    if (ticketId) {
      try {
        const ticket = await Ticket.findById(ticketId);
        if (ticket && ticket.status === 'pending') {
          ticket.status = 'paid';
          ticket.purchaseDate = new Date();
          ticket.qrCodeData = uuidv4(); // Generate unique secure value for QR

          await ticket.save();

          // Deduct a seat from the generic event capacity
          await Event.findByIdAndUpdate(ticket.event, {
            $inc: { availableSeats: -1 },
            $addToSet: { attendees: ticket.user }
          });

          // Reward the student 10 campus points for buying a ticket, like RSVPs
          await User.findByIdAndUpdate(ticket.user, {
            $inc: { points: 10 }
          });

          console.log(`Ticket ${ticketId} successfully marked as PAID and QR Code generated.`);
        }
      } catch (dbError) {
        console.error('Error updating DB during webhook:', dbError);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

// @desc    Get user's purchased tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id, status: { $ne: 'pending' } })
      .populate('event')
      .sort({ purchaseDate: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a QR code (For Organizers)
// @route   GET /api/tickets/validate/:qrCodeData
// @access  Private Organizers
const validateTicket = async (req, res) => {
  try {
    // Basic organizer check
    if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Not authorized.'});

    const ticket = await Ticket.findOne({ qrCodeData: req.params.qrCodeData })
        .populate('user', 'name email profileImage')
        .populate('event', 'title organizerId');

    if (!ticket) return res.status(404).json({ message: 'Invalid or unrecognized QR Code.' });
    
    // Ensure the organizer validating the ticket actually owns the event
    if (ticket.event.organizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Ticket does not belong to your events.' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a ticket as Checked-In (For Organizers)
// @route   POST /api/tickets/checkin/:qrCodeData
// @access  Private Organizers
const checkInTicket = async (req, res) => {
    try {
      if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Not authorized.'});
      
      const ticket = await Ticket.findOne({ qrCodeData: req.params.qrCodeData }).populate('event');
      if (!ticket) return res.status(404).json({ message: 'Invalid QR Code.' });
      
      if (ticket.event.organizerId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Ticket does not belong to your events.' });
      }

      if (ticket.status === 'checked-in') {
          return res.status(400).json({ message: 'This ticket has already been checked-in.' });
      }

      if (ticket.status !== 'paid') {
          return res.status(400).json({ message: 'This ticket is not valid for check-in.' });
      }

      ticket.status = 'checked-in';
      ticket.checkInDate = new Date();
      await ticket.save();

      res.json({ message: 'Ticket successfully checked-in.', ticket });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = {
  createCheckoutSession,
  stripeWebhook,
  getMyTickets,
  validateTicket,
  checkInTicket
};
