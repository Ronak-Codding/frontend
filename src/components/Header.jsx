import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="new-navbar">
        <div className="new-container">
          <div className="new-nav-content">
            <div className="new-nav-logo">
              <div className="new-logo-icon">
                <i className="fas fa-plane"></i>
              </div>
              <div className="new-logo-text">
                <span className="new-logo-primary">Sky</span>
                <span className="new-logo-secondary">Jet</span>
              </div>
            </div>

            <div className={`new-nav-menu ${mobileMenuOpen ? "active" : ""}`}>
              <ul className="new-nav-list">
                <li>
                  <button onClick={() => navigate("/")}>Home</button>
                </li>
                <li>
                  <button onClick={() => navigate("/about")}>About</button>
                </li>

                <li>
                  <button onClick={() => navigate("/contact")}>Contact</button>
                </li>
                <li>
                  <button onClick={() => navigate("/faqs")}>FAQs</button>
                </li>
                <li>
                  <button onClick={() => navigate("/services")}>
                    Services
                  </button>
                </li>
              </ul>

              <div className="new-nav-buttons">
                <button
                  className="new-btn new-btn-outline"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="new-btn new-btn-primary"
                  onClick={() => navigate("/register")}
                >
                  Register Now
                </button>
              </div>
            </div>

            <button className="new-mobile-toggle" onClick={toggleMobileMenu}>
              <i
                className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}
              ></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
