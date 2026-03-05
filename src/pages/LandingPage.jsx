import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // Hero Section Slides with optimized images
  const slides = [
    {
      id: 1,
      desktopUrl:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      mobileUrl:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Airplane wing view at sunset",
      title: "Fly Beyond Horizons",
      subtitle: "Experience the world from above",
    },
    {
      id: 2,
      desktopUrl:
        "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      mobileUrl:
        "https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Airport terminal with plane",
      title: "Seamless Travel Experience",
      subtitle: "Comfort meets efficiency",
    },
    {
      id: 3,
      desktopUrl:
        "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      mobileUrl:
        "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Beautiful beach destination",
      title: "Discover Paradise",
      subtitle: "Your dream destination awaits",
    },
    {
      id: 4,
      desktopUrl:
        "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1920&q=80",
      mobileUrl:
        "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=800&q=80",
      alt: "Passenger airplane taking off",
      title: "Take Off to Adventure",
      subtitle: "Start your journey today",
    },
  ];

  // Upcoming Flights Data
  const upcomingFlights = [
    {
      id: 1,
      airline: "Emirates",
      flightNumber: "EK 501",
      from: "New York (JFK)",
      to: "Dubai (DXB)",
      departure: "10:30 AM",
      arrival: "07:45 AM (+1)",
      duration: "12h 15m",
      price: "₹45,999",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      stops: "Non-stop",
    },
    {
      id: 2,
      airline: "Singapore Airlines",
      flightNumber: "SQ 321",
      from: "London (LHR)",
      to: "Singapore (SIN)",
      departure: "09:15 PM",
      arrival: "05:30 PM (+1)",
      duration: "13h 15m",
      price: "₹52,999",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      stops: "Non-stop",
    },
    {
      id: 3,
      airline: "Qatar Airways",
      flightNumber: "QR 707",
      from: "Chicago (ORD)",
      to: "Doha (DOH)",
      departure: "04:45 PM",
      arrival: "01:15 PM (+1)",
      duration: "11h 30m",
      price: "₹38,999",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      stops: "Non-stop",
    },
    {
      id: 4,
      airline: "Lufthansa",
      flightNumber: "LH 403",
      from: "Frankfurt (FRA)",
      to: "Tokyo (HND)",
      departure: "08:20 PM",
      arrival: "03:45 PM (+1)",
      duration: "11h 25m",
      price: "₹42,999",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      stops: "1 stop",
    },
    {
      id: 5,
      airline: "British Airways",
      flightNumber: "BA 178",
      from: "New York (JFK)",
      to: "London (LHR)",
      departure: "07:30 PM",
      arrival: "07:30 AM (+1)",
      duration: "7h 00m",
      price: "₹42,999",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      stops: "Non-stop",
    },
    {
      id: 6,
      airline: "Air France",
      flightNumber: "AF 123",
      from: "Los Angeles (LAX)",
      to: "Paris (CDG)",
      departure: "05:15 PM",
      arrival: "11:30 AM (+1)",
      duration: "10h 15m",
      price: "₹38,999",
      logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80",
      stops: "Non-stop",
    },
  ];

  // Popular Destinations Data
  const popularDestinations = [
    {
      id: 1,
      city: "Paris",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹24,999",
      description: "City of Love & Lights",
      attractions: ["Eiffel Tower", "Louvre Museum", "Seine River"],
    },
    {
      id: 2,
      city: "Tokyo",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹36,999",
      description: "Tradition meets Future",
      attractions: ["Shibuya Crossing", "Mount Fuji", "Tokyo Tower"],
    },
    {
      id: 3,
      city: "New York",
      country: "USA",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹18,999",
      description: "The Big Apple",
      attractions: ["Statue of Liberty", "Times Square", "Central Park"],
    },
    {
      id: 4,
      city: "Dubai",
      country: "UAE",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹32,999",
      description: "Luxury & Innovation",
      attractions: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall"],
    },
    {
      id: 5,
      city: "Rome",
      country: "Italy",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹22,999",
      description: "Eternal City",
      attractions: ["Colosseum", "Vatican City", "Trevi Fountain"],
    },
    {
      id: 6,
      city: "Delhi",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      price: "₹9,999",
      description: "Heart of India",
      attractions: ["Red Fort", "India Gate", "Qutub Minar"],
    },
    {
      id: 7,
      city: "London",
      country: "UK",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹21,999",
      description: "Royal Heritage",
      attractions: ["Big Ben", "London Eye", "Buckingham Palace"],
    },
    {
      id: 8,
      city: "Sydney",
      country: "Australia",
      image:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "₹48,999",
      description: "Harbor City",
      attractions: ["Sydney Opera House", "Bondi Beach", "Harbour Bridge"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check device type
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Auto Slide Every 6 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleBooking = (flightId) => {
    navigate(`/user/booking/${flightId}`);
  };

  // Slider settings for destinations
  const destinationSliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: !isMobile,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  // Slider settings for flights
  const flightSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: !isMobile,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <div className="font-sans antialiased overflow-x-hidden">
      <Header />

      {/* ================= HERO SECTION WITH SLIDER ================= */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Images with Zoom Effect */}
            <div className="absolute inset-0">
              {/* Desktop Image */}
              <img
                src={slide.desktopUrl}
                alt={slide.alt}
                className={`hidden md:block w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                  index === currentIndex ? "scale-110" : "scale-100"
                }`}
              />
              {/* Mobile Image */}
              <img
                src={slide.mobileUrl}
                alt={slide.alt}
                className={`block md:hidden w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                  index === currentIndex ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            {/* Gradient Overlay - Different for mobile and desktop */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent"></div>

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-center justify-center md:justify-start z-20">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto md:mx-0 md:max-w-2xl lg:max-w-3xl text-center md:text-left">
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-2xl animate-fadeInUp">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto md:mx-0 drop-shadow-xl animate-fadeInUp animation-delay-200">
                    {slide.subtitle}
                  </p>

                  <button
                    type="submit"
                    onClick={() => navigate("/user/flights")}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Search Flights
                  </button>

                  {/* Trust Badges - Hidden on mobile */}
                  <div className="hidden md:flex items-center gap-6 mt-8 text-white/80 text-sm animate-fadeInUp animation-delay-600 ml-35">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>500+ Daily Flights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Best Price Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-md px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full border border-white/20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-white ${
                  index === currentIndex
                    ? "w-8 sm:w-10 md:w-12 h-2 sm:h-2.5 bg-white"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator - Desktop only */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 hidden md:block animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR DESTINATIONS SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Popular Destinations
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Most loved destinations around the world
            </p>
          </div>

          <Slider {...destinationSliderSettings}>
            {popularDestinations.map((destination) => (
              <div key={destination.id} className="px-2 sm:px-3">
                <div
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() =>
                    navigate(`/user/flights?destination=${destination.city}`)
                  }
                >
                  <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.city}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {destination.city}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      {destination.country}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                      {destination.description}
                    </p>

                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {destination.attractions
                        .slice(0, 2)
                        .map((attraction, idx) => (
                          <span
                            key={idx}
                            className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 truncate max-w-[100px] sm:max-w-none"
                          >
                            {attraction}
                          </span>
                        ))}
                      {destination.attractions.length > 2 && (
                        <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          +{destination.attractions.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">
                        {destination.price}
                      </span>
                      <span className="text-blue-600 hover:text-blue-700 transition-colors group text-xs sm:text-sm">
                        View Deals
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      {/* ================= UPCOMING FLIGHTS SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Upcoming Flights
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Book your next adventure with our best deals
            </p>
          </div>

          <Slider {...flightSliderSettings}>
            {upcomingFlights.map((flight) => (
              <div key={flight.id} className="px-2 sm:px-3">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                  {/* Flight Header */}
                  <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-gray-100">
                    <img
                      src={flight.logo}
                      alt={flight.airline}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {flight.airline}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {flight.flightNumber}
                      </p>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 whitespace-nowrap">
                      {flight.stops}
                    </span>
                  </div>

                  {/* Flight Route */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <div className="text-center w-full sm:w-auto">
                      <span className="block font-semibold text-gray-900 text-sm sm:text-base">
                        {flight.departure}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">
                        {flight.from}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center w-full sm:w-auto px-2 sm:px-4">
                      <div className="w-full h-0.5 bg-gradient-to-r from-gray-200 via-blue-500 to-gray-200"></div>
                      <span className="text-xs text-gray-500 mt-1">
                        {flight.duration}
                      </span>
                    </div>
                    <div className="text-center w-full sm:w-auto">
                      <span className="block font-semibold text-gray-900 text-sm sm:text-base">
                        {flight.arrival}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">
                        {flight.to}
                      </span>
                    </div>
                  </div>

                  {/* Flight Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-3 sm:gap-0">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      {flight.price}
                    </span>
                    <button
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:translate-x-1 text-sm sm:text-base"
                      onClick={() => handleBooking(flight.id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {upcomingFlights.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">
                No flights found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
              <div className="text-sm sm:text-base opacity-90">
                Daily Flights
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold mb-2">100+</div>
              <div className="text-sm sm:text-base opacity-90">
                Destinations
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold mb-2">50M+</div>
              <div className="text-sm sm:text-base opacity-90">
                Happy Customers
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm sm:text-base opacity-90">Support</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
