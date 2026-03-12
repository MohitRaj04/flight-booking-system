import React, { useState } from 'react';
import { FaChartBar, FaPlane, FaUsers, FaTicketAlt, FaDollarSign, FaChartLine, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    totalUsers: 1250, totalFlights: 340, totalBookings: 2890,
    activeFlights: 180, confirmedBookings: 2100, cancelledBookings: 190, totalRevenue: 1345000
  };

  const recentBookings = [
    { ref: 'FB-X8K2M9', user: 'John Doe', flight: 'SK-101', route: 'NYC → LON', amount: 519, status: 'confirmed' },
    { ref: 'FB-R3J7N2', user: 'Jane Smith', flight: 'GA-205', route: 'LAX → TYO', amount: 1520, status: 'pending' },
    { ref: 'FB-P5M1K8', user: 'Mike Brown', flight: 'AT-412', route: 'CHI → PAR', amount: 582, status: 'confirmed' },
    { ref: 'FB-W9T4L6', user: 'Sarah Wilson', flight: 'BG-333', route: 'MIA → DXB', amount: 840, status: 'cancelled' },
    { ref: 'FB-L2N8Q4', user: 'Tom Davis', flight: 'PR-780', route: 'SFO → SYD', amount: 1950, status: 'confirmed' },
  ];

  const flights = [
    { number: 'SK-101', airline: 'SkyAir', route: 'New York → London', departure: '08:00', status: 'scheduled', seats: '45/150' },
    { number: 'GA-205', airline: 'Global Airways', route: 'LA → Tokyo', departure: '14:00', status: 'boarding', seats: '120/180' },
    { number: 'AT-412', airline: 'AeroTransit', route: 'Chicago → Paris', departure: '06:00', status: 'departed', seats: '95/160' },
    { number: 'PR-780', airline: 'Premium Air', route: 'SF → Sydney', departure: '22:00', status: 'scheduled', seats: '30/140' },
    { number: 'BG-333', airline: 'Budget Fly', route: 'Miami → Dubai', departure: '10:00', status: 'delayed', seats: '100/200' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ color: 'white' }}>Admin Panel</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Flight Management System</p>
        </div>
        <nav className="admin-sidebar-nav">
          {[
            { key: 'dashboard', icon: <FaChartBar />, label: 'Dashboard' },
            { key: 'flights', icon: <FaPlane />, label: 'Manage Flights' },
            { key: 'bookings', icon: <FaTicketAlt />, label: 'Bookings' },
            { key: 'users', icon: <FaUsers />, label: 'Users' },
            { key: 'revenue', icon: <FaChartLine />, label: 'Revenue' },
          ].map(item => (
            <a key={item.key} href="#!" className={activeTab === item.key ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveTab(item.key); }}>
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        {/* Dashboard Stats */}
        {activeTab === 'dashboard' && (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h2>
            <div className="stats-grid">
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: <FaUsers />, color: '#3b82f6' },
                { label: 'Active Flights', value: stats.activeFlights, icon: <FaPlane />, color: '#10b981' },
                { label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), icon: <FaTicketAlt />, color: '#f59e0b' },
                { label: 'Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: <FaDollarSign />, color: '#8b5cf6' }
              ].map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Bookings Table */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 style={{ padding: '1.5rem 1.5rem 0' }}>Recent Bookings</h3>
              <table className="data-table" style={{ marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Flight</th>
                    <th>Route</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, i) => (
                    <tr key={i}>
                      <td><strong>{b.ref}</strong></td>
                      <td>{b.user}</td>
                      <td>{b.flight}</td>
                      <td>{b.route}</td>
                      <td><strong>${b.amount}</strong></td>
                      <td>
                        <span className={`status-badge status-${b.status}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Flights Management */}
        {activeTab === 'flights' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Manage Flights</h2>
              <button className="btn btn-primary">+ Add New Flight</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Flight #</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Status</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f, i) => (
                  <tr key={i}>
                    <td><strong>{f.number}</strong></td>
                    <td>{f.airline}</td>
                    <td>{f.route}</td>
                    <td>{f.departure}</td>
                    <td>
                      <span className={`status-badge ${f.status === 'delayed' ? 'status-pending' : f.status === 'cancelled' ? 'status-cancelled' : 'status-confirmed'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>{f.seats}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ marginRight: '0.5rem' }}>Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>All Bookings</h2>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
              <div className="stat-card">
                <FaCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
                <div className="stat-value" style={{ color: '#10b981' }}>{stats.confirmedBookings}</div>
                <div className="stat-label">Confirmed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.totalBookings - stats.confirmedBookings - stats.cancelledBookings}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <FaTimesCircle style={{ color: '#ef4444', fontSize: '1.5rem' }} />
                <div className="stat-value" style={{ color: '#ef4444' }}>{stats.cancelledBookings}</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>Reference</th><th>Customer</th><th>Flight</th><th>Route</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={i}>
                    <td><strong>{b.ref}</strong></td>
                    <td>{b.user}</td>
                    <td>{b.flight}</td>
                    <td>{b.route}</td>
                    <td>${b.amount}</td>
                    <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                    <td><button className="btn btn-sm btn-outline">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>User Management</h2>
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Bookings</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', email: 'john@example.com', bookings: 12, joined: 'Jan 2025', status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@example.com', bookings: 8, joined: 'Feb 2025', status: 'Active' },
                  { name: 'Mike Brown', email: 'mike@example.com', bookings: 3, joined: 'Mar 2025', status: 'Active' },
                  { name: 'Sarah Wilson', email: 'sarah@example.com', bookings: 15, joined: 'Dec 2024', status: 'Active' },
                  { name: 'Tom Davis', email: 'tom@example.com', bookings: 1, joined: 'May 2025', status: 'Inactive' },
                ].map((u, i) => (
                  <tr key={i}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.bookings}</td>
                    <td>{u.joined}</td>
                    <td><span className={`status-badge ${u.status === 'Active' ? 'status-confirmed' : 'status-pending'}`}>{u.status}</span></td>
                    <td><button className="btn btn-sm btn-outline">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Revenue */}
        {activeTab === 'revenue' && (
          <>
            <h2 style={{ marginBottom: '1.5rem' }}>Revenue Analytics</h2>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#8b5cf6' }}>${(stats.totalRevenue / 1000).toFixed(0)}K</div>
                <div className="stat-label">Total Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#10b981' }}>${Math.round(stats.totalRevenue / stats.confirmedBookings)}</div>
                <div className="stat-label">Avg. Booking Value</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#3b82f6' }}>{((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1)}%</div>
                <div className="stat-label">Conversion Rate</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', marginTop: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3>Monthly Revenue (Last 6 Months)</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', marginTop: '1.5rem', padding: '1rem 0' }}>
                {[
                  { month: 'Oct', value: 180 }, { month: 'Nov', value: 220 },
                  { month: 'Dec', value: 310 }, { month: 'Jan', value: 195 },
                  { month: 'Feb', value: 260 }, { month: 'Mar', value: 345 },
                ].map((m, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      height: `${(m.value / 345) * 160}px`, background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)',
                      borderRadius: '6px 6px 0 0', transition: 'height 0.3s', minHeight: '20px'
                    }}></div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>${m.value}K</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

