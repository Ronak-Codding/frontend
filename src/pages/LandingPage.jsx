import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./LandingPage.css";

const LandingPage = () => {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  //  Auto Slide Every 6 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
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

            <button className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:scale-105 transition duration-300 text-white font-semibold px-8 py-3 rounded-full shadow-xl">
              Explore Flights
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
          {/* Left/Right Navigation Arrows (optional, can be hidden on mobile) */}
          <button
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
          </button>
        </section>

        {/* ================= FEATURE SECTION ================= */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12 text-gray-800">
              Why Fly With SkyJet?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="text-5xl mb-4">✈️</div>
                <h3 className="text-xl font-semibold mb-2">Global Network</h3>
                <p className="text-gray-600">
                  Over 200+ destinations worldwide with seamless connections.
                </p>
              </div>

              <div>
                <div className="text-5xl mb-4">🛄</div>
                <h3 className="text-xl font-semibold mb-2">Extra Comfort</h3>
                <p className="text-gray-600">
                  Spacious seating, gourmet meals & premium entertainment.
                </p>
              </div>

              <div>
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold mb-2">
                  Best Price Guarantee
                </h3>
                <p className="text-gray-600">
                  Flexible booking & unbeatable fares every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
