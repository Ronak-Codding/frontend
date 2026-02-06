import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ scrollToSection }) => {
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
                  <button onClick={() => scrollToSection("home")}>Home</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("destinations")}>
                    Destinations
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("services")}>
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("about")}>
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faqs")}>FAQs</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")}>
                    Contact
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
                {/* <button
                  className="new-btn new-btn-primary"
                  onClick={(e) => handleNavigationClick(e, "book")}
                >
                  Book Now
                </button> */}
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
