import React, { useState } from "react";
import SpotlightServiceCard from "../components/ui/SpotlightServiceCard";
import "./Services.css";
import Header from "./Header";
import Footer from "./Footer";

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

  const services = [
    {
      id: 1,
      icon: "fas fa-plane-departure",
      title: "Flight Booking",
      description:
        "Book domestic and international flights at the best prices with our easy-to-use platform.",
      features: [
        "24/7 Customer Support",
        "Best Price Guarantee",
        "Flexible Cancellation",
      ],
    },
    {
      id: 2,
      icon: "fas fa-hotel",
      title: "Hotel Reservations",
      description:
        "Find and book the perfect accommodation for your stay with our extensive hotel network.",
      features: [
        "Verified Reviews",
        "Free Cancellation",
        "Best Rate Guarantee",
      ],
    },
    {
      id: 3,
      icon: "fas fa-car",
      title: "Car Rentals",
      description:
        "Rent cars from top providers at competitive rates for a comfortable journey.",
      features: [
        "No Hidden Fees",
        "Free Modifications",
        "24/7 Roadside Assistance",
      ],
    },
    {
      id: 4,
      icon: "fas fa-umbrella-beach",
      title: "Holiday Packages",
      description:
        "Explore our curated holiday packages including flights, hotels, and activities.",
      features: [
        "Customizable Itineraries",
        "Local Experiences",
        "Expert Guidance",
      ],
    },
    {
      id: 5,
      icon: "fas fa-shield-alt",
      title: "Travel Insurance",
      description:
        "Protect your journey with comprehensive travel insurance coverage.",
      features: [
        "Medical Coverage",
        "Trip Cancellation",
        "Lost Baggage Protection",
      ],
    },
    {
      id: 6,
      icon: "fas fa-concierge-bell",
      title: "Airport Services",
      description:
        "Enjoy premium airport services including lounges, transfers, and meet & assist.",
      features: ["VIP Lounge Access", "Fast Track", "Personal Assistant"],
    },
  ];

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

          {/* Search Tabs */}
          <div className="search-tabs">
            <button
              className={`tab-btn ${activeTab === "flights" ? "active" : ""}`}
              onClick={() => setActiveTab("flights")}
            >
              <i className="fas fa-plane"></i> Flights
            </button>
            <button
              className={`tab-btn ${activeTab === "hotels" ? "active" : ""}`}
              onClick={() => setActiveTab("hotels")}
            >
              <i className="fas fa-hotel"></i> Hotels
            </button>
            <button
              className={`tab-btn ${activeTab === "packages" ? "active" : ""}`}
              onClick={() => setActiveTab("packages")}
            >
              <i className="fas fa-umbrella-beach"></i> Packages
            </button>
          </div>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            {activeTab === "flights" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>From</label>
                    <input
                      type="text"
                      name="from"
                      placeholder="City or Airport"
                      value={searchForm.from}
                      onChange={handleSearchChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <input
                      type="text"
                      name="to"
                      placeholder="City or Airport"
                      value={searchForm.to}
                      onChange={handleSearchChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Depart</label>
                    <input
                      type="date"
                      name="departDate"
                      value={searchForm.departDate}
                      onChange={handleSearchChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Return</label>
                    <input
                      type="date"
                      name="returnDate"
                      value={searchForm.returnDate}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Passengers</label>
                    <select
                      name="passengers"
                      value={searchForm.passengers}
                      onChange={handleSearchChange}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <select
                      name="class"
                      value={searchForm.class}
                      onChange={handleSearchChange}
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            {activeTab === "hotels" && (
              <>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Destination</label>
                    <input
                      type="text"
                      placeholder="City or Hotel Name"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Check-in</label>
                    <input type="date" required />
                  </div>
                  <div className="form-group">
                    <label>Check-out</label>
                    <input type="date" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Guests</label>
                    <select>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Rooms</label>
                    <select>
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} Room{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
            {activeTab === "packages" && (
              <>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Destination</label>
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <select>
                      <option>3-5 Days</option>
                      <option>6-8 Days</option>
                      <option>9-12 Days</option>
                      <option>13+ Days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Budget</label>
                    <select>
                      <option>$500 - $1000</option>
                      <option>$1000 - $2000</option>
                      <option>$2000 - $3000</option>
                      <option>$3000+</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Travelers</label>
                    <select>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Traveler{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Month</label>
                    <select>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                      <option>April</option>
                      <option>May</option>
                      <option>June</option>
                      <option>July</option>
                      <option>August</option>
                      <option>September</option>
                      <option>October</option>
                      <option>November</option>
                      <option>December</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="services-container">
          <div className="section-header">
            <h2>What We Offer</h2>
            <p>Comprehensive travel solutions tailored to your needs</p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i> {feature}
                    </li>
                  ))}
                </ul>
                <button className="service-btn">Learn More</button>
              </div>
            ))}
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

          <div className="new-services-grid">
            <SpotlightServiceCard
              icon="fas fa-shield-alt"
              title="Enhanced Security"
              description="Our state of the art software offers peace of mind through strict security measures."
            />

            <SpotlightServiceCard
              icon="fas fa-couch"
              title="Premium Comfort"
              description="Relax with extra legroom, adjustable seats, and luxury interiors."
              color="rgba(120,200,255,0.35)"
            />

            <SpotlightServiceCard
              icon="fas fa-wifi"
              title="Free Wi-Fi"
              description="High-speed internet access on all international flights."
              color="rgba(140,255,180,0.35)"
            />

            <SpotlightServiceCard
              icon="fas fa-utensils"
              title="Gourmet Dining"
              description="Chef-prepared meals with premium ingredients."
              color="rgba(255,180,120,0.35)"
            />

            <SpotlightServiceCard
              icon="fas fa-headset"
              title="24/7 Support"
              description="Round-the-clock customer service for all your travel needs."
              color="rgba(108, 196, 201, 0.35)"
            />

            <SpotlightServiceCard
              icon="fas fa-luggage-cart"
              title="Extra Baggage"
              description="Generous baggage allowance with priority handling."
              color="rgba(255, 120, 180, 0.35)"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="services-container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>
              Get the latest deals and travel inspiration straight to your inbox
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
