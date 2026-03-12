import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaUser, FaSignInAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn] = useState(false); // Will connect to auth context

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaPlane /> Sky<span>Book</span>
        </Link>

        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search Flights</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li>
                <Link to="/profile" className="btn btn-sm btn-outline">
                  <FaUser /> Profile
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-sm btn-outline">
                  <FaSignInAlt /> Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

