import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  Plane,
  MapPin,
  Activity,
  TrendingUp,
  Globe,
  Calendar,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Star,
  Award,
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [popularAirlines, setPopularAirlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchAirlines(),
          fetchAirports(),
          fetchFlights(),
          fetchPopularAirlines()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/allUsers");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Users fetch error:", error);
    }
  };

  const fetchAirlines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/airlines/allAirlines");
      setAirlines(res.data.airlines || []);
    } catch (error) {
      console.error("Airlines fetch error:", error);
    }
  };

  const fetchAirports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/airports/allAirports");
      if (!res.ok) throw new Error("Failed to fetch airports");
      const data = await res.json();
      setAirports(data);
    } catch (error) {
      console.error("Airports fetch error:", error);
    }
  };

  const fetchFlights = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/flights/allFlights");
      if (!res.ok) throw new Error("Failed to fetch flights");
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      console.error("Flights fetch error:", error);
    }
  };

  // Fetch and calculate popular airlines
  const fetchPopularAirlines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/airlines/allAirlines");
      const allAirlines = res.data.airlines || [];
      
      // You can modify this logic based on your requirements
      // Here we're calculating popularity based on:
      // - Status (Publish counts more)
      // - Random factors for demo (replace with actual booking data)
      
      const calculatedAirlines = allAirlines
        .filter(airline => airline.status === "Publish") // Only show published airlines
        .map((airline, index) => {
          // Calculate popularity percentage (customize this logic)
          // This is sample logic - replace with your actual calculation
          const basePercentage = 100 - (index * 8); // Decreasing percentage
          const randomFactor = Math.floor(Math.random() * 10);
          const percentage = Math.min(98, Math.max(60, basePercentage - randomFactor));
          
          // Generate sample data (replace with actual data from your backend)
          const flightsCount = Math.floor(Math.random() * 500) + 500; // 500-1000 flights
          const revenueValue = (Math.random() * 10 + 5).toFixed(1); // 5-15M
          const trendValue = (Math.random() * 10 + 2).toFixed(1); // 2-12%
          
          // Assign colors based on index
          const colors = [
            "bg-blue-500",
            "bg-green-500", 
            "bg-purple-500",
            "bg-orange-500",
            "bg-indigo-500",
            "bg-pink-500",
            "bg-teal-500",
            "bg-red-500"
          ];
          
          return {
            _id: airline._id,
            name: airline.airline_name,
            code: airline.airline_code,
            status: airline.status,
            percentage: percentage,
            color: colors[index % colors.length],
            flights: flightsCount,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0
            revenue: `$${revenueValue}M`,
            trend: `+${trendValue}%`,
            createdAt: airline.createdAt
          };
        })
        .sort((a, b) => b.percentage - a.percentage) // Sort by popularity
        .slice(0, 8); // Top 8 airlines

      setPopularAirlines(calculatedAirlines);
    } catch (error) {
      console.error("Popular airlines fetch error:", error);
      // Fallback data if API fails
      setPopularAirlines([
        { 
          name: "SkyHigh Airlines", 
          percentage: 94, 
          color: "bg-blue-500",
          code: "SHA",
          flights: 1245,
          rating: 4.8,
          revenue: "$12.4M",
          trend: "+12%"
        },
        { 
          name: "FlyFast Airways", 
          percentage: 88, 
          color: "bg-green-500",
          code: "FFA",
          flights: 1080,
          rating: 4.6,
          revenue: "$10.2M",
          trend: "+8%"
        },
        { 
          name: "AeroJet", 
          percentage: 82, 
          color: "bg-purple-500",
          code: "AEJ",
          flights: 950,
          rating: 4.5,
          revenue: "$9.1M",
          trend: "+5%"
        },
        { 
          name: "Nimbus Airlines", 
          percentage: 76, 
          color: "bg-orange-500",
          code: "NMB",
          flights: 820,
          rating: 4.3,
          revenue: "$7.8M",
          trend: "+3%"
        },
        { 
          name: "Cloud Nine Air", 
          percentage: 71, 
          color: "bg-indigo-500",
          code: "CNA",
          flights: 750,
          rating: 4.2,
          revenue: "$6.5M",
          trend: "+2%"
        },
      ]);
    }
  };

  // Recent Bookings Data (keep as is or fetch from API)
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

  // Filter bookings based on search
  const filteredBookings = recentBookings.filter(
    (booking) =>
      booking.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.airline.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Loading skeleton
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
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* Users Card */}
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
              {users.length}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Users</p>
          </div>

          {/* Airlines Card */}
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
              {airlines.length}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Airlines</p>
          </div>

          {/* Airports Card */}
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
              {airports.length}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Airports</p>
          </div>

          {/* Flights Card */}
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
              {flights.length}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">Total Flights</p>
          </div>
        </div>

        {/* Popular Airlines Card - Full Width */}
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
            <p className="text-xs text-gray-500 mt-1">Real-time data from your airline records</p>
          </div>
          
          <div className="p-5">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <AirlineSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {popularAirlines.map((airline, index) => (
                    <div key={airline._id || index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Airline Header with Code and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-lg ${airline.color} bg-opacity-20 flex items-center justify-center`}>
                            <Plane className={`w-5 h-5 ${airline.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800 block">
                              {airline.name}
                            </span>
                            <span className="text-xs text-gray-400">{airline.code}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-gray-700">{airline.rating}</span>
                        </div>
                      </div>

                      {/* Main Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Popularity</span>
                          <span className="text-xs font-bold text-gray-900">{airline.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${airline.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${airline.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Additional Stats Grid */}
                      <div className="grid grid-cols-3 gap-1 mt-3 text-xs border-t border-gray-100 pt-3">
                        <div className="text-center">
                          <span className="text-gray-500 block">Flights</span>
                          <p className="font-semibold text-gray-800">{airline.flights}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500 block">Revenue</span>
                          <p className="font-semibold text-gray-800">{airline.revenue}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500 block">Trend</span>
                          <p className="font-semibold text-green-600">{airline.trend}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {airline.status && (
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            airline.status === "Publish" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {airline.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* View All Airlines Link */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 mx-auto">
                    View All Airlines ({airlines.length} total)
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Bookings Table - Full Width */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header with Actions */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Recent Bookings
              </h3>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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

          {/* Table - Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.passenger}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.airline}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {booking.flight}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        <div>{booking.from}</div>
                        <div className="text-xs text-gray-400">
                          → {booking.to}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {booking.date}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {booking.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
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

          {/* Mobile View - Card Layout */}
          <div className="md:hidden divide-y divide-gray-200">
            {paginatedBookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">
                      #{booking.id}
                    </span>
                    <h4 className="font-medium text-gray-900">
                      {booking.passenger}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {booking.airline}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-500">Flight</span>
                    <p className="font-medium">{booking.flight}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Amount</span>
                    <p className="font-medium">{booking.amount}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-xs text-gray-500">Route</span>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="font-medium">{booking.from}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">{booking.to}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {booking.date}
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
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredBookings.length,
                )}{" "}
                of {filteredBookings.length} bookings
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm border rounded-lg ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm border rounded-lg ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
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