import React, { useEffect, useState } from "react";
import UserGrowthChart from "./UserGrowthChart";
import { Ticket, PlaneIcon, IndianRupee } from "lucide-react";

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 20);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/allusers");
        if (!res.ok) throw new Error("Users fetch failed");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Users Error:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/bookings/allBookings",
        );
        if (!res.ok) throw new Error("Bookings fetch failed");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Bookings Error:", error);
      }
    };

    const fetchFlights = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/flights/allFlights");
        if (!res.ok) throw new Error("Flights fetch failed");
        const data = await res.json();
        setFlights(data);
      } catch (error) {
        console.error("Flights Error:", error);
      }
    };

    const fetchRevenue = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/bookings/totalRevenue",
        );
        if (!res.ok) throw new Error("Revenue fetch failed");
        const data = await res.json();
        setRevenue(data.totalRevenue || 0);
      } catch (error) {
        console.error("Revenue Error:", error);
      }
    };

    fetchUsers();
    fetchBookings();
    fetchFlights();
    fetchRevenue();
  }, []);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      {/* Title */}
      <h2>Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <div
          className="p-6 rounded-2xl border 
     dark:border-white 
    bg-white dark:bg-black 
    shadow-md hover:shadow-xl 
    transform hover:-translate-y-1 transition duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black dark:bg-white">
              <i className="fas fa-users w-5 h-5 text-white dark:text-black"></i>
            </div>

            <h3 className="text-3xl font-bold text-black dark:text-white">
              <AnimatedCounter value={users.length} />
            </h3>
          </div>

          <p className="mt-2 text-sm text-black dark:text-white">Total Users</p>
        </div>

        {/* Bookings */}
        <div
          className="p-6 rounded-2xl border 
   dark:border-white
  bg-white dark:bg-black 
  shadow-md hover:shadow-xl 
  transform hover:-translate-y-1 transition duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black dark:bg-white">
              <Ticket className="w-5 h-5 text-white dark:text-black" />
            </div>

            <h3 className="text-3xl font-bold text-black dark:text-white">
              <AnimatedCounter value={bookings.length} />
            </h3>
          </div>

          <p className="mt-3 text-sm text-black dark:text-white">
            Total Bookings
          </p>
        </div>

        {/* Flights */}
        <div
          className="p-6 rounded-2xl border 
     dark:border-white 
    bg-white dark:bg-black 
    shadow-md hover:shadow-xl 
    transform hover:-translate-y-1 transition duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black dark:bg-white">
              <PlaneIcon className="w-5 h-5 text-white dark:text-black" />
            </div>
            <h3 className="text-3xl font-bold text-black dark:text-white">
              <AnimatedCounter value={flights.length} />
            </h3>
          </div>

          <p className="mt-2 text-sm text-black dark:text-white">
            Total Flights
          </p>
        </div>

        {/* Revenue */}
        <div
          className="p-6 rounded-2xl border 
     dark:border-white 
    bg-white dark:bg-black 
    shadow-md hover:shadow-xl 
    transform hover:-translate-y-1 transition duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black dark:bg-white">
              <IndianRupee className="w-5 h-5 text-white dark:text-black" />
            </div>
            <h3 className="text-3xl font-bold text-black dark:text-white">
              <AnimatedCounter value={revenue} />
            </h3>
          </div>

          <p className="mt-2 text-sm text-black dark:text-white">
            Total Revenue
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className=" border-gray-200 dark:border-gray-700 ">
        <UserGrowthChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
