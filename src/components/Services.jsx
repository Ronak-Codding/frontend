import React, { useState } from "react";
import "./Services.css";
import Footer from "./Footer";
import Header from "./Header";

const Services = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
    class: "economy",
  });

  const handleSearchChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", searchForm);
    // Implement search logic here
  };

  // const services = [
  //   {
  //     id: 1,
  //     icon: "fas fa-plane-departure",
  //     title: "Flight Booking",
  //     description:
  //       "Book domestic and international flights at the best prices with our easy-to-use platform.",
  //     features: [
  //       "24/7 Customer Support",
  //       "Best Price Guarantee",
  //       "Flexible Cancellation",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     icon: "fas fa-hotel",
  //     title: "Hotel Reservations",
  //     description:
  //       "Find and book the perfect accommodation for your stay with our extensive hotel network.",
  //     features: [
  //       "Verified Reviews",
  //       "Free Cancellation",
  //       "Best Rate Guarantee",
  //     ],
  //   },
  //   {
  //     id: 3,
  //     icon: "fas fa-car",
  //     title: "Car Rentals",
  //     description:
  //       "Rent cars from top providers at competitive rates for a comfortable journey.",
  //     features: [
  //       "No Hidden Fees",
  //       "Free Modifications",
  //       "24/7 Roadside Assistance",
  //     ],
  //   },
  //   {
  //     id: 4,
  //     icon: "fas fa-umbrella-beach",
  //     title: "Holiday Packages",
  //     description:
  //       "Explore our curated holiday packages including flights, hotels, and activities.",
  //     features: [
  //       "Customizable Itineraries",
  //       "Local Experiences",
  //       "Expert Guidance",
  //     ],
  //   },
  //   {
  //     id: 5,
  //     icon: "fas fa-shield-alt",
  //     title: "Travel Insurance",
  //     description:
  //       "Protect your journey with comprehensive travel insurance coverage.",
  //     features: [
  //       "Medical Coverage",
  //       "Trip Cancellation",
  //       "Lost Baggage Protection",
  //     ],
  //   },
  //   {
  //     id: 6,
  //     icon: "fas fa-concierge-bell",
  //     title: "Airport Services",
  //     description:
  //       "Enjoy premium airport services including lounges, transfers, and meet & assist.",
  //     features: ["VIP Lounge Access", "Fast Track", "Personal Assistant"],
  //   },
  // ];

  const popularDestinations = [
    {
      city: "New York",
      code: "JFK",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      city: "London",
      code: "LHR",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      city: "Tokyo",
      code: "HND",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      city: "Paris",
      code: "CDG",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      city: "Dubai",
      code: "DXB",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      city: "Singapore",
      code: "SIN",
      image:
        "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "Business Traveler",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "SkyJet made my business trip seamless. The booking process was smooth and the customer service was exceptional.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Frequent Flyer",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "I've been using SkyJet for all my travels. Their prices are competitive and the platform is very user-friendly.",
      rating: 5,
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Family Traveler",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      text: "Booked a family vacation through SkyJet. The holiday package was perfect and saved us a lot of money.",
      rating: 5,
    },
  ];

  return (
    <>
      <Header></Header>
      <div className="services-page">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="services-hero-overlay"></div>
          <div className="services-container">
            <div className="services-hero-content">
              <h1>Our Services</h1>
              <p>
                Experience the best in class travel services with SkyJet. From
                flight bookings to complete holiday packages, we've got you
                covered.
              </p>
            </div>

          </div>
        </section>

        {/* Popular Destinations */}
        <section className="destinations-section">
          <div className="services-container">
            <div className="section-header">
              <h2>Popular Destinations</h2>
              <p>Most booked locations by our travelers</p>
            </div>
            <div className="destinations-grid">
              {popularDestinations.map((dest, index) => (
                <div key={index} className="destination-card">
                  <img src={dest.image} alt={dest.city} />
                  <div className="destination-info">
                    <h3>{dest.city}</h3>
                    <p>{dest.code}</p>
                    <button className="destination-btn">Explore</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="services-container">
            <div className="section-header">
              <h2>What Our Customers Say</h2>
              <p>Real experiences from happy travelers</p>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <img src={testimonial.image} alt={testimonial.name} />
                    <div>
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-section">
          <div className="services-container">
            <div className="section-header">
              <h2>Why Choose SkyJet</h2>
              <p>Experience the difference with our premium services</p>
            </div>
            <div className="features-grid">
              <div className="feature-item">
                <i className="fas fa-wifi"></i>
                <h3>24/7 Support</h3>
                <p>
                  Round-the-clock customer service for all your travel needs
                </p>
              </div>
              <div className="feature-item">
                <i className="fas fa-tag"></i>
                <h3>Best Prices</h3>
                <p>Competitive rates and exclusive deals on all bookings</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-lock"></i>
                <h3>Secure Payments</h3>
                <p>Safe and encrypted payment processing for peace of mind</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <h3>Instant Confirmation</h3>
                <p>Get immediate confirmation for all your bookings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="newsletter-section">
          <div className="services-container">
            <div className="newsletter-content">
              <h2>Subscribe to Our Newsletter</h2>
              <p>
                Get the latest deals and travel inspiration straight to your
                inbox
              </p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Services;
