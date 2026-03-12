const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ==================== DASHBOARD ====================

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalFlights,
      totalBookings,
      activeFlights,
      confirmedBookings,
      cancelledBookings,
      revenueResult
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Flight.countDocuments(),
      Booking.countDocuments(),
      Flight.countDocuments({ isActive: true, status: 'scheduled' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$pricing.totalPrice' } } }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('flight', 'flightNumber airline departure arrival')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$pricing.totalPrice' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalFlights,
          totalBookings,
          activeFlights,
          confirmedBookings,
          cancelledBookings,
          totalRevenue: Math.round(totalRevenue * 100) / 100
        },
        recentBookings,
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== FLIGHT MANAGEMENT ====================

// @route   POST /api/admin/flights
// @desc    Create a new flight
// @access  Admin
router.post('/flights', async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Flight created successfully',
      data: flight
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/flights/:id
// @desc    Update a flight
// @access  Admin
router.put('/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    res.json({ success: true, message: 'Flight updated successfully', data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/flights/:id
// @desc    Delete a flight (soft delete)
// @access  Admin
router.delete('/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    res.json({ success: true, message: 'Flight deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/flights/:id/status
// @desc    Update flight status
// @access  Admin
router.put('/flights/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'boarding', 'departed', 'in-air', 'landed', 'delayed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const flight = await Flight.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    res.json({ success: true, message: `Flight status updated to ${status}`, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== USER MANAGEMENT ====================

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), totalResults: total }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== BOOKING MANAGEMENT ====================

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'firstName lastName email')
        .populate('flight', 'flightNumber airline departure arrival')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), totalResults: total }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

