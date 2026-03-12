import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4><FaPlane /> SkyBook</h4>
          <p>Your trusted flight booking platform. Search, compare, and book flights to destinations worldwide.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/search">Search Flights</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/login">Login</Link>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <Link to="#">Help Center</Link>
          <Link to="#">FAQs</Link>
          <Link to="#">Cancellation Policy</Link>
          <Link to="#">Privacy Policy</Link>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><FaEnvelope /> support@skybook.com</p>
          <p><FaPhone /> +1 (555) 123-4567</p>
          <p><FaMapMarkerAlt /> New York, NY 10001</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SkyBook. All rights reserved. Built with React & Node.js</p>
      </div>
    </footer>
  );
};

export default Footer;

