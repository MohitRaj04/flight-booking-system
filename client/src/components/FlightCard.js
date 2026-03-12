import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaPlane } from 'react-icons/fa';

const FlightCard = ({ flight }) => {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flight-card">
      {/* Airline Info */}
      <div className="flight-airline">
        <div className="flight-airline-logo">
          {flight.airline?.code || 'FL'}
        </div>
        <div className="flight-airline-info">
          <h4>{flight.airline?.name || 'Airline'}</h4>
          <p>{flight.flightNumber}</p>
        </div>
      </div>

      {/* Route Info */}
      <div className="flight-route">
        <div className="flight-time">
          <div className="time">{formatTime(flight.departure?.time)}</div>
          <div className="city">{flight.departure?.city}</div>
        </div>

        <div className="flight-duration">
          <span>
            <FaClock /> {flight.duration?.hours}h {flight.duration?.minutes}m
          </span>
          <div className="line"></div>
          <span>
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="flight-time">
          <div className="time">{formatTime(flight.arrival?.time)}</div>
          <div className="city">{flight.arrival?.city}</div>
        </div>
      </div>

      {/* Price */}
      <div className="flight-price">
        <div className="price">${flight.pricing?.economy?.price || '---'}</div>
        <div className="per-person">per person</div>
        <Link to={`/booking/${flight._id}`} className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
          <FaPlane /> Book Now
        </Link>
      </div>
    </div>
  );
};

export default FlightCard;

