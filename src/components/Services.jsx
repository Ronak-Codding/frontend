import { useState, useEffect, useRef } from "react";
import "./Services.css";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";

const services = [
  {
    id: 1,
    icon: "✈️",
    title: "Flight Booking",
    subtitle: "Domestic & International",
    description:
      "Book flights to over 150+ destinations worldwide. Enjoy competitive fares, flexible date options, and seamless checkout with instant e-ticket delivery.",
    features: [
      "150+ Destinations",
      "Best Price Guarantee",
      "Instant E-Ticket",
      "Multi-city Routing",
    ],
    color: "#C9A84C",
    bg: "linear-gradient(135deg,#0a1628 0%,#0d1f3c 100%)",
  },
  {
    id: 2,
    icon: "🧳",
    title: "Baggage Services",
    subtitle: "Flexible Allowance Plans",
    description:
      "Pre-purchase extra baggage, manage your allowance, and track your luggage in real-time from check-in to carousel delivery.",
    features: [
      "Pre-purchase Baggage",
      "Real-time Tracking",
      "Special Items",
      "Lost Bag Assistance",
    ],
    color: "#6EC6E6",
    bg: "linear-gradient(135deg,#061525 0%,#0a2035 100%)",
  },
  {
    id: 3,
    icon: "🪑",
    title: "Seat Selection",
    subtitle: "Choose Your Perfect Spot",
    description:
      "Pick your preferred seat with our interactive cabin map. Select window, aisle, extra legroom, or premium upgrade seats ahead of time.",
    features: [
      "Interactive Seat Map",
      "Extra Legroom",
      "Premium Upgrade",
      "Group Seating",
    ],
    color: "#C9A84C",
    bg: "linear-gradient(135deg,#0a1628 0%,#0d1f3c 100%)",
  },
  {
    id: 4,
    icon: "🍽️",
    title: "In-Flight Meals",
    subtitle: "Curated Dining Experience",
    description:
      "Pre-order gourmet meals tailored to your dietary preferences. From vegan and kosher to regional specialties crafted by partner chefs.",
    features: [
      "20+ Meal Options",
      "Dietary Accommodations",
      "Pre-order Available",
      "Premium Menus",
    ],
    color: "#6EC6E6",
    bg: "linear-gradient(135deg,#061525 0%,#0a2035 100%)",
  },
  {
    id: 5,
    icon: "🌐",
    title: "Online Check-In",
    subtitle: "Skip the Queue",
    description:
      "Check in online from 48 hours to 1 hour before departure. Download your mobile boarding pass and head straight to the gate.",
    features: [
      "48hr Early Check-in",
      "Mobile Boarding Pass",
      "Family Check-in",
      "Seat Upgrade",
    ],
    color: "#C9A84C",
    bg: "linear-gradient(135deg,#0a1628 0%,#0d1f3c 100%)",
  },
  {
    id: 6,
    icon: "🏆",
    title: "Loyalty Rewards",
    subtitle: "Earn Miles, Fly Free",
    description:
      "Join SkyRewards and earn miles on every flight. Unlock elite tiers for lounge access, priority boarding, and exclusive perks worldwide.",
    features: [
      "Miles on Every Flight",
      "4 Elite Tiers",
      "Lounge Access",
      "Partner Benefits",
    ],
    color: "#6EC6E6",
    bg: "linear-gradient(135deg,#061525 0%,#0a2035 100%)",
  },
];

const stats = [
  { value: "150+", label: "Destinations" },
  { value: "2M+", label: "Happy Travelers" },
  { value: "99.2%", label: "On-time Rate" },
  { value: "24/7", label: "Customer Support" },
];

