const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  dateOfBirth: Date,
  passportNumber: String,
  nationality: String,
  seatNumber: String,
  seatClass: {
    type: String,
    enum: ['economy', 'business', 'firstClass'],
    default: 'economy'
  },
  specialRequests: [String],
  mealPreference: {
    type: String,
    enum: ['standard', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free'],
    default: 'standard'
  }
});

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  returnFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip', 'multi-city'],
    default: 'one-way'
  },
  passengers: [passengerSchema],
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'stripe'],
      required: true
    },
    stripePaymentIntentId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'boarded', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  cancellation: {
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'rejected']
    }
  },
  addOns: {
    extraBaggage: { type: Boolean, default: false },
    travelInsurance: { type: Boolean, default: false },
    priorityBoarding: { type: Boolean, default: false },
    loungeAccess: { type: Boolean, default: false }
  },
  checkInStatus: {
    type: String,
    enum: ['not-checked-in', 'online-check-in', 'airport-check-in'],
    default: 'not-checked-in'
  },
  boardingPass: {
    generated: { type: Boolean, default: false },
    url: String
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = 'FB-';
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.bookingReference = reference;
  }
  next();
});

// Index for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ 'payment.status': 1 });

module.exports = mongoose.model('Booking', bookingSchema);

