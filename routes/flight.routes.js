const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const { protect } = require('../middleware/auth');

// @route   GET /api/flights/search
// @desc    Search flights with filters
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      from,
      to,
      departDate,
      returnDate,
      passengers = 1,
      class: seatClass = 'economy',
      stops,
      airline,
      minPrice,
      maxPrice,
      sortBy = 'price',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { isActive: true, status: { $ne: 'cancelled' } };

    if (from) query['departure.city'] = new RegExp(from, 'i');
    if (to) query['arrival.city'] = new RegExp(to, 'i');
    
    if (departDate) {
      const startOfDay = new Date(departDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(departDate);
      endOfDay.setHours(23, 59, 59, 999);
      query['departure.time'] = { $gte: startOfDay, $lte: endOfDay };
    }

    if (stops !== undefined) query.stops = parseInt(stops);
    if (airline) query['airline.name'] = new RegExp(airline, 'i');

    // Price filter
    const priceField = `pricing.${seatClass}.price`;
    if (minPrice || maxPrice) {
      query[priceField] = {};
      if (minPrice) query[priceField].$gte = parseFloat(minPrice);
      if (maxPrice) query[priceField].$lte = parseFloat(maxPrice);
    }

    // Check seat availability
    query[`pricing.${seatClass}.seatsAvailable`] = { $gte: parseInt(passengers) };

    // Sort options
    const sortOptions = {};
    switch (sortBy) {
      case 'price': sortOptions[priceField] = 1; break;
      case 'price-desc': sortOptions[priceField] = -1; break;
      case 'duration': sortOptions['duration.hours'] = 1; break;
      case 'departure': sortOptions['departure.time'] = 1; break;
      case 'arrival': sortOptions['arrival.time'] = 1; break;
      default: sortOptions[priceField] = 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [flights, total] = await Promise.all([
      Flight.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Flight.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        flights,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalResults: total,
          resultsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/flights/:id
// @desc    Get flight details by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.json({ success: true, data: flight });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/flights/popular/routes
// @desc    Get popular flight routes
// @access  Public
router.get('/popular/routes', async (req, res) => {
  try {
    const popularRoutes = await Flight.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { from: '$departure.city', to: '$arrival.city' },
          minPrice: { $min: '$pricing.economy.price' },
          flightCount: { $sum: 1 },
          airlines: { $addToSet: '$airline.name' }
        }
      },
      { $sort: { flightCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, data: popularRoutes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/flights/status/:flightNumber
// @desc    Get real-time flight status
// @access  Public
router.get('/status/:flightNumber', async (req, res) => {
  try {
    const flight = await Flight.findOne({
      flightNumber: req.params.flightNumber.toUpperCase()
    });

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    res.json({
      success: true,
      data: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departure: flight.departure,
        arrival: flight.arrival,
        status: flight.status,
        duration: flight.duration
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

