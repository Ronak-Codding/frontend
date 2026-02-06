import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ scrollToSection }) => {
  return (
    <>
      {/* Footer */}
      <footer className="new-footer">
        <div className="new-container">
          <div className="new-footer-content">
            <div className="new-footer-section">
              <div className="new-footer-logo">
                <div className="new-nav-logo">
                  <div className="new-logo-icon">
                    <i className="fas fa-plane"></i>
                  </div>
                  <div className="new-logo-text">
                    <span className="new-logo-primary">Sky</span>
                    <span className="new-logo-secondary">Jet</span>
                  </div>
                </div>
                <p className="new-footer-description">
                  Premium airline service connecting you to the world with
                  comfort and luxury.
                </p>
                <div className="new-social-links">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>

                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="new-footer-section">
              <h3>Quick Links</h3>
              <ul>
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
                    About Us
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
            </div>

            <div className="new-footer-section">
              <h3>Services</h3>
              <ul>
                <li>
                  <button>Flight Booking</button>
                </li>
                <li>
                  <button>Flight Status</button>
                </li>
                <li>
                  <button>Hotel Booking</button>
                </li>
                <li>
                  <button>Car Rental</button>
                </li>
                <li>
                  <button>Travel Insurance</button>
                </li>
              </ul>
            </div>

            <div className="new-footer-section">
              <h3>Contact Info</h3>
              <div className="new-contact-info">
                <p>
                  <i className="fas fa-map-marker-alt"></i> 123 Aviation Way, NY
                  10001
                </p>
                <p>
                  <i className="fas fa-phone"></i> +1 (800) 123-4567
                </p>
                <p>
                  <i className="fas fa-envelope"></i> info@skyjet.com
                </p>
                <p>
                  <i className="fas fa-clock"></i> 24/7 Customer Support
                </p>
              </div>
            </div>
          </div>

          <div className="new-footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} SkyJet Airlines. All rights
              reserved.
            </p>
            <div className="new-footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
