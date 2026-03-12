import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlane, FaClock, FaWifi, FaUtensils, FaSuitcase, FaChair } from 'react-icons/fa';

const FlightDetails = () => {
  const { id } = useParams();

  // Demo flight detail
  const flight = {
    _id: id,
    flightNumber: 'SK-101',
    airline: { name: 'SkyAir', code: 'SA' },
    departure: { city: 'New York', airport: 'JFK', terminal: 'T4', gate: 'B22', time: '2025-06-15T08:00:00Z' },
    arrival: { city: 'London', airport: 'LHR', terminal: 'T5', gate: 'A10', time: '2025-06-15T16:00:00Z' },
    duration: { hours: 8, minutes: 0 },
    stops: 0,
    aircraft: { model: '787 Dreamliner', manufacturer: 'Boeing' },
    pricing: {
      economy: { price: 450, seatsAvailable: 45 },
      business: { price: 1200, seatsAvailable: 8 },
      firstClass: { price: 2500, seatsAvailable: 4 }
    },
    amenities: ['wifi', 'meals', 'entertainment', 'power-outlet'],
    baggageAllowance: { cabin: { weight: 7, pieces: 1 }, checked: { weight: 23, pieces: 2 } }
  };

  const amenityIcons = {
    wifi: <FaWifi />,
    meals: <FaUtensils />,
    'power-outlet': <span>🔌</span>,
    entertainment: <span>🎬</span>,
    'extra-legroom': <FaChair />
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Flight Header */}
      <div className="booking-step">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>{flight.airline.name}</h2>
            <p style={{ color: '#6b7280' }}>Flight {flight.flightNumber} · {flight.aircraft.manufacturer} {flight.aircraft.model}</p>
          </div>
          <div className="flight-airline-logo" style={{ width: '60px', height: '60px', fontSize: '1rem' }}>
            {flight.airline.code}
          </div>
        </div>

        {/* Route Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>08:00</div>
            <div style={{ fontWeight: 600 }}>{flight.departure.city}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {flight.departure.airport} · Terminal {flight.departure.terminal} · Gate {flight.departure.gate}
            </div>
          </div>
          <div>
            <FaClock style={{ color: '#6b7280' }} />
            <div style={{ fontWeight: 600 }}>{flight.duration.hours}h {flight.duration.minutes}m</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Non-stop</div>
            <div style={{ height: '2px', background: '#e5e7eb', margin: '0.5rem 0', position: 'relative' }}>
              <FaPlane style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', color: '#1a56db' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>16:00</div>
            <div style={{ fontWeight: 600 }}>{flight.arrival.city}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {flight.arrival.airport} · Terminal {flight.arrival.terminal} · Gate {flight.arrival.gate}
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="booking-step">
        <h3>Amenities</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {flight.amenities.map((amenity, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
              <span style={{ fontSize: '1.25rem', color: '#1a56db' }}>{amenityIcons[amenity]}</span>
              <span style={{ textTransform: 'capitalize' }}>{amenity.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Baggage */}
      <div className="booking-step">
        <h3><FaSuitcase /> Baggage Allowance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <strong>Cabin Baggage</strong>
            <p>{flight.baggageAllowance.cabin.pieces} piece(s) · {flight.baggageAllowance.cabin.weight}kg max</p>
          </div>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <strong>Checked Baggage</strong>
            <p>{flight.baggageAllowance.checked.pieces} piece(s) · {flight.baggageAllowance.checked.weight}kg each</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="booking-step">
        <h3>Select Your Class</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {Object.entries(flight.pricing).map(([cls, data]) => (
            <div key={cls} style={{
              border: '2px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', textAlign: 'center',
              transition: 'border-color 0.2s', cursor: 'pointer'
            }}>
              <h4 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                {cls === 'firstClass' ? 'First Class' : cls}
              </h4>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a56db' }}>${data.price}</div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {data.seatsAvailable} seats left
              </div>
              <Link to={`/booking/${flight._id}?class=${cls}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Select
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;