const destinations = [
  {
    city: "Dubai",
    country: "UAE",
    emoji: "🇦🇪",
    price: "₹28,500",
    tag: "Popular",
    color: "#C9A84C",
  },
  {
    city: "Paris",
    country: "France",
    emoji: "🇫🇷",
    price: "₹52,000",
    tag: "Trending",
    color: "#6EC6E6",
  },
  {
    city: "Singapore",
    country: "Singapore",
    emoji: "🇸🇬",
    price: "₹18,200",
    tag: "Best Deal",
    color: "#a78bfa",
  },
  {
    city: "Tokyo",
    country: "Japan",
    emoji: "🇯🇵",
    price: "₹41,000",
    tag: "Popular",
    color: "#C9A84C",
  },
  {
    city: "New York",
    country: "USA",
    emoji: "🇺🇸",
    price: "₹68,000",
    tag: "Premium",
    color: "#6EC6E6",
  },
  {
    city: "Bali",
    country: "Indonesia",
    emoji: "🇮🇩",
    price: "₹14,900",
    tag: "Best Deal",
    color: "#a78bfa",
  },
  {
    city: "London",
    country: "UK",
    emoji: "🇬🇧",
    price: "₹55,000",
    tag: "Trending",
    color: "#C9A84C",
  },
  {
    city: "Maldives",
    country: "Maldives",
    emoji: "🇲🇻",
    price: "₹22,000",
    tag: "Luxury",
    color: "#6EC6E6",
  },
];

const deals = [
  {
    title: "Early Bird Special",
    disc: "30% OFF",
    desc: "Book 60+ days ahead and save big on all international routes.",
    validity: "Valid till Apr 30",
    code: "EARLY30",
    color: "#C9A84C",
  },
  {
    title: "Weekend Getaway",
    disc: "20% OFF",
    desc: "Fly out Friday evening, return Sunday. Perfect micro-vacations.",
    validity: "Every Weekend",
    code: "WKND20",
    color: "#6EC6E6",
  },
  {
    title: "Student Fare",
    disc: "25% OFF",
    desc: "Exclusive discounts for students with valid ID on all routes.",
    validity: "Year Round",
    code: "STUDY25",
    color: "#a78bfa",
  },
  {
    title: "Business Class Deal",
    disc: "15% OFF",
    desc: "Upgrade to Business Class for less. Limited seats per flight.",
    validity: "Valid till Mar 31",
    code: "BIZ15",
    color: "#C9A84C",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Frequent Flyer · Gold Member",
    avatar: "PS",
    stars: 5,
    text: "SkyArc completely transformed my travel experience. The seamless online check-in, premium seat selection and the loyalty rewards made every trip feel first class. Highly recommend!",
  },
  {
    name: "Rahul Mehta",
    role: "Business Traveler",
    avatar: "RM",
    stars: 5,
    text: "I travel twice a month for work and SkyArc is my go-to airline. The app is flawless, customer support is lightning fast, and the Business Class deal saved me a fortune this quarter.",
  },
  {
    name: "Amelia Johnson",
    role: "Solo Traveler",
    avatar: "AJ",
    stars: 5,
    text: "Booked a last-minute trip to Bali and SkyArc had the best prices with incredible service. The in-flight meal I pre-ordered was genuinely delicious. Will fly with them again!",
  },
  {
    name: "Vikram Singh",
    role: "Family Travel Enthusiast",
    avatar: "VS",
    stars: 4,
    text: "Traveling with three kids used to be a nightmare. SkyArc's family check-in and group seating made it so smooth. The baggage tracking feature gave us peace of mind throughout.",
  },
];

