import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FlightCard from '../components/FlightCard';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    stops: 'any',
    maxPrice: '',
    airline: ''
  });

  useEffect(() => {
    // Simulated flight data for demo
    const demoFlights = [
      {
        _id: '1',
        flightNumber: 'SK-101',
        airline: { name: 'SkyAir', code: 'SA' },
        departure: { city: searchParams.get('from') || 'New York', airport: 'JFK', time: new Date(Date.now() + 86400000).toISOString() },
        arrival: { city: searchParams.get('to') || 'London', airport: 'LHR', time: new Date(Date.now() + 86400000 + 28800000).toISOString() },
        duration: { hours: 8, minutes: 0 },
        stops: 0,
        pricing: { economy: { price: 450, seatsAvailable: 45 }, business: { price: 1200, seatsAvailable: 8 } }
      },
      {
        _id: '2',
        flightNumber: 'GA-205',
        airline: { name: 'Global Airways', code: 'GA' },
        departure: { city: searchParams.get('from') || 'New York', airport: 'JFK', time: new Date(Date.now() + 90000000).toISOString() },
        arrival: { city: searchParams.get('to') || 'London', airport: 'LHR', time: new Date(Date.now() + 90000000 + 30600000).toISOString() },
        duration: { hours: 8, minutes: 30 },
        stops: 0,
        pricing: { economy: { price: 380, seatsAvailable: 60 }, business: { price: 1050, seatsAvailable: 12 } }
      },
      {
        _id: '3',
        flightNumber: 'AT-412',
        airline: { name: 'AeroTransit', code: 'AT' },
        departure: { city: searchParams.get('from') || 'New York', airport: 'EWR', time: new Date(Date.now() + 100000000).toISOString() },
        arrival: { city: searchParams.get('to') || 'London', airport: 'LGW', time: new Date(Date.now() + 100000000 + 36000000).toISOString() },
        duration: { hours: 10, minutes: 0 },
        stops: 1,
        pricing: { economy: { price: 320, seatsAvailable: 80 }, business: { price: 890, seatsAvailable: 15 } }
      },
      {
        _id: '4',
        flightNumber: 'PR-780',
        airline: { name: 'Premium Air', code: 'PR' },
        departure: { city: searchParams.get('from') || 'New York', airport: 'JFK', time: new Date(Date.now() + 110000000).toISOString() },
        arrival: { city: searchParams.get('to') || 'London', airport: 'LHR', time: new Date(Date.now() + 110000000 + 27000000).toISOString() },
        duration: { hours: 7, minutes: 30 },
        stops: 0,
        pricing: { economy: { price: 520, seatsAvailable: 30 }, business: { price: 1450, seatsAvailable: 6 } }
      },
      {
        _id: '5',
        flightNumber: 'BG-333',
        airline: { name: 'Budget Fly', code: 'BF' },
        departure: { city: searchParams.get('from') || 'New York', airport: 'JFK', time: new Date(Date.now() + 120000000).toISOString() },
        arrival: { city: searchParams.get('to') || 'London', airport: 'STN', time: new Date(Date.now() + 120000000 + 43200000).toISOString() },
        duration: { hours: 12, minutes: 0 },
        stops: 2,
        pricing: { economy: { price: 250, seatsAvailable: 100 }, business: { price: 680, seatsAvailable: 20 } }
      }
    ];

    setTimeout(() => {
      setFlights(demoFlights);
      setLoading(false);
    }, 800);
  }, [searchParams]);

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.pricing.economy.price - b.pricing.economy.price;
      case 'duration': return (a.duration.hours * 60 + a.duration.minutes) - (b.duration.hours * 60 + b.duration.minutes);
      case 'stops': return a.stops - b.stops;
      default: return 0;
    }
  });

  const filteredFlights = sortedFlights.filter(f => {
    if (filters.stops !== 'any' && f.stops !== parseInt(filters.stops)) return false;
    if (filters.maxPrice && f.pricing.economy.price > parseInt(filters.maxPrice)) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Search Summary */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>
          {searchParams.get('from') || 'New York'} → {searchParams.get('to') || 'London'}
        </h2>
        <p style={{ color: '#6b7280' }}>
          {searchParams.get('departDate') || 'Flexible dates'} · {searchParams.get('passengers') || 1} passenger(s)
        </p>
      </div>

      {/* Filters & Sort Bar */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap',
        background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaFilter />
          <select value={filters.stops} onChange={(e) => setFilters({ ...filters, stops: e.target.value })}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <option value="any">Any stops</option>
            <option value="0">Non-stop</option>
            <option value="1">1 Stop</option>
            <option value="2">2+ Stops</option>
          </select>
        </div>
        <input
          type="number"
          placeholder="Max price ($)"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', width: '140px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <FaSortAmountDown />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <option value="price">Price: Low to High</option>
            <option value="duration">Duration: Shortest</option>
            <option value="stops">Stops: Fewest</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✈️</div>
          <p>Searching for the best flights...</p>
        </div>
      ) : filteredFlights.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <p>No flights found matching your criteria. Try adjusting filters.</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            {filteredFlights.length} flight{filteredFlights.length > 1 ? 's' : ''} found
          </p>
          {filteredFlights.map(flight => (
            <FlightCard key={flight._id} flight={flight} />
          ))}
        </>
      )}
    </div>
  );
};

export default SearchResults;

