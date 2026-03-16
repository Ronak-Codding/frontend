import React, { useEffect, useState } from "react";
import { User, Lock, Save, Eye, EyeOff, Camera } from "lucide-react";
import "./UserLayout.css";
import "./UserPages.css";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("usertoken");
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showPw, setShowPw] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    username: user.username || "",
  });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000,
    );
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/updateUser/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileForm),
        },
      );
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, ...(updated.user || updated) }),
        );
        showNotification("Profile updated successfully!");
      } else showNotification("Failed to update profile", "error");
    } catch {
      showNotification("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      showNotification("Password must be at least 6 characters", "error");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/changePassword/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: pwForm.oldPassword,
            newPassword: pwForm.newPassword,
          }),
        },
      );
      if (res.ok) {
        showNotification("Password changed successfully!");
        setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const d = await res.json();
        showNotification(d.message || "Failed to change password", "error");
      }
    } catch {
      showNotification("Failed to change password", "error");
    } finally {
      setPwLoading(false);
    }
  };

  const PwInput = ({ name, placeholder, pwKey }) => (
    <div style={{ position: "relative" }}>
      <input
        type={showPw[pwKey] ? "text" : "password"}
        placeholder={placeholder}
        value={pwForm[name]}
        onChange={(e) => setPwForm({ ...pwForm, [name]: e.target.value })}
        className="up-form-input"
        style={{ paddingRight: "2.5rem" }}
      />
      <button
        type="button"
        onClick={() => setShowPw((p) => ({ ...p, [pwKey]: !p[pwKey] }))}
        style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
        }}
      >
        {showPw[pwKey] ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );

  return (
    <div>
      {/* Notification */}
      {notification.show && (
        <div
          className={`up-notification ${notification.type === "error" ? "up-notification-error" : "up-notification-success"}`}
        >
          {notification.message}
        </div>
      )}

      <div className="up-header">
        <h1 className="up-title">Profile Settings</h1>
        <p className="up-subtitle">
          Manage your personal information and security
        </p>
      </div>

      <div className="up-grid-2">
        {/* Profile Form */}
        <div>
          {/* Avatar Card */}
          <div className="up-card" style={{ marginBottom: "1.25rem" }}>
            <div
              className="up-card-body"
              style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
            >
              <div style={{ position: "relative" }}>
                <div className="uprof-avatar">
                  {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <button className="uprof-cam-btn">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontSize: "1.1rem",
                  }}
                >
                  {user.firstName} {user.lastName}
                </p>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}
                >
                  {user.email}
                </p>
                <span className="uprof-role-badge">{user.role || "user"}</span>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="up-card">
            <div className="up-card-header">
              <h3 className="up-card-title">
                <User size={16} /> Personal Information
              </h3>
            </div>
            <div className="up-card-body">
              <form onSubmit={handleProfileSave}>
                <div className="up-form-grid-2">
                  <div className="up-form-group">
                    <label className="up-form-label">First Name</label>
                    <input
                      className="up-form-input"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="First Name"
                    />
                  </div>
                  <div className="up-form-group">
                    <label className="up-form-label">Last Name</label>
                    <input
                      className="up-form-input"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="up-form-group">
                  <label className="up-form-label">Username</label>
                  <input
                    className="up-form-input"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        username: e.target.value,
                      })
                    }
                    placeholder="username"
                  />
                </div>
                <div className="up-form-group">
                  <label className="up-form-label">Email</label>
                  <input
                    className="up-form-input"
                    value={profileForm.email}
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.25rem",
                    }}
                  >
                    Email cannot be changed
                  </p>
                </div>
                <div className="up-form-group">
                  <label className="up-form-label">Phone</label>
                  <input
                    className="up-form-input"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>
                <button
                  type="submit"
                  className="up-btn-primary"
                  disabled={loading}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? (
                    <>
                      <div
                        className="up-spinner"
                        style={{ width: 16, height: 16, borderWidth: 2 }}
                      />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div>
          <div className="up-card">
            <div className="up-card-header">
              <h3 className="up-card-title">
                <Lock size={16} /> Change Password
              </h3>
            </div>
            <div className="up-card-body">
              <form onSubmit={handlePasswordChange}>
                <div className="up-form-group">
                  <label className="up-form-label">Current Password</label>
                  <PwInput
                    name="oldPassword"
                    placeholder="Enter current password"
                    pwKey="old"
                  />
                </div>
                <div className="up-form-group">
                  <label className="up-form-label">New Password</label>
                  <PwInput
                    name="newPassword"
                    placeholder="Min. 6 characters"
                    pwKey="new"
                  />
                </div>
                <div className="up-form-group">
                  <label className="up-form-label">Confirm New Password</label>
                  <PwInput
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    pwKey="confirm"
                  />
                </div>

                {/* Password Strength */}
                {pwForm.newPassword && (
                  <div className="uprof-pw-strength">
                    <div className="uprof-pw-bars">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="uprof-pw-bar"
                          style={{
                            background:
                              pwForm.newPassword.length >= n * 2
                                ? pwForm.newPassword.length >= 8
                                  ? "#10b981"
                                  : "#f59e0b"
                                : "var(--border-color)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="uprof-pw-label">
                      {pwForm.newPassword.length < 4
                        ? "Weak"
                        : pwForm.newPassword.length < 8
                          ? "Fair"
                          : "Strong"}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="up-btn-primary"
                  disabled={pwLoading}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  {pwLoading ? (
                    <>
                      <div
                        className="up-spinner"
                        style={{ width: 16, height: 16, borderWidth: 2 }}
                      />{" "}
                      Changing...
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Account Info */}
          <div className="up-card" style={{ marginTop: "1.25rem" }}>
            <div className="up-card-header">
              <h3 className="up-card-title">Account Info</h3>
            </div>
            <div className="up-card-body">
              {[
                ["Account ID", user._id?.slice(-10).toUpperCase()],
                ["Role", user.role || "User"],
                ["Status", user.status || "Active"],
                [
                  "Member Since",
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—",
                ],
              ].map(([label, value]) => (
                <div key={label} className="uprof-info-row">
                  <span className="uprof-info-label">{label}</span>
                  <span className="uprof-info-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
