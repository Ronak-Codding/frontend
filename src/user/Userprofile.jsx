import React, { useState, useEffect } from "react";
import { User, Lock, Save, Eye, EyeOff, Hash, Shield, UserCircle2 } from "lucide-react";
import "./UserLayout.css";
import "./UserPages.css";

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("usertoken");
  const userId = storedUser._id || storedUser.id;

  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(true);
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
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
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

  // ── Fetch fresh data on mount ──
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setFetching(false);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/oneUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          setProfileForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            username: data.username || "",
            phone: data.phone || "",
          });
        } else {
          // Fallback to localStorage
          fallbackToStored();
        }
      } catch {
        fallbackToStored();
      } finally {
        setFetching(false);
      }
    };

    const fallbackToStored = () => {
      setUserData(storedUser);
      setProfileForm({
        firstName:
          storedUser.firstName || storedUser.fullname?.split(" ")[0] || "",
        lastName:
          storedUser.lastName ||
          storedUser.fullname?.split(" ").slice(1).join(" ") ||
          "",
        username: storedUser.username || "",
        phone: storedUser.phone || "",
      });
    };

    fetchUser();
  }, []);

  // ── Save Profile ──
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.firstName.trim()) {
      showNotification("First name is required", "error");
      return;
    }
    if (profileForm.username && profileForm.username.trim().length < 3) {
      showNotification("Username must be at least 3 characters", "error");
      return;
    }
    setLoading(true);
    try {
      const body = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      };
      if (profileForm.username.trim())
        body.username = profileForm.username.trim();
      if (profileForm.phone.trim()) body.phone = profileForm.phone.trim();

      const res = await fetch(
        `http://localhost:5000/api/user/updateUser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        const fresh = data.user || data;
        setUserData(fresh);
        setProfileForm({
          firstName: fresh.firstName || "",
          lastName: fresh.lastName || "",
          username: fresh.username || "",
          phone: fresh.phone || "",
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, ...fresh }),
        );
        window.dispatchEvent(new Event("userUpdated"));
        showNotification("Profile updated successfully!");
      } else {
        showNotification(data.message || "Failed to update", "error");
      }
    } catch {
      showNotification("Network error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Change Password ──
  // Uses /api/user/changePassword/:id which verifies old password first
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwForm.oldPassword) {
      showNotification("Current password is required", "error");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      showNotification("New password must be at least 8 characters", "error");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }
    if (pwForm.oldPassword === pwForm.newPassword) {
      showNotification(
        "New password must be different from current password",
        "error",
      );
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/changePassword/${userId}`,
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
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("Password changed successfully!");
        setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showNotification(data.message || "Failed to change password", "error");
      }
    } catch {
      showNotification("Network error. Try again.", "error");
    } finally {
      setPwLoading(false);
    }
  };

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return 0;
    if (pw.length < 4) return 1;
    if (pw.length < 6) return 2;
    if (pw.length < 8) return 3;
    return 4;
  };
  const strengthMeta = [
    { label: "", color: "var(--border-color)" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#10b981" },
  ];
  const strength = getStrength(pwForm.newPassword);

  // Skeleton
  if (fetching) {
    return (
      <div>
        <div className="up-header">
          <h1 className="up-title">Profile Settings</h1>
          <p className="up-subtitle">Loading your profile...</p>
        </div>
        <div className="uprof-skeleton-grid">
          {[1, 2].map((i) => (
            <div key={i} className="up-card">
              <div className="up-card-body">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="uprof-skeleton-row">
                    <div className="uprof-skeleton-label" />
                    <div className="uprof-skeleton-input" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const d = userData || {};

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
        {/* ── LEFT ── */}
        <div>
          {/* Avatar Card */}
          <div className="up-card" style={{ marginBottom: "1.25rem" }}>
            <div
              className="up-card-body"
              style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
            >
              <div className="uprof-avatar">
                {(d.firstName || storedUser.fullname)
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontSize: "1.1rem",
                    margin: 0,
                  }}
                >
                  {d.firstName || ""} {d.lastName || ""}
                </p>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    margin: "0.2rem 0 0.4rem",
                  }}
                >
                  {d.email || storedUser.email || ""}
                </p>
                <span className="uprof-role-badge">
                  {d.role || storedUser.role || "user"}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="up-card">
            <div className="up-card-header">
              <h3 className="up-card-title">
                <User size={16} /> Personal Information
              </h3>
            </div>
            <div className="up-card-body">
              <form onSubmit={handleProfileSave}>
                {/* First + Last Name */}
                <div className="up-form-grid-2">
                  <div className="up-form-group">
                    <label className="up-form-label">First Name *</label>
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
                      required
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

                {/* Username */}
                <div className="up-form-group">
                  <label className="up-form-label">Username</label>
                  <div style={{ position: "relative" }}>
                    <span className="uprof-at-sign">@</span>
                    <input
                      className="up-form-input"
                      value={profileForm.username}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          username: e.target.value
                            .toLowerCase()
                            .replace(/\s/g, ""),
                        })
                      }
                      placeholder="yourname"
                      style={{ paddingLeft: "1.75rem" }}
                    />
                  </div>
                  <p className="uprof-field-hint">
                    Must be unique. Lowercase letters, numbers, underscores
                    only.
                  </p>
                </div>

                {/* Phone */}
                <div className="up-form-group">
                  <label className="up-form-label">Phone Number</label>
                  <input
                    className="up-form-input"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    type="tel"
                  />
                </div>

                {/* Email — read only */}
                <div className="up-form-group">
                  <label className="up-form-label">Email</label>
                  <div className="uprof-readonly-field">
                    <span>{d.email || storedUser.email || "—"}</span>
                    <span className="uprof-readonly-badge">Cannot change</span>
                  </div>
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

        {/* ── RIGHT ── */}
        <div>
          {/* Change Password */}
          <div className="up-card">
            <div className="up-card-header">
              <h3 className="up-card-title">
                <Lock size={16} /> Change Password
              </h3>
            </div>
            <div className="up-card-body">
              <form onSubmit={handlePasswordChange}>
                <div className="up-form-group">
                  <label className="up-form-label">Current Password *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw.old ? "text" : "password"}
                      placeholder="Enter current password"
                      value={pwForm.oldPassword}
                      onChange={(e) =>
                        setPwForm((prev) => ({
                          ...prev,
                          oldPassword: e.target.value,
                        }))
                      }
                      className="up-form-input"
                      style={{ paddingRight: "2.5rem" }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => ({ ...p, old: !p.old }))}
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
                      {showPw.old ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="up-form-group">
                  <label className="up-form-label">New Password *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw.new ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={pwForm.newPassword}
                      onChange={(e) =>
                        setPwForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="up-form-input"
                      style={{ paddingRight: "2.5rem" }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
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
                      {showPw.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="up-form-group">
                  <label className="up-form-label">Confirm Password *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw.confirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={pwForm.confirmPassword}
                      onChange={(e) =>
                        setPwForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="up-form-input"
                      style={{ paddingRight: "2.5rem" }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                      }
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
                      {showPw.confirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Strength */}
                {pwForm.newPassword && (
                  <div className="uprof-pw-strength">
                    <div className="uprof-pw-bars">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="uprof-pw-bar"
                          style={{
                            background:
                              strength >= n
                                ? strengthMeta[strength].color
                                : "var(--border-color)",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="uprof-pw-label"
                      style={{ color: strengthMeta[strength].color }}
                    >
                      {strengthMeta[strength].label}
                    </span>
                  </div>
                )}

                {/* Match */}
                {pwForm.confirmPassword && (
                  <p
                    style={{
                      fontSize: "0.78rem",
                      marginBottom: "0.75rem",
                      color:
                        pwForm.newPassword === pwForm.confirmPassword
                          ? "#10b981"
                          : "#ef4444",
                    }}
                  >
                    {pwForm.newPassword === pwForm.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </p>
                )}

                <div className="uprof-pw-note">
                  <Shield size={13} />
                  <span>
                    Password is encrypted securely. You'll need the new password
                    on next login.
                  </span>
                </div>

                <button
                  type="submit"
                  className="up-btn-primary"
                  disabled={pwLoading}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "0.75rem",
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
              <h3 className="up-card-title">
                <UserCircle2 size={16} /> Account Info
              </h3>
            </div>
            <div className="up-card-body">
              {[
                ["Account ID", (d._id || userId)?.slice(-10).toUpperCase()],
                [
                  "Full Name",
                  `${d.firstName || ""} ${d.lastName || ""}`.trim() ||
                    storedUser.fullname ||
                    "—",
                ],
                ["Email", d.email || storedUser.email || "—"],
                ["Username", d.username ? `@${d.username}` : "—"],
                ["Phone", d.phone || "—"],
                ["Role", d.role || storedUser.role || "user"],
                ["Status", d.status || "active"],
                [
                  "Member Since",
                  d.createdAt
                    ? new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
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