const faqs = [
  {
    q: "How early can I check in online?",
    a: "Online check-in opens 48 hours before your scheduled departure and closes 1 hour before. You can download your mobile boarding pass directly from the SkyArc app or website after completing check-in.",
  },
  {
    q: "What is the free baggage allowance?",
    a: "Economy class passengers are entitled to 23 kg checked baggage plus 7 kg cabin baggage. Business Class passengers receive 32 kg checked baggage. Additional baggage can be pre-purchased at discounted rates.",
  },
  {
    q: "How do I earn and redeem SkyRewards miles?",
    a: "Miles are earned on every SkyArc flight based on distance and fare class. You can redeem miles for free flights, seat upgrades, lounge access, and partner benefits. 1 mile = approximately ₹0.50 in value.",
  },
  {
    q: "Can I change or cancel my booking?",
    a: "Yes. Flexible and Premium fare tickets can be changed or cancelled free of charge up to 24 hours before departure. Economy Light fares have a nominal change fee. Full details are available on your booking confirmation.",
  },
  {
    q: "Do you offer special assistance for passengers?",
    a: "Absolutely. We provide wheelchair assistance, pre-boarding priority, special meals (diabetic, vegan, kosher, etc.), and unaccompanied minor services. Please request special assistance at least 48 hours before departure.",
  },
  {
    q: "How does the seat upgrade process work?",
    a: "You can upgrade your seat during booking, online check-in, or at the airport (subject to availability). SkyRewards members can use miles for upgrades. Business Class upgrades are also available via our bid-upgrade system.",
  },
];

