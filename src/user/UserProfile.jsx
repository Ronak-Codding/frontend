// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "", 
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileData({
        firstName: parsedUser.firstName || "",
        middleName: parsedUser.middleName || "",
        lastName: parsedUser.lastName || "",
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (profileData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (profileData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!profileData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (profileData.username.length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!profileData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!profileData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(profileData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    return newErrors;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)
    ) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase and number";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // Handle profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProfileForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("usertoken");
      const userId = user?.id;

      const response = await fetch(
        `http://localhost:5000/api/user/updateUser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: profileData.firstName,
            middleName: profileData.middleName,
            lastName: profileData.lastName,
            username: profileData.username,
            email: profileData.email,
            phone: profileData.phone,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local storage with new user data
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("usertoken");
      const userId = user?.id;

      const response = await fetch(
        `http://localhost:5000/api/user/updateUser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: passwordData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });

      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to change password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // Reset to original user data
    setProfileData({
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading && !user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-user-circle"></i>
            My Profile
          </h1>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`message-banner ${message.type}`}>
          <i
            className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}
          ></i>
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <h3>
            {user?.fullname ||
              `${profileData.firstName} ${profileData.lastName}`}
          </h3>
          <p className="user-email">{user?.email}</p>
          <p className="user-role">
            <i className="fas fa-tag"></i> Member
          </p>

          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user"></i>
              Personal Information
            </button>
            <button
              className={`menu-item ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <i className="fas fa-ticket-alt"></i>
              My Bookings
            </button>
            <button
              className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="fas fa-cog"></i>
              Account Settings
            </button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="profile-main">
          {activeTab === "profile" && (
            <div className="profile-panel">
              <div className="panel-header">
                <h2>
                  <i className="fas fa-id-card"></i>
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> First Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className={errors.firstName ? "error" : ""}
                          disabled={isLoading}
                        />
                        {errors.firstName && (
                          <span className="error-message">
                            {errors.firstName}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="field-value">
                        {profileData.firstName || "-"}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> Middle Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="middleName"
                          value={profileData.middleName}
                          onChange={handleProfileChange}
                          disabled={isLoading}
                        />
                        {errors.middleName && (
                          <span className="error-message">
                            {errors.middleName}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="field-value">
                        {profileData.middleName || "-"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> Last Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className={errors.lastName ? "error" : ""}
                          disabled={isLoading}
                        />
                        {errors.lastName && (
                          <span className="error-message">
                            {errors.lastName}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="field-value">
                        {profileData.lastName || "-"}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i> Username
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          className={errors.username ? "error" : ""}
                          disabled={isLoading}
                        />
                        {errors.username && (
                          <span className="error-message">
                            {errors.username}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="field-value">
                        {profileData.username || "-"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope"></i> Email Address
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className={errors.email ? "error" : ""}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <span className="error-message">{errors.email}</span>
                      )}
                    </>
                  ) : (
                    <p className="field-value">{profileData.email || "-"}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-phone"></i> Phone Number
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className={errors.phone ? "error" : ""}
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <span className="error-message">{errors.phone}</span>
                      )}
                    </>
                  ) : (
                    <p className="field-value">{profileData.phone || "-"}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="profile-panel">
              <div className="panel-header">
                <h2>
                  <i className="fas fa-ticket-alt"></i>
                  My Bookings
                </h2>
              </div>
              <div className="bookings-placeholder">
                <i className="fas fa-plane"></i>
                <p>No bookings yet. Start planning your journey!</p>
                <button
                  className="search-flights-btn"
                  onClick={() => navigate("/search-flights")}
                >
                  Search Flights
                </button>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="profile-panel">
              <div className="panel-header">
                <h2>
                  <i className="fas fa-shield-alt"></i>
                  Account Settings
                </h2>
              </div>

              <div className="settings-section">
                <h3>Security</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <i className="fas fa-lock"></i>
                    <div>
                      <h4>Password</h4>
                      <p>Last changed: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    className="change-password-btn"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <i className="fas fa-bell"></i>
                    <div>
                      <h4>Notifications</h4>
                      <p>Manage your email and SMS preferences</p>
                    </div>
                  </div>
                  <button className="configure-btn">Configure</button>
                </div>

                <div className="setting-item danger">
                  <div className="setting-info">
                    <i className="fas fa-trash-alt"></i>
                    <div>
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-key"></i>
                Change Password
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.currentPassword ? "error" : ""}
                  disabled={isLoading}
                />
                {passwordErrors.currentPassword && (
                  <span className="error-message">
                    {passwordErrors.currentPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.newPassword ? "error" : ""}
                  disabled={isLoading}
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">
                    {passwordErrors.newPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.confirmPassword ? "error" : ""}
                  disabled={isLoading}
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-message">
                    {passwordErrors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li
                    className={
                      passwordData.newPassword.length >= 8 ? "met" : ""
                    }
                  >
                    <i
                      className={`fas ${passwordData.newPassword.length >= 8 ? "fa-check-circle" : "fa-circle"}`}
                    ></i>
                    At least 8 characters
                  </li>
                  <li
                    className={
                      /(?=.*[a-z])/.test(passwordData.newPassword) ? "met" : ""
                    }
                  >
                    <i
                      className={`fas ${/(?=.*[a-z])/.test(passwordData.newPassword) ? "fa-check-circle" : "fa-circle"}`}
                    ></i>
                    One lowercase letter
                  </li>
                  <li
                    className={
                      /(?=.*[A-Z])/.test(passwordData.newPassword) ? "met" : ""
                    }
                  >
                    <i
                      className={`fas ${/(?=.*[A-Z])/.test(passwordData.newPassword) ? "fa-check-circle" : "fa-circle"}`}
                    ></i>
                    One uppercase letter
                  </li>
                  <li
                    className={
                      /(?=.*\d)/.test(passwordData.newPassword) ? "met" : ""
                    }
                  >
                    <i
                      className={`fas ${/(?=.*\d)/.test(passwordData.newPassword) ? "fa-check-circle" : "fa-circle"}`}
                    ></i>
                    One number
                  </li>
                </ul>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
