import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Frequent Flyer · Gold Member",
    avatar: "PS",
    stars: 5,
    text: "SkyJet completely transformed my travel experience. The seamless online check-in, premium seat selection and the loyalty rewards made every trip feel first class. Highly recommend!",
  },
  {
    name: "Rahul Mehta",
    role: "Business Traveler",
    avatar: "RM",
    stars: 5,
    text: "I travel twice a month for work and SkyJet is my go-to airline. The app is flawless, customer support is lightning fast, and the Business Class deal saved me a fortune this quarter.",
  },
  {
    name: "Amelia Johnson",
    role: "Solo Traveler",
    avatar: "AJ",
    stars: 5,
    text: "Booked a last-minute trip to Bali and SkyJet had the best prices with incredible service. The in-flight meal I pre-ordered was genuinely delicious. Will fly with them again!",
  },
  {
    name: "Vikram Singh",
    role: "Family Travel Enthusiast",
    avatar: "VS",
    stars: 4,
    text: "Traveling with three kids used to be a nightmare. SkyJet's family check-in and group seating made it so smooth. The baggage tracking feature gave us peace of mind throughout.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-background px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Traveler Stories
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            What Our <span className="text-primary">Guests Say</span>
          </h2>
        </div>

        {/* Active Testimonial Card */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-card/80 p-8 backdrop-blur-xl shadow-xl">
          {/* Top gradient bar */}
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-primary to-blue-400" />

          {/* Quote */}
          <div className="mb-4 text-5xl leading-none text-primary opacity-40">
            "
          </div>

          <p className="mb-8 text-base italic leading-relaxed text-muted-foreground md:text-lg">
            {testimonials[active].text}
          </p>

          <div className="flex items-center justify-between gap-4">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-sm font-bold text-background">
                {testimonials[active].avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonials[active].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonials[active].role}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1">
              {Array(testimonials[active].stars)
                .fill("★")
                .map((_, i) => (
                  <span key={i} className="text-lg text-primary">
                    ★
                  </span>
                ))}
              {Array(5 - testimonials[active].stars)
                .fill("★")
                .map((_, i) => (
                  <span key={i} className="text-lg text-muted-foreground/30">
                    ★
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mb-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/50"
              }`}
            />
          ))}
        </div>

        {/* Testimonial Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-xl border p-5 text-left transition-all duration-300 ${
                i === active
                  ? "border-primary/40 bg-primary/10"
                  : "border-border/30 bg-card/50 hover:border-primary/20 hover:bg-card/80"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-xs font-bold text-background">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                "{t.text}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
