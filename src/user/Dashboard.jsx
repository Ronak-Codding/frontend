import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/allusers");
        if (!res.ok) throw new Error("Users fetch failed");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Users Error:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/bookings/allBookings",
        );
        if (!res.ok) throw new Error("Bookings fetch failed");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Bookings Error:", error);
      }
    };

    const fetchFlights = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/flights/allFlights");
        if (!res.ok) throw new Error("Flights fetch failed");
        const data = await res.json();
        setFlights(data);
      } catch (error) {
        console.error("Flights Error:", error);
      }
    };

    fetchUsers();
    fetchBookings();
    fetchFlights();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon flight-icon">
            <i className="fas fa-plane"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{flights.length} </h3>
            <p className="stat-label">Total Flights</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon booking-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{bookings.length}</h3>
            <p className="stat-label">Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{users.length}</h3>
            <p className="stat-label">Active Users</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h4>Weekly Bookings</h4>
            <select className="chart-filter">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <div key={day} className="bar-item">
                    <div
                      className="bar"
                      style={{ height: `${Math.random() * 60 + 40}%` }}
                    ></div>
                    <span className="bar-label">{day}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>Popular Routes</h4>
            <select className="chart-filter">
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="routes-list">
            {[
              { route: "New York → London", bookings: 234 },
              { route: "Dubai → Paris", bookings: 189 },
              { route: "Singapore → Tokyo", bookings: 156 },
              { route: "London → New York", bookings: 145 },
              { route: "Sydney → Los Angeles", bookings: 123 },
            ].map((route, index) => (
              <div key={index} className="route-item">
                <span className="route-name">{route.route}</span>
                <span className="route-bookings">
                  {route.bookings} bookings
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      {/* <div className="recent-bookings">
        <div className="section-header">
          <h4>Recent Bookings</h4>
          <button className="view-all-btn">View All</button>
        </div>
        
        <div className="table-responsive">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Passenger</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="booking-id">{booking.id}</td>
                  <td>{booking.passenger}</td>
                  <td>{booking.flight}</td>
                  <td>{booking.route}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="amount">{booking.amount}</td>
                  <td>
                    <button className="action-btn view-btn" title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Flight Status Summary */}
      <div className="flight-summary">
        <h4>Today's Flight Status</h4>
        <div className="status-cards">
          <div className="status-item on-time">
            <span className="status-count">145</span>
            <span className="status-label">On Time</span>
          </div>
          <div className="status-item delayed">
            <span className="status-count">23</span>
            <span className="status-label">Delayed</span>
          </div>
          <div className="status-item cancelled">
            <span className="status-count">8</span>
            <span className="status-label">Cancelled</span>
          </div>
          <div className="status-item boarding">
            <span className="status-count">12</span>
            <span className="status-label">Boarding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
