const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { protect } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { flightId, returnFlightId, tripType, passengers, contactInfo, seatClass, addOns } = req.body;

    // Validate flight exists and has available seats
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const classKey = seatClass || 'economy';
    if (flight.pricing[classKey].seatsAvailable < passengers.length) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    // Calculate pricing
    const basePrice = flight.pricing[classKey].price * passengers.length;
    const taxes = basePrice * 0.12; // 12% tax
    const fees = 15 * passengers.length; // $15 per passenger service fee
    let addOnsCost = 0;

    if (addOns) {
      if (addOns.extraBaggage) addOnsCost += 50 * passengers.length;
      if (addOns.travelInsurance) addOnsCost += 30 * passengers.length;
      if (addOns.priorityBoarding) addOnsCost += 20 * passengers.length;
      if (addOns.loungeAccess) addOnsCost += 45 * passengers.length;
    }

    const totalPrice = basePrice + taxes + fees + addOnsCost;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      returnFlight: returnFlightId || null,
      tripType: tripType || 'one-way',
      passengers: passengers.map(p => ({ ...p, seatClass: classKey })),
      contactInfo,
      payment: {
        method: 'stripe',
        amount: totalPrice,
        currency: 'USD',
        status: 'pending'
      },
      pricing: {
        basePrice,
        taxes: Math.round(taxes * 100) / 100,
        fees,
        discount: 0,
        totalPrice: Math.round(totalPrice * 100) / 100
      },
      addOns: addOns || {},
      status: 'pending'
    });

    // Update available seats
    flight.pricing[classKey].seatsAvailable -= passengers.length;
    await flight.save();

    // Populate booking with flight details
    await booking.populate('flight', 'flightNumber airline departure arrival duration');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('flight', 'flightNumber airline departure arrival duration pricing status')
        .populate('returnFlight', 'flightNumber airline departure arrival duration')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalResults: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('flight')
      .populate('returnFlight');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/reference/:ref
// @desc    Get booking by reference number
// @access  Private
router.get('/reference/:ref', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.ref.toUpperCase(),
      user: req.user._id
    }).populate('flight').populate('returnFlight');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    // Calculate refund (full refund if > 24hrs before departure)
    const flight = await Flight.findById(booking.flight);
    const hoursUntilDeparture = (new Date(flight.departure.time) - new Date()) / (1000 * 60 * 60);
    
    let refundPercentage = 0;
    if (hoursUntilDeparture > 72) refundPercentage = 100;
    else if (hoursUntilDeparture > 24) refundPercentage = 75;
    else if (hoursUntilDeparture > 6) refundPercentage = 50;
    else refundPercentage = 0;

    const refundAmount = (booking.pricing.totalPrice * refundPercentage) / 100;

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledAt: new Date(),
      reason: req.body.reason || 'User requested cancellation',
      refundAmount: Math.round(refundAmount * 100) / 100,
      refundStatus: refundAmount > 0 ? 'pending' : 'rejected'
    };
    await booking.save();

    // Restore available seats
    const classKey = booking.passengers[0]?.seatClass || 'economy';
    flight.pricing[classKey].seatsAvailable += booking.passengers.length;
    await flight.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        bookingReference: booking.bookingReference,
        refundAmount,
        refundPercentage,
        refundStatus: booking.cancellation.refundStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/checkin
// @desc    Online check-in
// @access  Private
router.put('/:id/checkin', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('flight');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Booking must be confirmed for check-in' });
    }

    // Check if within check-in window (24 hours before departure)
    const hoursUntilDeparture = (new Date(booking.flight.departure.time) - new Date()) / (1000 * 60 * 60);
    if (hoursUntilDeparture > 24 || hoursUntilDeparture < 1) {
      return res.status(400).json({
        success: false,
        message: 'Check-in is available 24 hours to 1 hour before departure'
      });
    }

    booking.status = 'checked-in';
    booking.checkInStatus = 'online-check-in';
    booking.boardingPass = { generated: true, url: `/api/bookings/${booking._id}/boarding-pass` };
    await booking.save();

    res.json({
      success: true,
      message: 'Check-in successful! Boarding pass generated.',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

