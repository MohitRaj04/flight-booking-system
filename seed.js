const mongoose = require('mongoose');
const Flight = require('./models/Flight');
require('dotenv').config();

const flights = [
  {
    flightNumber: 'SK-101',
    airline: { name: 'SkyAir', code: 'SA', logo: '' },
    departure: { airport: 'JFK', city: 'New York', country: 'USA', terminal: 'T4', gate: 'B22', time: new Date('2025-07-15T08:00:00Z') },
    arrival: { airport: 'LHR', city: 'London', country: 'UK', terminal: 'T5', gate: 'A10', time: new Date('2025-07-15T16:00:00Z') },
    duration: { hours: 8, minutes: 0 }, stops: 0,
    aircraft: { model: '787 Dreamliner', manufacturer: 'Boeing' },
    pricing: { economy: { price: 450, seatsAvailable: 150, totalSeats: 150 }, business: { price: 1200, seatsAvailable: 30, totalSeats: 30 }, firstClass: { price: 2500, seatsAvailable: 10, totalSeats: 10 } },
    amenities: ['wifi', 'meals', 'entertainment', 'power-outlet'],
    baggageAllowance: { cabin: { weight: 7, pieces: 1 }, checked: { weight: 23, pieces: 2 } }
  },
  {
    flightNumber: 'GA-205',
    airline: { name: 'Global Airways', code: 'GA', logo: '' },
    departure: { airport: 'LAX', city: 'Los Angeles', country: 'USA', terminal: 'T2', gate: 'C15', time: new Date('2025-07-16T14:00:00Z') },
    arrival: { airport: 'NRT', city: 'Tokyo', country: 'Japan', terminal: 'T1', gate: 'D8', time: new Date('2025-07-17T06:30:00Z') },
    duration: { hours: 11, minutes: 30 }, stops: 0,
    aircraft: { model: 'A350-900', manufacturer: 'Airbus' },
    pricing: { economy: { price: 680, seatsAvailable: 180, totalSeats: 180 }, business: { price: 2200, seatsAvailable: 40, totalSeats: 40 }, firstClass: { price: 4500, seatsAvailable: 8, totalSeats: 8 } },
    amenities: ['wifi', 'meals', 'entertainment', 'power-outlet', 'extra-legroom'],
    baggageAllowance: { cabin: { weight: 7, pieces: 1 }, checked: { weight: 23, pieces: 2 } }
  },
  {
    flightNumber: 'AT-412',
    airline: { name: 'AeroTransit', code: 'AT', logo: '' },
    departure: { airport: 'ORD', city: 'Chicago', country: 'USA', terminal: 'T1', gate: 'A5', time: new Date('2025-07-18T06:00:00Z') },
    arrival: { airport: 'CDG', city: 'Paris', country: 'France', terminal: 'T2', gate: 'B3', time: new Date('2025-07-18T18:00:00Z') },
    duration: { hours: 10, minutes: 0 }, stops: 1,
    layovers: [{ airport: 'YUL', city: 'Montreal', duration: { hours: 1, minutes: 30 } }],
    aircraft: { model: '777-300ER', manufacturer: 'Boeing' },
    pricing: { economy: { price: 520, seatsAvailable: 160, totalSeats: 160 }, business: { price: 1800, seatsAvailable: 25, totalSeats: 25 }, firstClass: { price: 3800, seatsAvailable: 6, totalSeats: 6 } },
    amenities: ['wifi', 'meals', 'entertainment'],
    baggageAllowance: { cabin: { weight: 7, pieces: 1 }, checked: { weight: 23, pieces: 1 } }
  },
  {
    flightNumber: 'PR-780',
    airline: { name: 'Premium Air', code: 'PR', logo: '' },
    departure: { airport: 'SFO', city: 'San Francisco', country: 'USA', terminal: 'T3', gate: 'E12', time: new Date('2025-07-20T22:00:00Z') },
    arrival: { airport: 'SYD', city: 'Sydney', country: 'Australia', terminal: 'T1', gate: 'F5', time: new Date('2025-07-22T08:00:00Z') },
    duration: { hours: 15, minutes: 0 }, stops: 1,
    layovers: [{ airport: 'AKL', city: 'Auckland', duration: { hours: 2, minutes: 0 } }],
    aircraft: { model: 'A380-800', manufacturer: 'Airbus' },
    pricing: { economy: { price: 890, seatsAvailable: 200, totalSeats: 200 }, business: { price: 3200, seatsAvailable: 50, totalSeats: 50 }, firstClass: { price: 6500, seatsAvailable: 12, totalSeats: 12 } },
    amenities: ['wifi', 'meals', 'entertainment', 'power-outlet', 'extra-legroom', 'lounge-access'],
    baggageAllowance: { cabin: { weight: 10, pieces: 1 }, checked: { weight: 30, pieces: 2 } }
  },
  {
    flightNumber: 'BG-333',
    airline: { name: 'Budget Fly', code: 'BF', logo: '' },
    departure: { airport: 'MIA', city: 'Miami', country: 'USA', terminal: 'T1', gate: 'G2', time: new Date('2025-07-19T10:00:00Z') },
    arrival: { airport: 'DXB', city: 'Dubai', country: 'UAE', terminal: 'T3', gate: 'H15', time: new Date('2025-07-19T22:00:00Z') },
    duration: { hours: 16, minutes: 0 }, stops: 2,
    layovers: [
      { airport: 'JFK', city: 'New York', duration: { hours: 1, minutes: 45 } },
      { airport: 'DOH', city: 'Doha', duration: { hours: 2, minutes: 0 } }
    ],
    aircraft: { model: '737 MAX', manufacturer: 'Boeing' },
    pricing: { economy: { price: 750, seatsAvailable: 130, totalSeats: 130 }, business: { price: 1900, seatsAvailable: 20, totalSeats: 20 } },
    amenities: ['meals', 'entertainment'],
    baggageAllowance: { cabin: { weight: 7, pieces: 1 }, checked: { weight: 20, pieces: 1 } }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-booking');
    console.log('Connected to MongoDB');

    await Flight.deleteMany({});
    console.log('Cleared existing flights');

    await Flight.insertMany(flights);
    console.log(`Seeded ${flights.length} flights successfully!`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