export default function Services() {
  const [activeCard, setActiveCard] = useState(null);
  const [visible, setVisible] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tripType, setTripType] = useState("one-way");
  const [openFaq, setOpenFaq] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      from: "bot",
      text: "Hello! 👋 Welcome to SkyArc support. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const t = setInterval(
      () => setActiveTestimonial((p) => (p + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((m) => [...m, { from: "user", text: userMsg }]);
    setChatInput("");
    const replies = [
      "Great question! Our team will assist you shortly. In the meantime, check our FAQ section below.",
      "I can help with that! For booking changes, please log in to your account or call 1800-SKY-ARC.",
      "Thanks for reaching out! A support agent will connect within 2 minutes.",
      "For flight status updates, visit skyarc.com/status or track via our mobile app.",
    ];
    setTimeout(
      () =>
        setChatMessages((m) => [
          ...m,
          {
            from: "bot",
            text: replies[Math.floor(Math.random() * replies.length)],
          },
        ]),
      1200,
    );
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={S.root}>

      <Navbar />

     <Breadcrumb title="Our Services" />

      {/* ══ FEATURE 1: FLIGHT SEARCH FORM ══ */}
      {/* <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(180deg,#060e1e,#071220)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={S.secHead}>
            <p style={S.eyebrow}>Search & Book</p>
            <h2 style={S.secTitle}>
              Find Your <span className="gold-shimmer">Perfect Flight</span>
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 28,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["one-way", "round-trip", "multi-city"].map((t) => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 24,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "capitalize",
                  border:
                    tripType === t ? "none" : "1px solid rgba(255,255,255,.15)",
                  background:
                    tripType === t
                      ? "linear-gradient(135deg,#C9A84C,#e8c76a)"
                      : "transparent",
                  color: tripType === t ? "#060e1e" : "#8fa0b8",
                  transition: "all .3s",
                }}
              >
                {t.replace("-", " ")}
              </button>
            ))}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.09)",
              borderRadius: 20,
              padding: "32px 28px",
            }}
          >
            <div
              className="s-row"
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {[
                { label: "From", placeholder: "Delhi (DEL)", icon: "📍" },
                { label: "To", placeholder: "Dubai (DXB)", icon: "📍" },
                {
                  label: "Departure",
                  placeholder: "Select Date",
                  icon: "📅",
                  type: "date",
                },
                ...(tripType === "round-trip"
                  ? [
                      {
                        label: "Return",
                        placeholder: "Select Date",
                        icon: "📅",
                        type: "date",
                      },
                    ]
                  : []),
              ].map((f, i) => (
                <div key={i} style={{ flex: "1 1 150px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "#C9A84C",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {f.icon} {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,.06)",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      color: "#e8edf3",
                      fontSize: "0.9rem",
                      colorScheme: "dark",
                    }}
                  />
                </div>
              ))}
              <div style={{ flex: "1 1 120px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "#C9A84C",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  👤 Travelers
                </label>
                <select
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#e8edf3",
                    fontSize: "0.9rem",
                  }}
                >
                  {[
                    "1 Adult",
                    "2 Adults",
                    "3 Adults",
                    "2 Adults + 1 Child",
                    "Family (4+)",
                  ].map((o) => (
                    <option key={o} style={{ background: "#0d1f3c" }}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "#C9A84C",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  💺 Class
                </label>
                <select
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#e8edf3",
                    fontSize: "0.9rem",
                  }}
                >
                  {[
                    "Economy",
                    "Premium Economy",
                    "Business",
                    "First Class",
                  ].map((o) => (
                    <option key={o} style={{ background: "#0d1f3c" }}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                className="cta-btn"
                style={{
                  ...S.secondaryBtn,
                  padding: "12px 28px",
                  fontSize: "0.88rem",
                }}
              >
                + Add Promo Code
              </button>
              <button
                className="cta-btn"
                style={{
                  ...S.primaryBtn,
                  padding: "14px 44px",
                  borderRadius: 10,
                }}
              >
                Search Flights
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* ══ SERVICES GRID ══ */}
      <section style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={S.secHead}>
            <p style={S.eyebrow}>What We Offer</p>
            <h2 style={S.secTitle}>
              Our <span className="gold-shimmer">Services</span>
            </h2>
            <p style={S.secDesc}>
              Every service is designed with precision to ensure your travel
              experience is nothing short of extraordinary.
            </p>
          </div>
          <div
            className="grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {services.map((svc, idx) => (
              <div
                key={svc.id}
                className="service-card"
                style={{
                  borderRadius: 16,
                  padding: "36px 28px",
                  position: "relative",
                  overflow: "hidden",
                  background: svc.bg,
                  border:
                    activeCard === svc.id
                      ? `1px solid ${svc.color}`
                      : "1px solid rgba(255,255,255,.07)",
                  animation: visible ? "fadeInUp .7s ease both" : "none",
                  animationDelay: `${0.1 * idx}s`,
                }}
                onMouseEnter={() => setActiveCard(svc.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: svc.color,
                    borderRadius: "16px 16px 0 0",
                  }}
                />
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    border: `1px solid ${svc.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    background: "rgba(255,255,255,.04)",
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{svc.icon}</span>
                </div>
                <p
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    color: svc.color,
                  }}
                >
                  {svc.subtitle}
                </p>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 14,
                  }}
                >
                  {svc.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "#7a93ad",
                    lineHeight: 1.75,
                    marginBottom: 20,
                    fontWeight: 300,
                  }}
                >
                  {svc.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  {svc.features.map((f) => (
                    <span
                      key={f}
                      className="feat-tag"
                      style={{
                        fontSize: "0.72rem",
                        color: "#8fa0b8",
                        background: "rgba(255,255,255,.05)",
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: 20,
                        padding: "4px 12px",
                        fontWeight: 500,
                      }}
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
                <button
                  className="cta-btn"
                  style={{
                    background: "transparent",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: svc.color,
                    color: svc.color,
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    width: "100%",
                  }}
                >
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE 2: DESTINATION GALLERY ══ */}
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(180deg,#060e1e,#071525)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={S.secHead}>
            <p style={S.eyebrow}>Explore the World</p>
            <h2 style={S.secTitle}>
              Top <span className="gold-shimmer">Destinations</span>
            </h2>
            <p style={S.secDesc}>
              Hand-picked destinations with the best fares. Your next adventure
              is one click away.
            </p>
          </div>
          <div
            className="grid-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 20,
            }}
          >
            {destinations.map((d, i) => (
              <div
                key={i}
                className="dest-card"
                style={{
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#0a1628,#0d1f3c)",
                  border: "1px solid rgba(255,255,255,.07)",
                  padding: "28px 22px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: d.color,
                    borderRadius: "16px 16px 0 0",
                  }}
                />
                <div
                  style={{
                    fontSize: "2.8rem",
                    marginBottom: 12,
                    lineHeight: 1,
                  }}
                >
                  {d.emoji}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                    gap: 8,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {d.city}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 9px",
                      borderRadius: 12,
                      background: `${d.color}22`,
                      color: d.color,
                      border: `1px solid ${d.color}44`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.tag}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#6e8aa0",
                    marginBottom: 16,
                  }}
                >
                  {d.country}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        color: "#6e8aa0",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      From
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: d.color,
                      }}
                    >
                      {d.price}
                    </p>
                  </div>
                  <button
                    className="cta-btn"
                    style={{
                      background: d.color,
                      color: "#060e1e",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Book →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="cta-btn" style={S.secondaryBtn}>
              View All 150+ Destinations →
            </button>
          </div>
        </div>
      </section>

      {/* ══ FEATURE 3: SPECIAL DEALS ══ */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={S.secHead}>
            <p style={S.eyebrow}>Limited Time Offers</p>
            <h2 style={S.secTitle}>
              Special <span className="gold-shimmer">Deals</span>
            </h2>
            <p style={S.secDesc}>
              Grab these exclusive deals before they expire. Use the promo code
              at checkout.
            </p>
          </div>
          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 24,
            }}
          >
            {deals.map((d, i) => (
              <div
                key={i}
                className="deal-card"
                style={{
                  background: "linear-gradient(135deg,#0a1628,#0d1f3c)",
                  border: `1px solid ${d.color}33`,
                  borderRadius: 18,
                  padding: "32px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: `radial-gradient(circle,${d.color}11,transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 14px",
                        borderRadius: 20,
                        background: `${d.color}22`,
                        color: d.color,
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        fontFamily: "'Cormorant Garamond',serif",
                        marginBottom: 12,
                        border: `1px solid ${d.color}44`,
                      }}
                    >
                      {d.disc}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 8,
                      }}
                    >
                      {d.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "#7a93ad",
                        lineHeight: 1.7,
                        marginBottom: 14,
                      }}
                    >
                      {d.desc}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#6e8aa0",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      ⏰ {d.validity}
                    </p>
                  </div>
                  <div style={{ textAlign: "center", minWidth: 120 }}>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        color: "#6e8aa0",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Promo Code
                    </p>
                    <div
                      style={{
                        background: "rgba(0,0,0,.3)",
                        border: `1px dashed ${d.color}66`,
                        borderRadius: 10,
                        padding: "10px 16px",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: d.color,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {d.code}
                      </span>
                    </div>
                    <button
                      onClick={() => copyCode(d.code)}
                      className="cta-btn"
                      style={{
                        background: copiedCode === d.code ? "#22c55e" : d.color,
                        color: "#060e1e",
                        border: "none",
                        borderRadius: 8,
                        padding: "9px 18px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        width: "100%",
                        transition: "background .3s",
                      }}
                    >
                      {copiedCode === d.code ? "✓ Copied!" : "Copy Code"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE 4: TESTIMONIALS ══ */}
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(180deg,#060e1e,#071525)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={S.secHead}>
            <p style={S.eyebrow}>Traveler Stories</p>
            <h2 style={S.secTitle}>
              What Our <span className="gold-shimmer">Guests Say</span>
            </h2>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(201,168,76,.18)",
              borderRadius: 20,
              padding: "40px 36px",
              marginBottom: 28,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg,#C9A84C,#6EC6E6)",
              }}
            />
            <div
              style={{
                fontSize: "3rem",
                color: "#C9A84C",
                lineHeight: 1,
                marginBottom: 16,
                opacity: 0.4,
              }}
            >
              "
            </div>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#c8d8e8",
                lineHeight: 1.8,
                marginBottom: 28,
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              {testimonials[activeTestimonial].text}
            </p>
            <div
              className="testi-inner"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#C9A84C,#6EC6E6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#060e1e",
                    flexShrink: 0,
                  }}
                >
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#fff",
                      fontSize: "0.95rem",
                    }}
                  >
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6e8aa0" }}>
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {Array(testimonials[activeTestimonial].stars)
                  .fill("★")
                  .map((_, i) => (
                    <span
                      key={i}
                      style={{ color: "#C9A84C", fontSize: "1.1rem" }}
                    >
                      ★
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {testimonials.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: i === activeTestimonial ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i === activeTestimonial
                      ? "#C9A84C"
                      : "rgba(255,255,255,.2)",
                  transition: "all .4s",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 16,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  padding: "18px 20px",
                  borderRadius: 14,
                  cursor: "pointer",
                  background:
                    i === activeTestimonial
                      ? "rgba(201,168,76,.1)"
                      : "rgba(255,255,255,.03)",
                  border: `1px solid ${i === activeTestimonial ? "rgba(201,168,76,.4)" : "rgba(255,255,255,.06)"}`,
                  transition: "all .3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#C9A84C,#6EC6E6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#060e1e",
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: "#e8edf3",
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "#6e8aa0" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#7a93ad",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE 5: FAQ ACCORDION ══ */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={S.secHead}>
            <p style={S.eyebrow}>Got Questions?</p>
            <h2 style={S.secTitle}>
              Frequently <span className="gold-shimmer">Asked</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                className="faq-item"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1px solid ${openFaq === i ? "rgba(201,168,76,.4)" : "rgba(255,255,255,.08)"}`,
                  background:
                    openFaq === i
                      ? "rgba(201,168,76,.06)"
                      : "rgba(255,255,255,.03)",
                  transition: "all .3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    gap: 16,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: openFaq === i ? "#C9A84C" : "#e8edf3",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {f.q}
                  </p>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "1.3rem",
                      color: openFaq === i ? "#C9A84C" : "#6e8aa0",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform .3s,color .3s",
                    }}
                  >
                    +
                  </div>
                </div>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 24px 22px",
                      animation: "fadeIn .3s ease",
                    }}
                  >
                    <div
                      style={{
                        height: 1,
                        background: "rgba(255,255,255,.08)",
                        marginBottom: 18,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "#7a93ad",
                        lineHeight: 1.8,
                        fontWeight: 300,
                      }}
                    >
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE 6: NEWSLETTER ══ */}
      <section
        style={{
          padding: "60px 24px",
          background: "rgba(201,168,76,.04)",
          borderTop: "1px solid rgba(201,168,76,.12)",
          borderBottom: "1px solid rgba(201,168,76,.12)",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: 8 }}>✉️</p>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(1.6rem,4vw,2.2rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            Get <span className="gold-shimmer">Exclusive</span> Flight Deals
          </h3>
          <p
            style={{
              color: "#6e8aa0",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              marginBottom: 28,
              fontWeight: 300,
            }}
          >
            Subscribe to our newsletter and be the first to know about flash
            sales, new routes, and special offers. No spam, ever.
          </p>
          {subscribed ? (
            <div
              style={{
                padding: "18px 32px",
                borderRadius: 14,
                background: "rgba(34,197,94,.12)",
                border: "1px solid rgba(34,197,94,.3)",
                color: "#22c55e",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              🎉 You're subscribed! Watch your inbox for exclusive deals.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 12,
                maxWidth: 480,
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  color: "#e8edf3",
                  fontSize: "0.9rem",
                }}
              />
              <button
                className="cta-btn"
                onClick={() => newsletter.includes("@") && setSubscribed(true)}
                style={{
                  ...S.primaryBtn,
                  padding: "14px 28px",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe →
              </button>
            </div>
          )}
          <p style={{ fontSize: "0.72rem", color: "#3d5166", marginTop: 14 }}>
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </section>

    <Footer />

      {/* ══ FEATURE 7: LIVE CHAT WIDGET ══ */}
      <button
        className="chat-fab"
        onClick={() => setChatOpen((p) => !p)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#C9A84C,#e8c76a)",
          border: "none",
          cursor: "pointer",
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 2.5s ease-in-out infinite",
          transition: "transform .3s",
          boxShadow: "0 8px 32px rgba(201,168,76,.45)",
        }}
      >
        {chatOpen ? "✕" : "💬"}
      </button>

      {chatOpen && (
        <div
          className="chat-panel"
          style={{
            position: "fixed",
            bottom: 100,
            right: 28,
            zIndex: 9998,
            width: 340,
            maxHeight: 480,
            background: "#0d1f3c",
            border: "1px solid rgba(201,168,76,.25)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,.7)",
            animation: "chatPop .3s cubic-bezier(.23,1,.32,1) both",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              background: "linear-gradient(135deg,#C9A84C,#e8c76a)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
            >
              ✈
            </div>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#060e1e",
                  fontSize: "0.9rem",
                }}
              >
                SkyArc Support
              </p>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(6,14,30,.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                Online — Typically replies instantly
              </p>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 280,
            }}
          >
            {chatMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius:
                      m.from === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg,#C9A84C,#e8c76a)"
                        : "rgba(255,255,255,.07)",
                    color: m.from === "user" ? "#060e1e" : "#e8edf3",
                    fontSize: "0.82rem",
                    lineHeight: 1.55,
                    border:
                      m.from === "bot"
                        ? "1px solid rgba(255,255,255,.08)"
                        : "none",
                    fontWeight: m.from === "user" ? 500 : 400,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              borderTop: "1px solid rgba(255,255,255,.06)",
            }}
          >
            {["Track flight", "Baggage info", "Change booking"].map((s) => (
              <button
                key={s}
                onClick={() => setChatInput(s)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 14,
                  fontSize: "0.7rem",
                  background: "rgba(201,168,76,.12)",
                  border: "1px solid rgba(201,168,76,.25)",
                  color: "#C9A84C",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid rgba(255,255,255,.08)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Type your message…"
              style={{
                flex: 1,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#e8edf3",
                fontSize: "0.83rem",
              }}
            />
            <button
              onClick={sendChat}
              className="cta-btn"
              style={{
                background: "linear-gradient(135deg,#C9A84C,#e8c76a)",
                border: "none",
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "1rem",
                color: "#060e1e",
                fontWeight: 700,
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  root: {
    fontFamily: "'DM Sans',sans-serif",
    background: "#060e1e",
    color: "#e8edf3",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: "0 24px",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 72,
  },
  navBtn: {
    background: "linear-gradient(135deg,#C9A84C,#e8c76a)",
    color: "#060e1e",
    border: "none",
    borderRadius: 6,
    padding: "10px 26px",
    fontSize: "0.88rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
  },
  primaryBtn: {
    background: "linear-gradient(135deg,#C9A84C,#e8c76a)",
    color: "#060e1e",
    border: "none",
    borderRadius: 8,
    padding: "14px 36px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "'DM Sans',sans-serif",
  },
  secondaryBtn: {
    background: "transparent",
    color: "#C9A84C",
    border: "1px solid rgba(201,168,76,.4)",
    borderRadius: 8,
    padding: "14px 36px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
  },
  secHead: { textAlign: "center", marginBottom: 60 },
  eyebrow: {
    color: "#6EC6E6",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  secTitle: {
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "clamp(2.2rem,5vw,3.2rem)",
    fontWeight: 700,
    color: "#fff",
    marginBottom: 16,
    lineHeight: 1.1,
  },
  secDesc: {
    fontSize: "1rem",
    color: "#6e8aa0",
    lineHeight: 1.8,
    maxWidth: 540,
    margin: "0 auto",
    fontWeight: 300,
  },
};
