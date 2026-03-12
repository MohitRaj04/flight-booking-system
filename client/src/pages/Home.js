import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlane, FaShieldAlt, FaCreditCard, FaHeadset, FaGlobeAmericas } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    passengers: 1,
    class: 'economy'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData);
    navigate(`/search?${params.toString()}`);
  };

  const popularRoutes = [
    { from: 'New York', to: 'London', price: 450, image: '🗽✈️🇬🇧' },
    { from: 'Los Angeles', to: 'Tokyo', price: 680, image: '🌴✈️🗼' },
    { from: 'Chicago', to: 'Paris', price: 520, image: '🏙️✈️🗼' },
    { from: 'Miami', to: 'Dubai', price: 750, image: '🏖️✈️🏙️' },
    { from: 'San Francisco', to: 'Sydney', price: 890, image: '🌉✈️🦘' },
    { from: 'Boston', to: 'Rome', price: 480, image: '🏛️✈️🇮🇹' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your Perfect Flight</h1>
        <p>Search, compare, and book flights to 500+ destinations worldwide at the best prices.</p>
      </section>

      {/* Search Box */}
      <div className="search-box">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>From</label>
            <input
              type="text"
              placeholder="Departure City"
              value={searchData.from}
              onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              placeholder="Destination City"
              value={searchData.to}
              onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Departure Date</label>
            <input
              type="date"
              value={searchData.departDate}
              onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Passengers</label>
            <select
              value={searchData.passengers}
              onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <FaSearch /> Search
          </button>
        </form>
      </div>

      {/* Features */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem' }}>Why Choose SkyBook?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: <FaGlobeAmericas />, title: '500+ Destinations', desc: 'Flights to major cities across all continents' },
            { icon: <FaShieldAlt />, title: 'Secure Booking', desc: 'Your data is protected with enterprise-grade security' },
            { icon: <FaCreditCard />, title: 'Easy Payments', desc: 'Multiple payment options including cards & PayPal' },
            { icon: <FaHeadset />, title: '24/7 Support', desc: 'Round-the-clock customer support for all queries' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '2.5rem', color: '#1a56db', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: '#6b7280' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem 3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem' }}>
          <FaPlane /> Popular Routes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {popularRoutes.map((route, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => setSearchData({ ...searchData, from: route.from, to: route.to })}
            >
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{route.image}</div>
                <h4>{route.from} → {route.to}</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a56db' }}>
                  From ${route.price}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>per person</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

