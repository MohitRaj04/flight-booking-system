const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  airline: {
    name: { type: String, required: true },
    code: { type: String, required: true },
    logo: String
  },
  departure: {
    airport: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    terminal: String,
    gate: String,
    time: { type: Date, required: true }
  },
  arrival: {
    airport: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    terminal: String,
    gate: String,
    time: { type: Date, required: true }
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  stops: {
    type: Number,
    default: 0,
    min: 0
  },
  layovers: [{
    airport: String,
    city: String,
    duration: { hours: Number, minutes: Number }
  }],
  aircraft: {
    model: String,
    manufacturer: String
  },
  pricing: {
    economy: {
      price: { type: Number, required: true },
      seatsAvailable: { type: Number, default: 150 },
      totalSeats: { type: Number, default: 150 }
    },
    business: {
      price: Number,
      seatsAvailable: { type: Number, default: 30 },
      totalSeats: { type: Number, default: 30 }
    },
    firstClass: {
      price: Number,
      seatsAvailable: { type: Number, default: 10 },
      totalSeats: { type: Number, default: 10 }
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'in-air', 'landed', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'meals', 'entertainment', 'power-outlet', 'extra-legroom', 'lounge-access']
  }],
  baggageAllowance: {
    cabin: { weight: Number, pieces: Number },
    checked: { weight: Number, pieces: Number }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search performance
flightSchema.index({ 'departure.city': 1, 'arrival.city': 1, 'departure.time': 1 });
flightSchema.index({ status: 1 });
flightSchema.index({ 'pricing.economy.price': 1 });

// Virtual for formatted duration
flightSchema.virtual('formattedDuration').get(function() {
  return `${this.duration.hours}h ${this.duration.minutes}m`;
});

module.exports = mongoose.model('Flight', flightSchema);

