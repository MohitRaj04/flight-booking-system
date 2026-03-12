import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call: POST /api/auth/login
    console.log('Login:', formData);
    alert('Login successful! (Demo)');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to manage your bookings</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input type="email" placeholder="you@example.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label><FaLock /> Password</label>
            <input type="password" placeholder="Enter your password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <FaSignInAlt /> Sign In
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

