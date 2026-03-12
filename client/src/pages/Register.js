import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // API call: POST /api/auth/register
    console.log('Register:', formData);
    alert('Registration successful! (Demo)');
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2>Create Account</h2>
        <p className="subtitle">Join SkyBook and start booking flights</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label><FaUser /> First Name</label>
              <input type="text" placeholder="John" value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label><FaUser /> Last Name</label>
              <input type="text" placeholder="Doe" value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input type="email" placeholder="you@example.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label><FaPhone /> Phone Number</label>
            <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label><FaLock /> Password</label>
            <input type="password" placeholder="Min 6 characters" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label><FaLock /> Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <FaUserPlus /> Create Account
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

