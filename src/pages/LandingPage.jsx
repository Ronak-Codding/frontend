import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import FlightSearchForm from "./FlightSearchForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleBookNow = () => {
    alert("Redirecting to booking page...");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreDestinations = () => {
    scrollToSection("destinations");
  };


  const handleNavigationClick = (e, action) => {
    e.preventDefault();

    switch (action) {
      case "signin":
        navigate("/login");
        break;
      case "book":
        handleBookNow();
        break;
      case "explore":
        handleExploreDestinations();
        break;

      default:
        break;
    }
  };


  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          subject: contactForm.subject,
          message: contactForm.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send message");
        return;
      }

      setFormSubmitted(true);

      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error("Contact submit error:", error);
      alert("Server error. Please try again later.");
    }
  };


  return (
    <div className="new-landing-page">
      <Header scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section className="new-hero" id="home">
        <div className="new-container">
          <div className="new-hero-content">
            <div className="new-hero-text">
              <h6 className="new-hero-subtitle">Premium Airline Experience</h6>
              <h1 className="new-hero-title">
                Discover The World <br />
                <span className="new-hero-highlight">With Comfort</span>
              </h1>
              <p className="new-hero-description">
                Experience luxury air travel with SkyJet. We connect you to over
                150 destinations worldwide with premium service, comfort, and
                safety.
              </p>

              <div className="new-hero-buttons">
                <button
                  className="new-btn new-btn-primary new-btn-lg"
                  onClick={(e) => handleNavigationClick(e, "book")}
                >
                  <i className="fas fa-ticket-alt"></i>
                  Book Flight
                </button>
                <button
                  className="new-btn new-btn-secondary new-btn-lg"
                  onClick={(e) => handleNavigationClick(e, "explore")}
                >
                  <i className="fas fa-map-marked-alt"></i>
                  Explore Destinations
                </button>
              </div>
            </div>
            <FlightSearchForm></FlightSearchForm>
          </div>
        </div>
      </section>

      <section className="new-destination-slider">
        <div className="new-container">
          <div className="new-section-header">
            <span className="new-section-subtitle">TOP PICKS</span>
            <h2 className="new-section-title">Popular Destinations</h2>
            <p className="new-section-description">
              Handpicked places loved by travelers worldwide
            </p>
          </div>

          <div className="new-destination-track">
            <div className="new-destination-slide">
              <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"  alt=""/>
              <div className="new-destination-info-box">
                <h3>New York</h3>
                <span>120+ Flights Available</span>
                <button className="new-destination-btn">Explore</button>
              </div>
            </div>

            <div className="new-destination-slide">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"  alt=""/>
              <div className="new-destination-info-box">
                <h3>Tokyo</h3>
                <span>95+ Flights Available</span>
                <button className="new-destination-btn">Explore</button>
              </div>
            </div>

            <div className="new-destination-slide">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="" />
              <div className="new-destination-info-box">
                <h3>Paris</h3>
                <span>14+ Flights Available</span>
                <button className="new-destination-btn">Explore</button>
              </div>
            </div>

            <div className="new-destination-slide">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="" />
              <div className="new-destination-info-box">
                <h3>Dubai</h3>
                <span>80+ Flights Available</span>
                <button className="new-destination-btn">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="new-about" id="about">
        <div className="new-container">
          <div className="new-section-header">
            <h6 className="new-section-subtitle">About SkyJet</h6>
            <h2 className="new-section-title">Your Trusted Airline Partner</h2>
            <p className="new-section-description">
              With over 20 years of excellence in aviation, we're committed to
              providing exceptional travel experiences.
            </p>
          </div>

          <div className="new-about-content">
            <div className="new-about-image">
              <div className="new-about-image-container">
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="SkyJet Airplane"
                />
                <div className="new-about-experience">
                  <h3>20+</h3>
                  <p>Years of Excellence</p>
                </div>
              </div>
            </div>

            <div className="new-about-text">
              <h3>Our Story</h3>
              <p>
                Founded in 2003, SkyJet Airlines started with a simple vision:
                to make premium air travel accessible to everyone. What began as
                a small regional airline has grown into an international carrier
                serving over 150 destinations worldwide.
              </p>
              <p>
                Our commitment to safety, comfort, and exceptional service has
                earned us numerous awards and the trust of millions of
                passengers. We continuously invest in modern aircraft, advanced
                technology, and comprehensive crew training to ensure the
                highest standards of aviation excellence.
              </p>

              <div className="new-about-features">
                <div className="new-about-feature">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Safety First</h4>
                    <p>ISO 9001 certified safety management system</p>
                  </div>
                </div>
                <div className="new-about-feature">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Modern Fleet</h4>
                    <p>Average fleet age of 5 years with latest technology</p>
                  </div>
                </div>
                <div className="new-about-feature">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Sustainable Operations</h4>
                    <p>Carbon offset program and fuel-efficient aircraft</p>
                  </div>
                </div>
                <div className="new-about-feature">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Global Network</h4>
                    <p>Partnerships with 30+ international airlines</p>
                  </div>
                </div>
              </div>

              <button className="new-btn new-btn-primary">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="new-contact" id="contact">
        <div className="new-container">
          <div className="new-section-header">
            <h6 className="new-section-subtitle">Contact Us</h6>
            <h2 className="new-section-title">Get In Touch With SkyJet</h2>
            <p className="new-section-description">
              Have questions or need assistance? Our team is here to help you
              with all your travel needs.
            </p>
          </div>

          <div className="new-contact-content">
            {/* Contact Form - Left Side */}
            <div className="new-contact-form-container">
              {formSubmitted && (
                <div className="new-form-success">
                  <i className="fas fa-check-circle"></i>
                  <p>
                    Thank you! Your message has been sent successfully. We'll
                    get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form className="new-contact-form" onSubmit={handleContactSubmit}>
                <div className="new-form-row">
                  <div className="new-form-group">
                    <label className="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="new-form-group">
                    <label className="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="new-form-row">
                  <div className="new-form-group">
                    <label className="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="new-form-group">
                    <label className="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Flight Booking</option>
                      <option value="cancellation">Cancellation/Change</option>
                      <option value="baggage">Baggage Inquiry</option>
                      <option value="refund">Refund Request</option>
                      <option value="feedback">Feedback/Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="new-form-group">
                  <label className="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    placeholder="Please provide details about your inquiry..."
                    rows="5"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="new-btn new-btn-primary new-btn-block"
                >
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info Cards - Right Side in 2x2 Grid */}
            <div className="new-contact-info">
              <div className="new-contact-info-grid">
                <div className="new-contact-card">
                  <div className="new-contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="new-contact-card-content">
                    <h3>Visit Our Office</h3>
                    <p>123 Aviation Way, Suite 100</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                </div>

                <div className="new-contact-card">
                  <div className="new-contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="new-contact-card-content">
                    <h3>Call Us</h3>
                    <p>Reservations: +1 (800) 123-4567</p>
                    <p>Customer Service: +1 (800) 123-4568</p>
                    <p>Emergency: +1 (800) 123-4569</p>
                  </div>
                </div>

                <div className="new-contact-card">
                  <div className="new-contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="new-contact-card-content">
                    <h3>Email Us</h3>
                    <p>Bookings: bookings@skyjet.com</p>
                    <p>Support: support@skyjet.com</p>
                    <p>Corporate: corporate@skyjet.com</p>
                  </div>
                </div>

                <div className="new-contact-card">
                  <div className="new-contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="new-contact-card-content">
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 6:00 AM - 12:00 AM EST</p>
                    <p>Saturday - Sunday: 8:00 AM - 10:00 PM EST</p>
                    <p>24/7 Emergency Support Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default NewLandingPage;
