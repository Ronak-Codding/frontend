import React, { useState } from 'react';
import { 
  Edit2,
  Save,
  X,
  Camera,
} from 'lucide-react';
import './MyProfile.css';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Rahul Patel',
    email: 'rahul@gmail.com',
    phone: '+91 98765 43210',
    dateOfBirth: '15 May 1990',
    address: '123 Business Park, Andheri East, Mumbai - 400093',
    nationality: 'Indian',
    passportNumber: 'Z1234567',
    frequentFlyerId: 'FF98765432',
    preferredLanguage: 'English',
    emergencyContact: '+91 98765 43211'
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const recentBookings = [
    { id: 1, from: 'Mumbai', to: 'Delhi', date: '15 Mar 2024', status: 'Completed' },
    { id: 2, from: 'Delhi', to: 'Bangalore', date: '22 Feb 2024', status: 'Completed' },
    { id: 3, from: 'Mumbai', to: 'Goa', date: '10 Jan 2024', status: 'Completed' }
  ];

  return (
    <div className="profile-container">
      {/* Main Content */}
      <main className="profile-main">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                RP
              </div>
              <button className="profile-camera-btn">
                <Camera className="camera-icon" />
              </button>
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{profileData.fullName}</h2>
              <p className="profile-email">{profileData.email}</p>
              <div className="profile-badges">
                <span className="badge badge-blue">Gold Member</span>
                <span className="badge badge-green">Verified</span>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="btn btn-primary"
                >
                  <Edit2 className="btn-icon" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="btn btn-success"
                  >
                    <Save className="btn-icon" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-cancel"
                  >
                    <X className="btn-icon" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="profile-grid">
          {/* Personal Information */}
          <div className="profile-card personal-info-card">
            <h3 className="card-title">Personal Information</h3>
            <div className="info-grid">
              <div className="info-field">
                <label className="field-label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={tempData.fullName}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.fullName}</p>
                )}
              </div>
              <div className="info-field">
                <label className="field-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.email}</p>
                )}
              </div>
              <div className="info-field">
                <label className="field-label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={tempData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.phone}</p>
                )}
              </div>
              <div className="info-field">
                <label className="field-label">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={tempData.dateOfBirth}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.dateOfBirth}</p>
                )}
              </div>
              <div className="info-field full-width">
                <label className="field-label">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={tempData.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Information */}
          <div className="profile-card travel-info-card">
            <h3 className="card-title">Travel Information</h3>
            <div className="travel-info-grid">
              <div className="info-field">
                <label className="field-label">Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nationality"
                    value={tempData.nationality}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.nationality}</p>
                )}
              </div>
              <div className="info-field">
                <label className="field-label">Passport Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="passportNumber"
                    value={tempData.passportNumber}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.passportNumber}</p>
                )}
              </div>
              <div className="info-field">
                <label className="field-label">Frequent Flyer ID</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="frequentFlyerId"
                    value={tempData.frequentFlyerId}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.frequentFlyerId}</p>
                )}
              </div>
              <div className="info-field">
                <label className="field-label">Preferred Language</label>
                {isEditing ? (
                  <select
                    name="preferredLanguage"
                    value={tempData.preferredLanguage}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Gujarati</option>
                  </select>
                ) : (
                  <p className="field-value">{profileData.preferredLanguage}</p>
                )}
              </div>
              <div className="info-field full-width">
                <label className="field-label">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={tempData.emergencyContact}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="field-value">{profileData.emergencyContact}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings-card">
          <h3 className="card-title">Recent Bookings</h3>
          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="flight-route">
                        <span className="city">{booking.from}</span>
                        <span className="arrow">→</span>
                        <span className="city">{booking.to}</span>
                      </div>
                    </td>
                    <td className="date-cell">{booking.date}</td>
                    <td>
                      <span className="status-badge status-completed">
                        {booking.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button className="view-details-btn">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;