import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import FlightSearchForm from "./FlightSearchForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
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

  const handleExploreServices = () => {
    scrollToSection("services");
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
      case "services":
        handleExploreServices();
        break;
      default:
        break;
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
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

  const faqs = [
    {
      question: "How do I book a flight on SkyJet?",
      answer:
        "You can book flights directly through our website, mobile app, or by contacting our customer service at +1 (800) 123-4567. Simply enter your travel details, select your preferred flight, and complete the payment process.",
    },
    {
      question: "What is your baggage policy?",
      answer:
        "Economy class passengers can check one bag up to 23kg. Business class passengers can check two bags up to 32kg each. All passengers can carry one cabin bag and one personal item. Additional baggage can be purchased during booking or at the airport.",
    },
    {
      question: "Can I change or cancel my booking?",
      answer:
        "Yes, you can change or cancel your booking through our website or mobile app. Changes made more than 24 hours before departure are free for Business class and have a fee for Economy. Cancellation policies vary by fare type - please check your booking details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and Apple Pay. We also offer installment payment options for selected bookings.",
    },
    {
      question:
        "Do you offer special assistance for passengers with disabilities?",
      answer:
        "Yes, we provide comprehensive assistance for passengers with disabilities including wheelchair service, priority boarding, and assistance with mobility devices. Please inform us of your needs at least 48 hours before your flight.",
    },
    {
      question: "What COVID-19 safety measures are in place?",
      answer:
        "We follow strict COVID-19 protocols including enhanced cleaning of aircraft, HEPA air filtration systems, mandatory mask requirements (where applicable), and flexible booking policies. Please check current travel requirements for your destination.",
    },
  ];

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

      {/* Destinations Section */}
      {/* <section className="new-destinations" id="destinations">
        <div className="new-container">
          <div className="new-section-header">
            <h6 className="new-section-subtitle">Popular Destinations</h6>
            <h2 className="new-section-title">Explore Amazing Places</h2>
            <p className="new-section-description">
              Discover our most sought-after destinations with exclusive deals
              and premium service.
            </p>
          </div>

          <div className="new-destinations-grid">
            <div className="new-destination-card">
              <div className="new-destination-image nyc">
                <div className="new-destination-overlay">
                  <span className="new-destination-tag">USA</span>
                  <span className="new-destination-price">From $499</span>
                </div>
              </div>
              <div className="new-destination-content">
                <h3>New York City</h3>
                <p>The city that never sleeps</p>
                <div className="new-destination-info">
                  <span>
                    <i className="fas fa-clock"></i> 8h flight
                  </span>
                  <span>
                    <i className="fas fa-star"></i> 4.8/5
                  </span>
                </div>
              </div>
            </div>

            <div className="new-destination-card">
              <div className="new-destination-image paris">
                <div className="new-destination-overlay">
                  <span className="new-destination-tag">France</span>
                  <span className="new-destination-price">From $599</span>
                </div>
              </div>
              <div className="new-destination-content">
                <h3>Paris</h3>
                <p>City of Light & Love</p>
                <div className="new-destination-info">
                  <span>
                    <i className="fas fa-clock"></i> 7h flight
                  </span>
                  <span>
                    <i className="fas fa-star"></i> 4.9/5
                  </span>
                </div>
              </div>
            </div>

            <div className="new-destination-card">
              <div className="new-destination-image tokyo">
                <div className="new-destination-overlay">
                  <span className="new-destination-tag">Japan</span>
                  <span className="new-destination-price">From $899</span>
                </div>
              </div>
              <div className="new-destination-content">
                <h3>Tokyo</h3>
                <p>Modern meets traditional</p>
                <div className="new-destination-info">
                  <span>
                    <i className="fas fa-clock"></i> 14h flight
                  </span>
                  <span>
                    <i className="fas fa-star"></i> 4.7/5
                  </span>
                </div>
              </div>
            </div>

            <div className="new-destination-card">
              <div className="new-destination-image dubai">
                <div className="new-destination-overlay">
                  <span className="new-destination-tag">UAE</span>
                  <span className="new-destination-price">From $699</span>
                </div>
              </div>
              <div className="new-destination-content">
                <h3>Dubai</h3>
                <p>City of Gold</p>
                <div className="new-destination-info">
                  <span>
                    <i className="fas fa-clock"></i> 12h flight
                  </span>
                  <span>
                    <i className="fas fa-star"></i> 4.8/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
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

      {/* Services Section */}
      <section className="new-services" id="services">
        <div className="new-container">
          <div className="new-section-header">
            <h6 className="new-section-subtitle">Our Services</h6>
            <h2 className="new-section-title">Why Choose SkyJet</h2>
            <p className="new-section-description">
              Experience world-class service with our premium offerings.
            </p>
          </div>

          <div className="new-services-grid">
            <div className="new-service-card">
              <div className="new-service-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Maximum Safety</h3>
              <p>
                State-of-the-art safety measures with certified crew and
                advanced aircraft.
              </p>
            </div>

            <div className="new-service-card">
              <div className="new-service-icon">
                <i className="fas fa-couch"></i>
              </div>
              <h3>Premium Comfort</h3>
              <p>
                Luxurious seating with extra legroom and adjustable headrests.
              </p>
            </div>

            <div className="new-service-card">
              <div className="new-service-icon">
                <i className="fas fa-wifi"></i>
              </div>
              <h3>Free Wi-Fi</h3>
              <p>High-speed internet access on all international flights.</p>
            </div>

            <div className="new-service-card">
              <div className="new-service-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Gourmet Dining</h3>
              <p>
                Chef-prepared meals with premium ingredients and local flavors.
              </p>
            </div>

            <div className="new-service-card">
              <div className="new-service-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer service for all your travel needs.</p>
            </div>

            <div className="new-service-card">
              <div className="new-service-icon">
                <i className="fas fa-luggage-cart"></i>
              </div>
              <h3>Extra Baggage</h3>
              <p>Generous baggage allowance with priority handling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="new-faqs" id="faqs">
        <div className="new-container">
          <div className="new-section-header">
            <h6 className="new-section-subtitle">Frequently Asked Questions</h6>
            <h2 className="new-section-title">
              Have Questions? We Have Answers
            </h2>
            <p className="new-section-description">
              Find quick answers to common questions about booking, travel, and
              our services.
            </p>
          </div>

          <div className="new-faqs-container">
            <div className="new-faqs-list">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`new-faq-item ${activeFaq === index ? "active" : ""}`}
                >
                  <button
                    className="new-faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <i
                      className={`fas ${activeFaq === index ? "fa-chevron-up" : "fa-chevron-down"}`}
                    ></i>
                  </button>
                  <div className="new-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="new-faqs-sidebar">
              <div className="new-faqs-help">
                <div className="new-faqs-help-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <h3>Need More Help?</h3>
                <p>
                  Our customer support team is available 24/7 to assist you with
                  any questions or concerns.
                </p>
                <div className="new-faqs-contact-info">
                  <p>
                    <i className="fas fa-phone"></i> +1 (800) 123-4567
                  </p>
                  <p>
                    <i className="fas fa-envelope"></i> support@skyjet.com
                  </p>
                  <p>
                    <i className="fas fa-clock"></i> Available 24/7
                  </p>
                </div>
                <button className="new-btn new-btn-primary">
                  Live Chat Support
                </button>
              </div>
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
                    <label htmlFor="name">Full Name *</label>
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
                    <label htmlFor="email">Email Address *</label>
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
                    <label htmlFor="phone">Phone Number</label>
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
                    <label htmlFor="subject">Subject *</label>
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
                  <label htmlFor="message">Message *</label>
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
