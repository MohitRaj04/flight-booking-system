const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/create-intent
// @desc    Create a Stripe payment intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.payment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Payment already completed' });
    }

    // In production, you would use Stripe SDK:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(booking.pricing.totalPrice * 100), // cents
    //   currency: 'usd',
    //   metadata: { bookingId: booking._id.toString(), bookingRef: booking.bookingReference }
    // });

    // Simulated payment intent for demo
    const paymentIntent = {
      id: `pi_demo_${Date.now()}`,
      client_secret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(booking.pricing.totalPrice * 100),
      currency: 'usd',
      status: 'requires_payment_method'
    };

    booking.payment.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        amount: booking.pricing.totalPrice,
        currency: 'USD',
        bookingReference: booking.bookingReference
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment (webhook simulation)
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.payment.status = 'completed';
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      message: 'Payment confirmed! Booking is now confirmed.',
      data: {
        bookingReference: booking.bookingReference,
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        totalPaid: booking.pricing.totalPrice
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund for cancelled booking
// @access  Private
router.post('/refund', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'cancelled') {
      return res.status(400).json({ success: false, message: 'Only cancelled bookings can be refunded' });
    }

    if (!booking.cancellation || booking.cancellation.refundStatus === 'processed') {
      return res.status(400).json({ success: false, message: 'Refund already processed' });
    }

    // In production: stripe.refunds.create({ payment_intent: booking.payment.stripePaymentIntentId, amount: refundAmountInCents });

    booking.cancellation.refundStatus = 'processed';
    booking.payment.status = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        bookingReference: booking.bookingReference,
        refundAmount: booking.cancellation.refundAmount,
        refundStatus: 'processed'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

