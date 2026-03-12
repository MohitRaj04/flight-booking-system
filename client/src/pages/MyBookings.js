import React, { useState } from 'react';
import { FaPlane, FaCalendar, FaUsers, FaDownload, FaTimes } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings] = useState([
    {
      _id: '1',
      bookingReference: 'FB-X8K2M9',
      flight: { flightNumber: 'SK-101', airline: { name: 'SkyAir' }, departure: { city: 'New York', time: '2025-06-15T08:00:00Z' }, arrival: { city: 'London', time: '2025-06-15T16:00:00Z' } },
      passengers: [{ firstName: 'John', lastName: 'Doe' }],
      pricing: { totalPrice: 519 },
      status: 'confirmed',
      createdAt: '2025-06-01T10:00:00Z'
    },
    {
      _id: '2',
      bookingReference: 'FB-R3J7N2',
      flight: { flightNumber: 'GA-205', airline: { name: 'Global Airways' }, departure: { city: 'Los Angeles', time: '2025-07-20T14:00:00Z' }, arrival: { city: 'Tokyo', time: '2025-07-21T04:00:00Z' } },
      passengers: [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Doe' }],
      pricing: { totalPrice: 1520 },
      status: 'pending',
      createdAt: '2025-06-10T15:00:00Z'
    },
    {
      _id: '3',
      bookingReference: 'FB-P5M1K8',
      flight: { flightNumber: 'AT-412', airline: { name: 'AeroTransit' }, departure: { city: 'Chicago', time: '2025-05-10T06:00:00Z' }, arrival: { city: 'Paris', time: '2025-05-10T18:00:00Z' } },
      passengers: [{ firstName: 'John', lastName: 'Doe' }],
      pricing: { totalPrice: 582 },
      status: 'completed',
      createdAt: '2025-04-20T09:00:00Z'
    },
    {
      _id: '4',
      bookingReference: 'FB-W9T4L6',
      flight: { flightNumber: 'BG-333', airline: { name: 'Budget Fly' }, departure: { city: 'Miami', time: '2025-08-05T10:00:00Z' }, arrival: { city: 'Dubai', time: '2025-08-05T22:00:00Z' } },
      passengers: [{ firstName: 'John', lastName: 'Doe' }],
      pricing: { totalPrice: 840 },
      status: 'cancelled',
      createdAt: '2025-06-15T12:00:00Z'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bookings-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2><FaPlane /> My Bookings</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <p>No bookings found</p>
        </div>
      ) : (
        filteredBookings.map(booking => (
          <div key={booking._id} className={`booking-item ${booking.status}`}>
            <div className="booking-header">
              <div>
                <span className="booking-ref">{booking.bookingReference}</span>
                <span style={{ color: '#6b7280', marginLeft: '1rem', fontSize: '0.85rem' }}>
                  <FaCalendar /> Booked on {formatDate(booking.createdAt)}
                </span>
              </div>
              <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
              <div>
                <strong>{booking.flight.flightNumber}</strong> · {booking.flight.airline.name}
                <br />
                <span style={{ color: '#4b5563' }}>
                  {booking.flight.departure.city} → {booking.flight.arrival.city}
                </span>
                <br />
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {formatDate(booking.flight.departure.time)}
                </span>
              </div>
              <div>
                <FaUsers /> {booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}
                <br />
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {booking.passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a56db' }}>${booking.pricing.totalPrice}</div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  {booking.status === 'confirmed' && (
                    <button className="btn btn-sm btn-success"><FaDownload /> E-Ticket</button>
                  )}
                  {['confirmed', 'pending'].includes(booking.status) && (
                    <button className="btn btn-sm btn-danger"><FaTimes /> Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;

