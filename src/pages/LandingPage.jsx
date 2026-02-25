import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const slides = [
    {
      url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      alt: "Airplane wing view at sunset",
    },
    {
      url: "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Airport terminal with plane",
    },
    {
      url: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      alt: "Beautiful beach destination",
    },
  ];

  // Flight deals data with more details
  const [flightDeals, setFlightDeals] = useState([
    {
      id: 1,
      from: "New York (JFK)",
      to: "London (LHR)",
      price: 399,
      originalPrice: 799,
      discount: "50% OFF",
      airline: "British Airways",
      airlineCode: "BA",
      duration: "7h 20m",
      badge: "HOT DEAL",
      badgeColor: "bg-red-500",
      stops: "Non-stop",
      departureTime: "10:30 AM",
      arrivalTime: "10:50 PM",
      seatsLeft: 12,
      cabin: "Economy",
      flightNumber: "BA178",
    },
    {
      id: 2,
      from: "Los Angeles (LAX)",
      to: "Tokyo (HND)",
      price: 599,
      originalPrice: 1199,
      discount: "50% OFF",
      airline: "Japan Airlines",
      airlineCode: "JL",
      duration: "11h 45m",
      badge: "POPULAR",
      badgeColor: "bg-orange-500",
      stops: "Non-stop",
      departureTime: "11:15 PM",
      arrivalTime: "04:00 AM",
      seatsLeft: 8,
      cabin: "Economy",
      flightNumber: "JL65",
    },
    {
      id: 3,
      from: "Miami (MIA)",
      to: "Paris (CDG)",
      price: 449,
      originalPrice: 899,
      discount: "50% OFF",
      airline: "Air France",
      airlineCode: "AF",
      duration: "8h 30m",
      badge: "WEEKEND SPECIAL",
      badgeColor: "bg-purple-500",
      stops: "Non-stop",
      departureTime: "06:45 PM",
      arrivalTime: "09:15 AM",
      seatsLeft: 5,
      cabin: "Economy",
      flightNumber: "AF99",
    },
    {
      id: 4,
      from: "Chicago (ORD)",
      to: "Dubai (DXB)",
      price: 699,
      originalPrice: 1399,
      discount: "50% OFF",
      airline: "Emirates",
      airlineCode: "EK",
      duration: "12h 15m",
      badge: "LUXURY",
      badgeColor: "bg-yellow-500",
      stops: "Non-stop",
      departureTime: "08:20 PM",
      arrivalTime: "07:35 PM",
      seatsLeft: 15,
      cabin: "Economy",
      flightNumber: "EK236",
    },
  ]);

  // Additional state for functionalities
  const [sortBy, setSortBy] = useState("popular");
  const [filterCabin, setFilterCabin] = useState("all");
  const [filterStops, setFilterStops] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showQuickView, setShowQuickView] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide Every 6 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Filter and sort functions
  const filterAndSortDeals = () => {
    let filtered = [...flightDeals];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.airline.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Cabin filter
    if (filterCabin !== "all") {
      filtered = filtered.filter(deal => deal.cabin.toLowerCase() === filterCabin.toLowerCase());
    }

    // Stops filter
    if (filterStops !== "all") {
      if (filterStops === "non-stop") {
        filtered = filtered.filter(deal => deal.stops === "Non-stop");
      } else if (filterStops === "1-stop") {
        filtered = filtered.filter(deal => deal.stops === "1 Stop");
      }
    }

    // Price range filter
    filtered = filtered.filter(deal => 
      deal.price >= priceRange.min && deal.price <= priceRange.max
    );

    // Sorting
    switch(sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        filtered.sort((a, b) => {
          const getMinutes = (duration) => {
            const [hours, mins] = duration.split('h ');
            return parseInt(hours) * 60 + parseInt(mins || '0');
          };
          return getMinutes(a.duration) - getMinutes(b.duration);
        });
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.seatsLeft - a.seatsLeft);
        break;
    }

    return filtered;
  };

  // Toggle wishlist
  const toggleWishlist = (dealId) => {
    if (wishlist.includes(dealId)) {
      setWishlist(wishlist.filter(id => id !== dealId));
    } else {
      setWishlist([...wishlist, dealId]);
    }
  };

  // Book flight handler
  const handleBookFlight = (deal) => {
    // Store selected flight in session storage for pre-filling search
    sessionStorage.setItem('selectedFlight', JSON.stringify({
      from: deal.from,
      to: deal.to,
      date: new Date().toISOString().split('T')[0],
      cabin: deal.cabin
    }));
    navigate("/user/flights");
  };

  // Quick view handler
  const handleQuickView = (dealId) => {
    setShowQuickView(showQuickView === dealId ? null : dealId);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // const goToPrevious = () => {
  //   setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  // };

  // const goToNext = () => {
  //   setCurrentIndex((prev) => (prev + 1) % slides.length);
  // };

  const filteredDeals = filterAndSortDeals();
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="font-sans antialiased">
        <Header />

        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-screen w-full overflow-hidden">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image with Zoom */}
              <div
                className={`w-full h-full bg-cover bg-center transition-all duration-[5000ms] ${
                  index === currentIndex ? "scale-110" : "scale-100"
                }`}
                style={{ backgroundImage: `url(${slide.url})` }}
              />

              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            </div>
          ))}
          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Your Journey Begins Here
            </h1>

            <p className="text-lg md:text-2xl mb-8 max-w-2xl drop-shadow-md">
              Discover the world with comfort and ease. Unbeatable fares,
              exceptional service.
            </p>

            <button className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:scale-105 transition duration-300 text-white font-semibold px-8 py-3 rounded-full shadow-xl" onClick={() => navigate("/user/flights")}>
              Search Flights
            </button>
          </div>
          {/* Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-3 bg-gray-400/40 backdrop-blur-md px-5 py-2 rounded-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                    index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Left/Right Navigation Arrows */}
          {/* <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20 hidden sm:block"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20 hidden sm:block"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button> */}
        </section>

        {/* ================= FLIGHT DEALS / OFFERS SECTION WITH FUNCTIONALITIES ================= */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                 Hot Flight Deals
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Grab these amazing offers before they're gone! Limited time deals to popular destinations.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 bg-gray-50 p-4 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Shortest Duration</option>
                </select>

                {/* Cabin Filter */}
                <select
                  value={filterCabin}
                  onChange={(e) => setFilterCabin(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All Cabins</option>
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>

                {/* Stops Filter */}
                <select
                  value={filterStops}
                  onChange={(e) => setFilterStops(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All Stops</option>
                  <option value="non-stop">Non-stop only</option>
                  <option value="1-stop">1 Stop</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange.min} - ${priceRange.max}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Active Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-sky-600">
                      ×
                    </button>
                  </span>
                )}
                {filterCabin !== 'all' && (
                  <span className="inline-flex items-center bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                    Cabin: {filterCabin}
                    <button onClick={() => setFilterCabin('all')} className="ml-2 hover:text-sky-600">
                      ×
                    </button>
                  </span>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {filteredDeals.length} deals found
                </span>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(deal.id)}
                    className="absolute top-4 left-4 z-20 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
                  >
                    <svg
                      className={`w-5 h-5 ${wishlist.includes(deal.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                      fill={wishlist.includes(deal.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Badge */}
                  <div className={`absolute top-4 right-4 ${deal.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg`}>
                    {deal.badge}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-16 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                    {deal.discount}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Airline with Code */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-gray-500">
                        {deal.airline}
                      </div>
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {deal.airlineCode} • {deal.flightNumber}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{deal.from.split(' ')[0]}</div>
                        <div className="text-xs text-gray-500">{deal.from.split('(')[1]}</div>
                        <div className="text-xs font-semibold text-gray-600 mt-1">{deal.departureTime}</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span className="text-xs text-gray-400 mt-1">{deal.duration}</span>
                        <span className="text-xs text-green-600 font-semibold">{deal.stops}</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{deal.to.split(' ')[0]}</div>
                        <div className="text-xs text-gray-500">{deal.to.split('(')[1]}</div>
                        <div className="text-xs font-semibold text-gray-600 mt-1">{deal.arrivalTime}</div>
                      </div>
                    </div>

                    {/* Seats Left Indicator */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Seats left</span>
                        <span className={`font-semibold ${deal.seatsLeft < 10 ? 'text-red-500' : 'text-green-500'}`}>
                          {deal.seatsLeft} seats
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${deal.seatsLeft < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${(deal.seatsLeft / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-3">
                      <span className="text-gray-400 line-through text-sm mr-2">{deal.originalPrice}</span>
                      <span className="text-3xl font-bold text-sky-600">${deal.price}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickView(deal.id)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-300 text-sm"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={() => handleBookFlight(deal)}
                        className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl text-sm"
                      >
                        Book Now
                      </button>
                    </div>

                    {/* Limited Offer Text */}
                    <p className="text-xs text-center text-gray-400 mt-3">
                      *Limited time offer • {deal.cabin} class
                    </p>
                  </div>

                  {/* Quick View Modal */}
                  {showQuickView === deal.id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-4 overflow-y-auto z-30">
                      <button
                        onClick={() => setShowQuickView(null)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <h3 className="font-bold text-lg mb-3">Flight Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Airline:</span> {deal.airline}</p>
                        <p><span className="font-semibold">Flight:</span> {deal.airlineCode}{deal.flightNumber}</p>
                        <p><span className="font-semibold">From:</span> {deal.from}</p>
                        <p><span className="font-semibold">To:</span> {deal.to}</p>
                        <p><span className="font-semibold">Departure:</span> {deal.departureTime}</p>
                        <p><span className="font-semibold">Arrival:</span> {deal.arrivalTime}</p>
                        <p><span className="font-semibold">Duration:</span> {deal.duration}</p>
                        <p><span className="font-semibold">Stops:</span> {deal.stops}</p>
                        <p><span className="font-semibold">Cabin:</span> {deal.cabin}</p>
                        <p><span className="font-semibold">Seats Available:</span> {deal.seatsLeft}</p>
                        <button
                          onClick={() => handleBookFlight(deal)}
                          className="w-full mt-3 bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700"
                        >
                          Book This Flight
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-sky-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* View All Deals Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/user/flights")}
                className="bg-transparent border-2 border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2"
              >
                View All Deals
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;