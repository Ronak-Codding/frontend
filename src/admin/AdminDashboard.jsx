import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  Plane,
  MapPin,
  Calendar,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Star,
  Award,
  TrendingUp,
  DollarSign,
  BarChart2,
  Globe,
  IndianRupee,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AdminTables.css";
import "./AdminDashboard.css";

// ─── Data ───────────────────────────────────────────────────────────
const revenueMonthly = [
  { month: "Jul", revenue: 4.2, bookings: 320 },
  { month: "Aug", revenue: 5.8, bookings: 415 },
  { month: "Sep", revenue: 5.1, bookings: 390 },
  { month: "Oct", revenue: 6.7, bookings: 480 },
  { month: "Nov", revenue: 7.3, bookings: 510 },
  { month: "Dec", revenue: 9.1, bookings: 620 },
  { month: "Jan", revenue: 7.8, bookings: 540 },
  { month: "Feb", revenue: 8.4, bookings: 580 },
  { month: "Mar", revenue: 10.2, bookings: 710 },
];
const revenueWeekly = [
  { month: "Mon", revenue: 1.1, bookings: 82 },
  { month: "Tue", revenue: 1.4, bookings: 105 },
  { month: "Wed", revenue: 0.9, bookings: 74 },
  { month: "Thu", revenue: 1.7, bookings: 128 },
  { month: "Fri", revenue: 2.3, bookings: 162 },
  { month: "Sat", revenue: 2.8, bookings: 195 },
  { month: "Sun", revenue: 2.1, bookings: 148 },
];
const bookingStatusData = [
  { name: "Confirmed", value: 48, color: "#22c55e" },
  { name: "Completed", value: 30, color: "#3b82f6" },
  { name: "Pending", value: 14, color: "#f59e0b" },
  { name: "Cancelled", value: 8, color: "#ef4444" },
];
const TOP_DESTINATIONS = [
  {
    city: "Dubai",
    code: "DXB",
    country: "UAE",
    flights: 1240,
    growth: 18.4,
    color: "#f59e0b",
    x: 58,
    y: 42,
  },
  {
    city: "London",
    code: "LHR",
    country: "UK",
    flights: 1105,
    growth: 12.1,
    color: "#3b82f6",
    x: 47,
    y: 28,
  },
  {
    city: "New York",
    code: "JFK",
    country: "USA",
    flights: 980,
    growth: 9.7,
    color: "#8b5cf6",
    x: 22,
    y: 35,
  },
  {
    city: "Tokyo",
    code: "HND",
    country: "Japan",
    flights: 870,
    growth: 14.2,
    color: "#ec4899",
    x: 81,
    y: 36,
  },
  {
    city: "Paris",
    code: "CDG",
    country: "France",
    flights: 760,
    growth: 7.5,
    color: "#06b6d4",
    x: 49,
    y: 30,
  },
  {
    city: "Sydney",
    code: "SYD",
    country: "Australia",
    flights: 650,
    growth: 11.3,
    color: "#10b981",
    x: 85,
    y: 72,
  },
  {
    city: "Singapore",
    code: "SIN",
    country: "Singapore",
    flights: 590,
    growth: 16.8,
    color: "#f97316",
    x: 77,
    y: 55,
  },
  {
    city: "Mumbai",
    code: "BOM",
    country: "India",
    flights: 520,
    growth: 8.9,
    color: "#a855f7",
    x: 65,
    y: 47,
  },
];
const ROUTES = [
  { from: { x: 22, y: 35 }, to: { x: 47, y: 28 }, active: true },
  { from: { x: 47, y: 28 }, to: { x: 58, y: 42 }, active: true },
  { from: { x: 58, y: 42 }, to: { x: 77, y: 55 }, active: true },
  { from: { x: 77, y: 55 }, to: { x: 81, y: 36 }, active: true },
  { from: { x: 81, y: 36 }, to: { x: 85, y: 72 }, active: false },
  { from: { x: 49, y: 30 }, to: { x: 65, y: 47 }, active: false },
  { from: { x: 22, y: 35 }, to: { x: 85, y: 72 }, active: false },
  { from: { x: 47, y: 28 }, to: { x: 81, y: 36 }, active: true },
];
const recentBookings = [
  {
    id: "BK001",
    passenger: "John Smith",
    flight: "AA123",
    from: "New York (JFK)",
    to: "London (LHR)",
    date: "2024-03-15",
    status: "confirmed",
    amount: "$450",
    airline: "American Airlines",
  },
  {
    id: "BK002",
    passenger: "Emma Wilson",
    flight: "BA456",
    from: "London (LHR)",
    to: "Paris (CDG)",
    date: "2024-03-14",
    status: "completed",
    amount: "$220",
    airline: "British Airways",
  },
  {
    id: "BK003",
    passenger: "Michael Brown",
    flight: "DL789",
    from: "Atlanta (ATL)",
    to: "Tokyo (HND)",
    date: "2024-03-14",
    status: "pending",
    amount: "$1,200",
    airline: "Delta Air Lines",
  },
  {
    id: "BK004",
    passenger: "Sarah Davis",
    flight: "UA321",
    from: "Chicago (ORD)",
    to: "Los Angeles (LAX)",
    date: "2024-03-13",
    status: "confirmed",
    amount: "$350",
    airline: "United Airlines",
  },
  {
    id: "BK005",
    passenger: "James Johnson",
    flight: "EK234",
    from: "Dubai (DXB)",
    to: "Sydney (SYD)",
    date: "2024-03-13",
    status: "cancelled",
    amount: "$1,500",
    airline: "Emirates",
  },
  {
    id: "BK006",
    passenger: "Lisa Anderson",
    flight: "QF567",
    from: "Melbourne (MEL)",
    to: "Singapore (SIN)",
    date: "2024-03-12",
    status: "confirmed",
    amount: "$680",
    airline: "Qantas",
  },
  {
    id: "BK007",
    passenger: "Robert Taylor",
    flight: "AF890",
    from: "Paris (CDG)",
    to: "Rome (FCO)",
    date: "2024-03-12",
    status: "completed",
    amount: "$290",
    airline: "Air France",
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dash-tooltip">
        <p className="dash-tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="dash-tooltip-value">
            {p.name === "revenue" ? `$${p.value}M` : `${p.value} bookings`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── World Route Map ────────────────────────────────────────────────
const WorldRouteMap = ({ destinations }) => {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setAnimOffset((prev) => (prev + 1) % 100),
      50,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dash-map">
      <svg
        className="dash-map-grid"
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
      >
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="80"
            stroke="#60a5fa"
            strokeWidth="0.2"
          />
        ))}
        {[10, 20, 30, 40, 50, 60, 70].map((y) => (
          <line
            key={`h${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#60a5fa"
            strokeWidth="0.2"
          />
        ))}
      </svg>
      <svg
        className="dash-map-svg"
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Continents */}
        <ellipse
          cx="22"
          cy="33"
          rx="10"
          ry="12"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        <ellipse
          cx="28"
          cy="58"
          rx="6"
          ry="10"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        <ellipse
          cx="49"
          cy="28"
          rx="6"
          ry="7"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        <ellipse
          cx="50"
          cy="52"
          rx="7"
          ry="12"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        <ellipse
          cx="60"
          cy="40"
          rx="5"
          ry="6"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        <ellipse
          cx="74"
          cy="34"
          rx="14"
          ry="12"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        <ellipse
          cx="85"
          cy="68"
          rx="7"
          ry="6"
          fill="#1e3a5f"
          stroke="#2d5a8e"
          strokeWidth="0.3"
          opacity="0.8"
        />
        {/* Routes */}
        {ROUTES.map((route, i) => (
          <line
            key={i}
            x1={route.from.x}
            y1={route.from.y}
            x2={route.to.x}
            y2={route.to.y}
            stroke={route.active ? "#60a5fa" : "#334155"}
            strokeWidth={route.active ? "0.4" : "0.2"}
            strokeDasharray={route.active ? "1 1" : "0.5 1.5"}
            opacity={route.active ? 0.7 : 0.3}
          />
        ))}
        {/* Animated planes */}
        {ROUTES.filter((r) => r.active).map((route, i) => {
          const t = ((animOffset + i * 20) % 100) / 100;
          const cx = route.from.x + (route.to.x - route.from.x) * t;
          const cy = route.from.y + (route.to.y - route.from.y) * t;
          return (
            <circle
              key={`plane-${i}`}
              cx={cx}
              cy={cy}
              r="0.6"
              fill="#93c5fd"
              opacity="0.9"
            >
              <animate
                attributeName="opacity"
                values="0.9;0.3;0.9"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
        {/* Airport dots */}
        {destinations.map((dest, i) => (
          <g
            key={i}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredCity(dest)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <circle
              cx={dest.x}
              cy={dest.y}
              r="2"
              fill="none"
              stroke={dest.color}
              strokeWidth="0.3"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="1.5;3;1.5"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={dest.x}
              cy={dest.y}
              r="1"
              fill={dest.color}
              opacity="0.9"
            />
            <text
              x={dest.x + 1.5}
              y={dest.y - 1.5}
              fontSize="1.8"
              fill="white"
              opacity="0.7"
              fontWeight="600"
            >
              {dest.code}
            </text>
          </g>
        ))}
      </svg>
      {hoveredCity && (
        <div
          className="dash-map-tooltip"
          style={{ left: `${hoveredCity.x}%`, top: `${hoveredCity.y - 12}%` }}
        >
          <p className="dash-map-tooltip-city">{hoveredCity.city}</p>
          <p className="dash-map-tooltip-country">{hoveredCity.country}</p>
          <p className="dash-map-tooltip-flights">
            {hoveredCity.flights.toLocaleString()} flights
          </p>
          <p className="dash-map-tooltip-growth">↑ {hoveredCity.growth}%</p>
        </div>
      )}
      <div className="dash-map-legend">
        <div className="dash-map-legend-item">
          <div className="dash-map-legend-line" />
          <span>Active Route</span>
        </div>
        <div className="dash-map-legend-item">
          <div className="dash-map-legend-dot" />
          <span>Airport Hub</span>
        </div>
      </div>
      <div className="dash-map-live">
        <span className="dash-map-live-dot" />
        Live Routes
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────
const AirlineSkeleton = () => (
  <div className="dash-airline-skeleton">
    <div className="dash-skeleton-header">
      <div className="dash-skeleton-icon" />
      <div className="dash-skeleton-info">
        <div className="dash-skeleton-line dash-skeleton-line-lg" />
        <div className="dash-skeleton-line dash-skeleton-line-sm" />
      </div>
    </div>
    <div className="dash-skeleton-bar" />
    <div className="dash-skeleton-grid">
      <div className="dash-skeleton-cell" />
      <div className="dash-skeleton-cell" />
      <div className="dash-skeleton-cell" />
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [popularAirlines, setPopularAirlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [chartType, setChartType] = useState("area");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchAirlines(),
          fetchAirports(),
          fetchFlights(),
          fetchPopularAirlines(),
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/allUsers");
      if (res.ok) setUsers(await res.json());
    } catch {
      setUsers([]);
    }
  };
  const fetchAirlines = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/airlines/allAirlines",
      );
      setAirlines(res.data.airlines || []);
    } catch {
      setAirlines([]);
    }
  };
  const fetchAirports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/airports/allAirports");
      if (res.ok) setAirports(await res.json());
    } catch {
      setAirports([]);
    }
  };
  const fetchFlights = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/flights/allFlights");
      if (res.ok) setFlights(await res.json());
    } catch {
      setFlights([]);
    }
  };

  const fetchPopularAirlines = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/airlines/allAirlines",
      );
      const all = res.data.airlines || [];
      const colors = [
        "#3b82f6",
        "#22c55e",
        "#8b5cf6",
        "#f97316",
        "#6366f1",
        "#ec4899",
        "#14b8a6",
        "#ef4444",
      ];
      const calc = all
        .filter((a) => a.status === "Publish")
        .map((a, i) => ({
          _id: a._id,
          name: a.airline_name,
          code: a.airline_code,
          status: a.status,
          percentage: Math.min(
            98,
            Math.max(60, 100 - i * 8 - Math.floor(Math.random() * 10)),
          ),
          color: colors[i % colors.length],
          flights: Math.floor(Math.random() * 500) + 500,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          revenue: `$${(Math.random() * 10 + 5).toFixed(1)}M`,
          trend: `+${(Math.random() * 10 + 2).toFixed(1)}%`,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 8);
      setPopularAirlines(calc);
    } catch {
      setPopularAirlines([
        {
          name: "SkyHigh Airlines",
          percentage: 94,
          color: "#3b82f6",
          code: "SHA",
          flights: 1245,
          rating: 4.8,
          revenue: "$12.4M",
          trend: "+12%",
        },
        {
          name: "FlyFast Airways",
          percentage: 88,
          color: "#22c55e",
          code: "FFA",
          flights: 1080,
          rating: 4.6,
          revenue: "$10.2M",
          trend: "+8%",
        },
        {
          name: "AeroJet",
          percentage: 82,
          color: "#8b5cf6",
          code: "AEJ",
          flights: 950,
          rating: 4.5,
          revenue: "$9.1M",
          trend: "+5%",
        },
        {
          name: "Nimbus Airlines",
          percentage: 76,
          color: "#f97316",
          code: "NMB",
          flights: 820,
          rating: 4.3,
          revenue: "$7.8M",
          trend: "+3%",
        },
      ]);
    }
  };

  const chartData = chartPeriod === "monthly" ? revenueMonthly : revenueWeekly;
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0).toFixed(1);
  const totalBookingsChart = chartData.reduce((s, d) => s + d.bookings, 0);
  const revenueGrowth = (
    ((chartData[chartData.length - 1].revenue - chartData[0].revenue) /
      chartData[0].revenue) *
    100
  ).toFixed(1);

  const filteredBookings = recentBookings.filter(
    (b) =>
      b.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.airline.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const STATUS_CLASS = {
    confirmed: "dash-status-confirmed",
    pending: "dash-status-pending",
    completed: "dash-status-completed",
    cancelled: "dash-status-cancelled",
  };

  const STAT_CARDS = [
    {
      label: "Total Users",
      value: users.length || 2481,
      badge: "+12%",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.08)",
      icon: Users,
    },
    {
      label: "Total Airlines",
      value: airlines.length || 48,
      badge: "+5%",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.08)",
      icon: Building2,
    },
    {
      label: "Total Airports",
      value: airports.length || 186,
      badge: "+8%",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      icon: MapPin,
    },
    {
      label: "Total Flights",
      value: flights.length || 3740,
      badge: "+15%",
      color: "#f97316",
      bg: "rgba(249,115,22,0.08)",
      icon: Plane,
    },
  ];

  return (
    <div className="dash-container">
      <div className="dash-inner">
        {/* ── Welcome ── */}
        <div className="dash-welcome">
          <h2 className="dash-welcome-title">Dashboard Overview</h2>
          <p className="dash-welcome-sub">Welcome back, Admin</p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="dash-stats-grid">
          {STAT_CARDS.map(({ label, value, badge, color, bg, icon: Icon }) => (
            <div key={label} className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span
                  className="dash-stat-badge"
                  style={{ color, background: bg }}
                >
                  {badge}
                </span>
              </div>
              <h3 className="dash-stat-value">{value.toLocaleString()}</h3>
              <p className="dash-stat-label">{label}</p>
            </div>
          ))}

          {/* Revenue Card */}
          <div className="dash-stat-card dash-stat-revenue">
            <div className="dash-stat-top">
              <div
                className="dash-stat-icon"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <IndianRupee size={18} style={{ color: "white" }} />
              </div>
              <span className="dash-revenue-badge">
                <TrendingUp size={10} /> +{revenueGrowth}%
              </span>
            </div>
            <h3 className="dash-stat-value" style={{ color: "white" }}>
              ₹{totalRevenue}M
            </h3>
            <p
              className="dash-stat-label"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Total Revenue
            </p>
            <div className="dash-revenue-footer">
              <span>{totalBookingsChart.toLocaleString()} bookings</span>
              <span>this {chartPeriod === "monthly" ? "year" : "week"}</span>
            </div>
          </div>
        </div>

        {/* ── Charts Section ── */}
        <div className="dash-charts-grid">
          {/* Area / Bar Chart */}
          <div className="dash-card dash-chart-main">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">
                  <BarChart2 size={16} style={{ color: "#3b82f6" }} /> Revenue &
                  Bookings Trend
                </h3>
                <p className="dash-card-sub">
                  Track revenue performance over time
                </p>
              </div>
              <div className="dash-chart-controls">
                <div className="dash-toggle-group">
                  {["weekly", "monthly"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`dash-toggle-btn ${chartPeriod === p ? "dash-toggle-active" : ""}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="dash-toggle-group">
                  {["area", "bar"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setChartType(t)}
                      className={`dash-toggle-btn ${chartType === t ? "dash-toggle-active" : ""}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="dash-card-body">
              <div className="dash-chart-summary">
                <div className="dash-chart-chip">
                  <span
                    className="dash-chip-dot"
                    style={{ background: "#3b82f6" }}
                  />
                  <span className="dash-chip-label">Revenue</span>
                  <span className="dash-chip-value">₹{totalRevenue}M</span>
                </div>
                <div className="dash-chart-chip">
                  <span
                    className="dash-chip-dot"
                    style={{ background: "#10b981" }}
                  />
                  <span className="dash-chip-label">Bookings</span>
                  <span className="dash-chip-value">
                    {totalBookingsChart.toLocaleString()}
                  </span>
                </div>
                <div className="dash-chart-chip">
                  <TrendingUp size={12} style={{ color: "#22c55e" }} />
                  <span
                    className="dash-chip-value"
                    style={{ color: "#22c55e" }}
                  >
                    +{revenueGrowth}% growth
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                {chartType === "area" ? (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorBookings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                      name="revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#colorBookings)"
                      name="bookings"
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="revenue"
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="bookings"
                      maxBarSize={32}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">
                  <BarChart2 size={16} style={{ color: "#8b5cf6" }} /> Booking
                  Status
                </h3>
                <p className="dash-card-sub">Distribution by status type</p>
              </div>
            </div>
            <div className="dash-card-body">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="dash-pie-legend">
                {bookingStatusData.map((item, i) => (
                  <div key={i} className="dash-pie-item">
                    <div
                      className="dash-pie-dot"
                      style={{ background: item.color }}
                    />
                    <div>
                      <p className="dash-pie-name">{item.name}</p>
                      <p className="dash-pie-value">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── World Map + Top Destinations ── */}
        <div className="dash-charts-grid">
          <div className="dash-card dash-chart-main">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">
                  <Globe size={16} style={{ color: "#3b82f6" }} /> World Route
                  Map
                </h3>
                <p className="dash-card-sub">
                  Active flight routes across destinations
                </p>
              </div>
              <span className="dash-active-routes-badge">
                {ROUTES.filter((r) => r.active).length} active routes
              </span>
            </div>
            <div className="dash-card-body">
              <WorldRouteMap destinations={TOP_DESTINATIONS} />
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">
                <Award size={16} style={{ color: "#f59e0b" }} /> Top
                Destinations
              </h3>
              <p className="dash-card-sub" style={{ marginTop: "0.25rem" }}>
                Ranked by total flights
              </p>
            </div>
            <div className="dash-destinations-list">
              {TOP_DESTINATIONS.map((dest, i) => (
                <div key={i} className="dash-destination-item">
                  <span className="dash-dest-rank">{i + 1}</span>
                  <div
                    className="dash-dest-icon"
                    style={{ background: dest.color }}
                  >
                    {dest.code.slice(0, 2)}
                  </div>
                  <div className="dash-dest-info">
                    <div className="dash-dest-row">
                      <p className="dash-dest-city">{dest.city}</p>
                      <span className="dash-dest-growth">+{dest.growth}%</span>
                    </div>
                    <div className="dash-dest-bar-bg">
                      <div
                        className="dash-dest-bar-fill"
                        style={{
                          width: `${(dest.flights / TOP_DESTINATIONS[0].flights) * 100}%`,
                          background: dest.color,
                        }}
                      />
                    </div>
                    <p className="dash-dest-meta">
                      {dest.flights.toLocaleString()} flights · {dest.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="dash-destinations-footer">
              <span>
                {TOP_DESTINATIONS.reduce(
                  (s, d) => s + d.flights,
                  0,
                ).toLocaleString()}{" "}
                total flights
              </span>
              <button className="dash-link-btn">
                All Destinations <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Popular Airlines ── */}
        <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
          <div className="dash-airlines-header">
            <div>
              <h3 className="dash-card-title">
                <Award size={18} style={{ color: "#3b82f6" }} />{" "}
                <span style={{ fontSize: "1.1rem" }}>Popular Airlines</span>
              </h3>
              <p className="dash-card-sub">
                Real-time data from your airline records
              </p>
            </div>
            <span className="dash-active-routes-badge">Based on bookings</span>
          </div>
          <div className="dash-card-body">
            {loading ? (
              <div className="dash-airlines-grid">
                {[...Array(4)].map((_, i) => (
                  <AirlineSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="dash-airlines-grid">
                  {popularAirlines.map((airline, i) => (
                    <div key={airline._id || i} className="dash-airline-card">
                      <div className="dash-airline-top">
                        <div className="dash-airline-left">
                          <div
                            className="dash-airline-icon"
                            style={{ background: `${airline.color}20` }}
                          >
                            <Plane size={18} style={{ color: airline.color }} />
                          </div>
                          <div>
                            <span className="dash-airline-name">
                              {airline.name}
                            </span>
                            <span className="dash-airline-code">
                              {airline.code}
                            </span>
                          </div>
                        </div>
                        <div className="dash-airline-rating">
                          <Star
                            size={12}
                            style={{ color: "#f59e0b", fill: "#f59e0b" }}
                          />
                          <span>{airline.rating}</span>
                        </div>
                      </div>
                      <div className="dash-airline-popularity">
                        <div className="dash-popularity-row">
                          <span className="dash-popularity-label">
                            Popularity
                          </span>
                          <span className="dash-popularity-value">
                            {airline.percentage}%
                          </span>
                        </div>
                        <div className="dash-popularity-track">
                          <div
                            className="dash-popularity-fill"
                            style={{
                              width: `${airline.percentage}%`,
                              background: airline.color,
                            }}
                          />
                        </div>
                      </div>
                      <div className="dash-airline-stats">
                        <div className="dash-airline-stat">
                          <span className="dash-stat-stat-label">Flights</span>
                          <p className="dash-stat-stat-value">
                            {airline.flights}
                          </p>
                        </div>
                        <div className="dash-airline-stat">
                          <span className="dash-stat-stat-label">Revenue</span>
                          <p className="dash-stat-stat-value">
                            {airline.revenue}
                          </p>
                        </div>
                        <div className="dash-airline-stat">
                          <span className="dash-stat-stat-label">Trend</span>
                          <p
                            className="dash-stat-stat-value"
                            style={{ color: "#22c55e" }}
                          >
                            {airline.trend}
                          </p>
                        </div>
                      </div>
                      {airline.status && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <span
                            className={`dash-airline-status-badge ${airline.status === "Publish" ? "dash-status-publish" : "dash-status-draft"}`}
                          >
                            {airline.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="dash-airlines-footer">
                  <button className="dash-link-btn">
                    View All Airlines ({airlines.length || 48} total){" "}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Recent Bookings ── */}
        <div className="dash-card">
          <div className="dash-card-header dash-bookings-header">
            <h3 className="dash-card-title">
              <Calendar size={16} style={{ color: "var(--text-secondary)" }} />
              Recent Bookings
            </h3>
            <div className="dash-bookings-controls">
              <div className="dash-search-box">
                <Search size={14} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="dash-search-input"
                />
              </div>
              <button className="dash-icon-btn">
                <Filter size={14} /> <span>Filter</span>
              </button>
              <button className="dash-icon-btn">
                <Download size={14} /> <span>Export</span>
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="dash-table-wrapper">
            <table className="dash-bookings-table">
              <thead>
                <tr>
                  {[
                    "Booking ID",
                    "Passenger",
                    "Flight",
                    "Route",
                    "Date",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="dash-booking-id">#{b.id}</td>
                    <td>
                      <p className="dash-booking-name">{b.passenger}</p>
                      <p className="dash-booking-airline">{b.airline}</p>
                    </td>
                    <td className="dash-booking-flight">{b.flight}</td>
                    <td>
                      <p className="dash-booking-route">{b.from}</p>
                      <p className="dash-booking-route-to">→ {b.to}</p>
                    </td>
                    <td className="dash-booking-date">{b.date}</td>
                    <td className="dash-booking-amount">₹{b.amount}</td>
                    <td>
                      <span
                        className={`dash-booking-status ${STATUS_CLASS[b.status] || ""}`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="dash-more-btn">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="dash-mobile-cards">
            {paginatedBookings.map((b) => (
              <div key={b.id} className="dash-mobile-card">
                <div className="dash-mobile-card-top">
                  <div>
                    <span className="dash-booking-id-sm">#{b.id}</span>
                    <h4 className="dash-booking-name">{b.passenger}</h4>
                    <p className="dash-booking-airline">{b.airline}</p>
                  </div>
                  <span
                    className={`dash-booking-status ${STATUS_CLASS[b.status] || ""}`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="dash-mobile-card-grid">
                  <div>
                    <span className="dash-mobile-label">Flight</span>
                    <p className="dash-booking-flight">{b.flight}</p>
                  </div>
                  <div>
                    <span className="dash-mobile-label">Amount</span>
                    <p className="dash-booking-amount">₹{b.amount}</p>
                  </div>
                </div>
                <div className="dash-mobile-route">
                  <span className="dash-mobile-label">Route</span>
                  <div className="dash-route-row">
                    <span className="dash-booking-name">{b.from}</span>
                    <ArrowUpRight
                      size={12}
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span className="dash-booking-name">{b.to}</span>
                  </div>
                </div>
                <div className="dash-mobile-footer">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Clock
                      size={12}
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span className="dash-booking-date">{b.date}</span>
                  </div>
                  <button className="dash-link-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredBookings.length > 0 && (
            <div className="dash-bookings-pagination">
              <p className="dash-pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredBookings.length)}{" "}
                of {filteredBookings.length} bookings
              </p>
              <div className="dash-pagination-btns">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`dash-page-btn ${currentPage === 1 ? "dash-page-btn-disabled" : ""}`}
                >
                  Previous
                </button>
                <span className="dash-page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`dash-page-btn ${currentPage === totalPages ? "dash-page-btn-disabled" : ""}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {filteredBookings.length === 0 && (
            <div className="dash-empty">
              <Calendar
                size={48}
                style={{ color: "var(--text-secondary)", opacity: 0.3 }}
              />
              <p
                style={{ color: "var(--text-secondary)", marginTop: "0.75rem" }}
              >
                No bookings found
              </p>
              <button
                className="dash-link-btn"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
