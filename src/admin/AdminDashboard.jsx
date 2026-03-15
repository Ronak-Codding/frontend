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

// ─── Sample Data ──────────────────────────────────────────────────────────────

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


// Route lines between hub airports
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

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name === "revenue" ? `$${p.value}M` : `${p.value} bookings`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── World Route Map Component ─────────────────────────────────────────────────
const WorldRouteMap = ({ destinations }) => {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-xl overflow-hidden"
      style={{ height: 320 }}
    >
      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
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

      {/* Continent shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Simplified continent blobs */}
        {/* North America */}
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
        {/* South America */}
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
        {/* Europe */}
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
        {/* Africa */}
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
        {/* Middle East */}
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
        {/* Asia */}
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
        {/* Australia */}
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

        {/* Route lines */}
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

        {/* Animated plane dots on active routes */}
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
            {/* Pulse ring */}
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
            {/* Core dot */}
            <circle
              cx={dest.x}
              cy={dest.y}
              r="1"
              fill={dest.color}
              opacity="0.9"
            />
            {/* City code label */}
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

      {/* Hover tooltip */}
      {hoveredCity && (
        <div
          className="absolute bg-white rounded-lg shadow-xl p-2 text-xs pointer-events-none z-10 border border-gray-100"
          style={{
            left: `${hoveredCity.x}%`,
            top: `${hoveredCity.y - 12}%`,
            transform: "translateX(-50%)",
          }}
        >
          <p className="font-bold text-gray-800">{hoveredCity.city}</p>
          <p className="text-gray-500">{hoveredCity.country}</p>
          <p className="text-blue-600 font-semibold">
            {hoveredCity.flights.toLocaleString()} flights
          </p>
          <p className="text-green-600">↑ {hoveredCity.growth}%</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs text-blue-200">
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-px bg-blue-400"
            style={{ borderTop: "1px dashed" }}
          ></div>
          <span>Active Route</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span>Airport Hub</span>
        </div>
      </div>

      {/* Live badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-xs text-green-400 px-2 py-1 rounded-full border border-green-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
        Live Routes
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [popularAirlines, setPopularAirlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("monthly"); // monthly | weekly
  const [chartType, setChartType] = useState("area"); // area | bar
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
      if (!res.ok) throw new Error();
      setUsers(await res.json());
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
      if (!res.ok) throw new Error();
      setAirports(await res.json());
    } catch {
      setAirports([]);
    }
  };

  const fetchFlights = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/flights/allFlights");
      if (!res.ok) throw new Error();
      setFlights(await res.json());
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
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-orange-500",
        "bg-indigo-500",
        "bg-pink-500",
        "bg-teal-500",
        "bg-red-500",
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
          color: "bg-blue-500",
          code: "SHA",
          flights: 1245,
          rating: 4.8,
          revenue: "$12.4M",
          trend: "+12%",
        },
        {
          name: "FlyFast Airways",
          percentage: 88,
          color: "bg-green-500",
          code: "FFA",
          flights: 1080,
          rating: 4.6,
          revenue: "$10.2M",
          trend: "+8%",
        },
        {
          name: "AeroJet",
          percentage: 82,
          color: "bg-purple-500",
          code: "AEJ",
          flights: 950,
          rating: 4.5,
          revenue: "$9.1M",
          trend: "+5%",
        },
        {
          name: "Nimbus Airlines",
          percentage: 76,
          color: "bg-orange-500",
          code: "NMB",
          flights: 820,
          rating: 4.3,
          revenue: "$7.8M",
          trend: "+3%",
        },
        {
          name: "Cloud Nine Air",
          percentage: 71,
          color: "bg-indigo-500",
          code: "CNA",
          flights: 750,
          rating: 4.2,
          revenue: "$6.5M",
          trend: "+2%",
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

  const getStatusColor = (status) =>
    ({
      confirmed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    })[status] || "bg-gray-100 text-gray-700 border-gray-200";

  const AirlineSkeleton = () => (
    <div className="border border-gray-100 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full mb-3"></div>
      <div className="grid grid-cols-3 gap-1 mt-3">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          {/* Users */}
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 md:p-2 bg-blue-50 rounded-lg">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {users.length || 2481}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Users</p>
          </div>

          {/* Airlines */}
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 md:p-2 bg-green-50 rounded-lg">
                <Building2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +5%
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {airlines.length || 48}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Airlines</p>
          </div>

          {/* Airports */}
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 md:p-2 bg-purple-50 rounded-lg">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {airports.length || 186}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Airports</p>
          </div>

          {/* Flights */}
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 md:p-2 bg-orange-50 rounded-lg">
                <Plane className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                +15%
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {flights.length || 3740}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Flights</p>
          </div>

          {/* ── NEW: Revenue Total Card ── */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-lg transition-all text-white col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +{revenueGrowth}%
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold">${totalRevenue}M</h3>
            <p className="text-xs md:text-sm text-emerald-100">Total Revenue</p>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-xs text-emerald-100">
              <span>{totalBookingsChart.toLocaleString()} bookings</span>
              <span>this {chartPeriod === "monthly" ? "year" : "week"}</span>
            </div>
          </div>
        </div>

        {/* ── NEW: Revenue & Charts Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Area / Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  Revenue & Bookings Trend
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track revenue performance over time
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Period toggle */}
                <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                  {["weekly", "monthly"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-all capitalize ${chartPeriod === p ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {/* Chart type toggle */}
                <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                  {["area", "bar"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setChartType(t)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-all capitalize ${chartType === t ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* Summary Chips */}
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-500">Revenue</span>
                  <span className="text-xs font-bold text-gray-800">
                    ${totalRevenue}M
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs text-gray-500">Bookings</span>
                  <span className="text-xs font-bold text-gray-800">
                    {totalBookingsChart.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-bold text-green-600">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
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
                      yAxisId={0}
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
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

          {/* Booking Status Pie */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                Booking Status
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Distribution by status type
              </p>
            </div>
            <div className="p-4">
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
              <div className="grid grid-cols-2 gap-2 mt-2">
                {bookingStatusData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    ></div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs font-bold text-gray-800">
                        {item.value}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── NEW: World Route Map + Top Destinations ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* World Route Map */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  World Route Map
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Active flight routes across destinations
                </p>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {ROUTES.filter((r) => r.active).length} active routes
              </span>
            </div>
            <div className="p-4">
              <WorldRouteMap destinations={TOP_DESTINATIONS} />
            </div>
          </div>

          {/* ── NEW: Top Destinations ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Top Destinations
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Ranked by total flights
              </p>
            </div>
            <div
              className="p-4 space-y-3 overflow-y-auto"
              style={{ maxHeight: 320 }}
            >
              {TOP_DESTINATIONS.map((dest, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors cursor-pointer"
                >
                  {/* Rank */}
                  <span className="text-xs font-bold text-gray-300 w-4 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  {/* Color dot */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                    style={{ background: dest.color }}
                  >
                    {dest.code.slice(0, 2)}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {dest.city}
                      </p>
                      <span className="text-xs font-bold text-green-600 flex-shrink-0 ml-1">
                        +{dest.growth}%
                      </span>
                    </div>
                    {/* Mini bar */}
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(dest.flights / TOP_DESTINATIONS[0].flights) * 100}%`,
                          background: dest.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {dest.flights.toLocaleString()} flights · {dest.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Summary footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {TOP_DESTINATIONS.reduce(
                  (s, d) => s + d.flights,
                  0,
                ).toLocaleString()}{" "}
                total flights
              </span>
              <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
                All Destinations <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Popular Airlines - unchanged */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-lg">Popular Airlines</span>
              </h3>
              <span className="text-xs font-medium text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">
                Based on bookings
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Real-time data from your airline records
            </p>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <AirlineSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {popularAirlines.map((airline, i) => (
                    <div
                      key={airline._id || i}
                      className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-lg ${airline.color} bg-opacity-20 flex items-center justify-center`}
                          >
                            <Plane
                              className={`w-5 h-5 ${airline.color.replace("bg-", "text-")}`}
                            />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800 block">
                              {airline.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {airline.code}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-gray-700">
                            {airline.rating}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            Popularity
                          </span>
                          <span className="text-xs font-bold text-gray-900">
                            {airline.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${airline.color} h-2 rounded-full`}
                            style={{ width: `${airline.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-3 text-xs border-t border-gray-100 pt-3">
                        <div className="text-center">
                          <span className="text-gray-500 block">Flights</span>
                          <p className="font-semibold text-gray-800">
                            {airline.flights}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500 block">Revenue</span>
                          <p className="font-semibold text-gray-800">
                            {airline.revenue}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500 block">Trend</span>
                          <p className="font-semibold text-green-600">
                            {airline.trend}
                          </p>
                        </div>
                      </div>
                      {airline.status && (
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${airline.status === "Publish" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                          >
                            {airline.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 mx-auto">
                    View All Airlines ({airlines.length || 48} total){" "}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Bookings Table - unchanged */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Recent Bookings
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
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
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{b.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {b.passenger}
                      </div>
                      <div className="text-xs text-gray-500">{b.airline}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {b.flight}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{b.from}</div>
                      <div className="text-xs text-gray-400">→ {b.to}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {b.date}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {b.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(b.status)}`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {paginatedBookings.map((b) => (
              <div key={b.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">
                      #{b.id}
                    </span>
                    <h4 className="font-medium text-gray-900">{b.passenger}</h4>
                    <p className="text-xs text-gray-500">{b.airline}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(b.status)}`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-500">Flight</span>
                    <p className="font-medium">{b.flight}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Amount</span>
                    <p className="font-medium">{b.amount}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-gray-500">Route</span>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="font-medium">{b.from}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">{b.to}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {b.date}
                  </div>
                  <button className="text-blue-600 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredBookings.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredBookings.length)}{" "}
                of {filteredBookings.length} bookings
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm border rounded-lg ${currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm border rounded-lg ${currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bookings found</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
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
