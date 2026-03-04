import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./LandingPage.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    {
      url: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=2070&q=80",
      alt: "Passenger airplane taking off",
    },
    {
      url: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=2070&q=80",
      alt: "Jet airplane in clear sky",
    },
  ];

  // Popular Destinations Data with Rupees
  const popularDestinations = [
    {
      id: 1,
      city: "Paris",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
      price: "₹24,999",
      description: "City of Love & Lights",
    },
    {
      id: 2,
      city: "Tokyo",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      price: "₹36,999",
      description: "Tradition meets Future",
    },
    {
      id: 3,
      city: "New York",
      country: "USA",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "₹18,999",
      description: "The Big Apple",
    },
    {
      id: 4,
      city: "Dubai",
      country: "UAE",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "₹32,999",
      description: "Luxury & Innovation",
    },
    {
      id: 5,
      city: "Rome",
      country: "Italy",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2096&q=80",
      price: "₹22,999",
      description: "Eternal City",
    },
    {
      id: 6,
      city: "Delhi",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2070&q=80",
      price: "₹9,999",
      description: "Heart of India",
    },
    {
      id: 7,
      city: "London",
      country: "UK",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "₹21,999",
      description: "Royal Heritage",
    },
    {
      id: 8,
      city: "Sydney",
      country: "Australia",
      image:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      price: "₹48,999",
      description: "Harbor City",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // const handlePrevDestination = () => {
  //   if (isAnimating || visibleStartIndex === 0) return;
  //   setIsAnimating(true);
  //   setVisibleStartIndex((prev) => prev - 1);
  //   setTimeout(() => setIsAnimating(false), 500);
  // };

  // const handleNextDestination = () => {
  //   if (isAnimating || visibleStartIndex >= popularDestinations.length - 4)
  //     return;
  //   setIsAnimating(true);
  //   setVisibleStartIndex((prev) => prev + 1);
  //   setTimeout(() => setIsAnimating(false), 500);
  // };

  // const visibleDestinations = popularDestinations.slice(
  //   visibleStartIndex,
  //   visibleStartIndex + 4,
  // );
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        },
      },
    ],
  };
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

            <button
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:scale-105 transition duration-300 text-white font-semibold px-8 py-3 rounded-full shadow-xl"
              onClick={() => navigate("/user/flights")}
            >
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
        </section>

        {/* ================= POPULAR DESTINATIONS SECTION ================= */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              Popular Destinations
            </h2>

            <Slider {...settings}>
              {popularDestinations.map((destination) => (
                <div key={destination.id} className="px-3">
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                    onClick={() =>
                      navigate(`/user/flights?destination=${destination.city}`)
                    }
                  >
                    <img
                      src={destination.image}
                      alt={destination.city}
                      className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold">{destination.city}</h3>
                      <p className="text-sm mb-2">{destination.country}</p>
                      <span className="bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-1 rounded-full text-sm font-semibold">
                        {destination.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
        <Footer />
      </div>

      {/* Add animation styles */}
      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style> */}
    </>
  );
};

export default LandingPage;
