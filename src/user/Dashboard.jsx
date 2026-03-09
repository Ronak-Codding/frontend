import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState({
    bookings: true,
    profile: true,
  });

  useEffect(() => {
    fetchUserBookings();
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    // Get user from localStorage (assuming you store user data after login)
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserProfile(parsed);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    setLoading(prev => ({ ...prev, profile: false }));
  };

  const fetchUserBookings = async () => {
    try {
      // Get current user ID from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData?.id || userData?._id;

      // Fetch only this user's bookings
      const res = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
      if (!res.ok) throw new Error("Bookings fetch failed");
      const data = await res.json();
      setBookings(data);

      // Process upcoming flights from bookings
      const upcoming = data
        .filter((booking) => {
          const flightDate = new Date(booking.flightDate);
          const today = new Date();
          return flightDate > today && booking.status !== "cancelled";
        })
        .slice(0, 5);
      setUpcomingFlights(upcoming);

      setLoading((prev) => ({ ...prev, bookings: false }));
    } catch (error) {
      console.error("Bookings Error:", error);
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  const handleViewAllBookings = () => {
    navigate("/user/bookings");
  };

  const handleBookingDetails = (bookingId) => {
    navigate(`/user/booking/${bookingId}`);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // const handleRefresh = () => {
  //   setLoading({ bookings: true, profile: false });
  //   fetchUserBookings();
  //   loadUserProfile();
  // };

  return (
    <div className="dashboard-container">
      {/* Header with Actions */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <i className="fas fa-chart-line me-2"></i>
          My Dashboard
        </h2>
        {/* <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div> */}
      </div>

      {/* Profile Overview Section */}
      <div className="profile-overview-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userProfile?.profilePicture ? (
              <img src={userProfile.profilePicture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {getInitials(userProfile?.name || userProfile?.email || "User")}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3>{userProfile?.name || "Welcome, User"}</h3>
            <p className="profile-email">{userProfile?.email || "user@example.com"}</p>
            <div className="profile-meta">
              <span><i className="fas fa-calendar-alt"></i> Member since {userProfile?.memberSince || "2024"}</span>
              <span><i className="fas fa-ticket-alt"></i> {bookings.length} total bookings</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn-profile" onClick={() => navigate("/user/profile")}>
              <i className="fas fa-user"></i> View Profile
            </button>
            <button className="btn-profile edit" onClick={() => navigate("/user/profile/edit")}>
              <i className="fas fa-edit"></i> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - User Specific */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon booking-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-content">
            {loading.bookings ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <h3 className="stat-value">{bookings.length}</h3>
                <p className="stat-label">My Bookings</p>
              </>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{userProfile?.loyaltyPoints || 0}</h3>
            <p className="stat-label">Loyalty Points</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{upcomingFlights.length}</h3>
            <p className="stat-label">Upcoming Trips</p>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="upcoming-bookings-section">
        <div className="section-header">
          <h4>
            <i className="fas fa-calendar-check me-2"></i>
            My Upcoming Bookings
          </h4>
          <button className="btn-view-all" onClick={handleViewAllBookings}>
            View All Bookings <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div className="upcoming-list">
          {loading.bookings ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : upcomingFlights.length > 0 ? (
            upcomingFlights.map((booking, index) => (
              <div key={index} className="booking-card" onClick={() => handleBookingDetails(booking._id)}>
                <div className="booking-header">
                  <span className="booking-reference">Ref: {booking.bookingReference || `BK${String(index + 1).padStart(3, '0')}`}</span>
                  <span className={`booking-status status-${booking.status || "confirmed"}`}>
                    {booking.status || "Confirmed"}
                  </span>
                </div>
                
                <div className="booking-route">
                  <div className="route-point">
                    <span className="city">{booking.from || "JFK"}</span>
                    <span className="time">{booking.departureTime || "10:30"}</span>
                  </div>
                  <div className="route-line">
                    <i className="fas fa-plane"></i>
                    <span className="duration">{booking.duration || "2h 30m"}</span>
                  </div>
                  <div className="route-point">
                    <span className="city">{booking.to || "LAX"}</span>
                    <span className="time">{booking.arrivalTime || "13:00"}</span>
                  </div>
                </div>

                <div className="booking-footer">
                  <span className="flight-date">
                    <i className="far fa-calendar"></i>
                    {new Date(booking.flightDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="passenger-count">
                    <i className="fas fa-user"></i>
                    {booking.passengers?.length || 1} passenger(s)
                  </span>
                  <span className="booking-price">
                    ${booking.totalPrice || (299 * (booking.passengers?.length || 1))}
                  </span>
                </div>

                <div className="booking-actions">
                  <button className="btn-action" onClick={(e) => { e.stopPropagation(); navigate(`/user/check-in/${booking._id}`); }}>
                    <i className="fas fa-check-circle"></i> Check-in
                  </button>
                  <button className="btn-action" onClick={(e) => { e.stopPropagation(); navigate(`/user/booking/${booking._id}/modify`); }}>
                    <i className="fas fa-edit"></i> Modify
                  </button>
                  <button className="btn-action cancel" onClick={(e) => { e.stopPropagation(); /* Handle cancellation */ }}>
                    <i className="fas fa-times-circle"></i> Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <i className="fas fa-calendar-times fa-3x"></i>
              <p>No upcoming bookings</p>
              <button className="btn-book-now" onClick={() => navigate("/user/flight-search")}>
                <i className="fas fa-plane"></i> Book a Flight Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4><i className="fas fa-bolt"></i> Quick Actions</h4>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate("/user/flights")}>
            <i className="fas fa-search"></i>
            <span>Search Flights</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/user/bookings")}>
            <i className="fas fa-history"></i>
            <span>My Bookings</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/user/profile")}>
            <i className="fas fa-user-cog"></i>
            <span>Profile Settings</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/user/support")}>
            <i className="fas fa-headset"></i>
            <span>Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;