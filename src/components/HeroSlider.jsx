import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
    title: "Discover the World",
    subtitle: "Premium travel experiences to over 200 destinations",
  },
  {
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1920&q=80",
    title: "Fly in Comfort",
    subtitle: "Award-winning service and world-class amenities",
  },
  {
    image: "https://images.unsplash.com/photo-1507812984078-917a274065be?w=1920&q=80",
    title: "Business Excellence",
    subtitle: "Elevate your corporate travel experience",
  },
  {
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80",
    title: "Paradise Awaits",
    subtitle: "Escape to breathtaking tropical destinations",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/40 to-[#0a1628]/90" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="overflow-hidden">
          <h1
            className={`font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl transition-all duration-700 ${
              isTransitioning
                ? "translate-y-full opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {slides[currentSlide].title}
          </h1>
        </div>
        <div className="mt-4 overflow-hidden">
          <p
            className={`text-lg text-white/80 md:text-xl lg:text-2xl transition-all duration-700 delay-100 ${
              isTransitioning
                ? "translate-y-full opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={`mt-10 flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-200 ${
            isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
          }`}
        >
          <button className="group relative overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]">
            <span className="relative z-10">Book Your Flight</span>
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
          </button>
          <button className="rounded-full border-2 border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10">
            Explore Destinations
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:left-8 md:p-4"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:right-8 md:p-4"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 700);
              }
            }}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-background/50 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-background/50 to-transparent" />
    </div>
  );
}
