import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaPassport, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const BookingPage = () => {
  const { flightId } = useParams();
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([{
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', passportNumber: ''
  }]);
  const [paymentDone, setPaymentDone] = useState(false);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', passportNumber: '' }]);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentDone(true);
    setStep(3);
  };

  return (
    <div className="booking-container">
      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        {['Passenger Details', 'Payment', 'Confirmation'].map((label, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: step > i ? '#10b981' : step === i + 1 ? '#1a56db' : '#9ca3af',
            fontWeight: step === i + 1 ? 600 : 400
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step > i ? '#10b981' : step === i + 1 ? '#1a56db' : '#e5e7eb',
              color: step >= i + 1 ? 'white' : '#6b7280', fontWeight: 700, fontSize: '0.9rem'
            }}>
              {step > i ? '✓' : i + 1}
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Passenger Details */}
      {step === 1 && (
        <div>
          <div className="booking-step">
            <h3>Flight Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>SK-101</strong> · SkyAir<br />
                <span style={{ color: '#6b7280' }}>New York (JFK) → London (LHR)</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a56db' }}>$450</div>
                <span style={{ color: '#6b7280' }}>per person</span>
              </div>
            </div>
          </div>

          {passengers.map((passenger, index) => (
            <div key={index} className="booking-step">
              <h3><FaUser /> Passenger {index + 1}</h3>
              <div className="passenger-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="First Name" value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Last Name" value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input type="email" placeholder="email@example.com" value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={passenger.phone}
                    onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" value={passenger.dateOfBirth}
                    onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)} />
                </div>
                <div className="form-group">
                  <label><FaPassport /> Passport Number</label>
                  <input type="text" placeholder="Passport Number" value={passenger.passportNumber}
                    onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-outline" onClick={addPassenger}>+ Add Passenger</button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
              Continue to Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="booking-step">
          <h3><FaCreditCard /> Payment Details</h3>
          <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Base fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
              <strong>${450 * passengers.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Taxes & fees</span>
              <strong>${Math.round(450 * passengers.length * 0.12 + 15 * passengers.length)}</strong>
            </div>
            <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
              <strong>Total</strong>
              <strong style={{ color: '#1a56db' }}>
                ${Math.round(450 * passengers.length * 1.12 + 15 * passengers.length)}
              </strong>
            </div>
          </div>

          <form onSubmit={handlePayment}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Card Number</label>
              <input type="text" placeholder="4242 4242 4242 4242" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" required />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Name on Card</label>
              <input type="text" placeholder="John Doe" required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button type="submit" className="btn btn-success btn-lg">Pay & Confirm Booking</button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && paymentDone && (
        <div className="booking-step" style={{ textAlign: 'center', padding: '3rem' }}>
          <FaCheckCircle style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Your booking reference is <strong style={{ fontSize: '1.25rem', color: '#1a56db' }}>FB-X8K2M9</strong>
          </p>
          <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p><strong>Flight:</strong> SK-101 · SkyAir</p>
            <p><strong>Route:</strong> New York (JFK) → London (LHR)</p>
            <p><strong>Passengers:</strong> {passengers.length}</p>
            <p><strong>Status:</strong> <span className="status-badge status-confirmed">Confirmed</span></p>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            A confirmation email has been sent to your registered email address.
          </p>
          <a href="/my-bookings" className="btn btn-primary">View My Bookings</a>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

