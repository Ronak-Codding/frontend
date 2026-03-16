import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plane,
  ArrowLeftRight,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import "./UserLayout.css";
import "./UserPages.css";

const UserSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneway");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!fromCity || !toCity || !date) return;
    const params = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date,
      passengers,
      class: travelClass,
      ...(tripType === "roundtrip" && returnDate && { returnDate }),
    });
    navigate(`/search-results?${params.toString()}`);
  };

  const swap = () => {
    const t = fromCity;
    setFromCity(toCity);
    setToCity(t);
  };

  const POPULAR = [
    {
      from: "Mumbai",
      to: "Delhi",
      code: "BOM→DEL",
      price: "₹3,499",
      time: "2h 10m",
    },
    {
      from: "Delhi",
      to: "Bangalore",
      code: "DEL→BLR",
      price: "₹4,199",
      time: "2h 45m",
    },
    {
      from: "Mumbai",
      to: "Goa",
      code: "BOM→GOI",
      price: "₹2,899",
      time: "1h 20m",
    },
    {
      from: "Hyderabad",
      to: "Chennai",
      code: "HYD→MAA",
      price: "₹2,199",
      time: "1h 10m",
    },
    {
      from: "Kolkata",
      to: "Mumbai",
      code: "CCU→BOM",
      price: "₹5,299",
      time: "2h 50m",
    },
    {
      from: "Delhi",
      to: "Goa",
      code: "DEL→GOI",
      price: "₹4,799",
      time: "2h 30m",
    },
  ];

  return (
    <div>
      <div className="up-header">
        <h1 className="up-title">Search Flights </h1>
        <p className="up-subtitle">Find the best flights for your journey</p>
      </div>

      {/* Search Card */}
      <div
        className="up-card"
        style={{ marginBottom: "1.5rem", overflow: "visible" }}
      >
        <div className="up-card-body" style={{ padding: "1.5rem" }}>
          {/* Trip Type */}
          <div className="us-trip-tabs">
            {["oneway", "roundtrip"].map((t) => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                className={`us-trip-tab ${tripType === t ? "us-trip-tab-active" : ""}`}
              >
                {t === "oneway" ? "One Way" : "Round Trip"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch}>
            <div className="us-search-row">
              {/* From */}
              <div className="us-field">
                <label className="us-field-label">
                  <MapPin size={13} /> From
                </label>
                <input
                  className="us-field-input"
                  placeholder="City or airport"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  required
                />
              </div>

              {/* Swap */}
              <button
                type="button"
                className="us-swap-btn"
                onClick={swap}
                title="Swap"
              >
                <ArrowLeftRight size={18} />
              </button>

              {/* To */}
              <div className="us-field">
                <label className="us-field-label">
                  <MapPin size={13} /> To
                </label>
                <input
                  className="us-field-input"
                  placeholder="City or airport"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  required
                />
              </div>

              {/* Date */}
              <div className="us-field">
                <label className="us-field-label">
                  <Calendar size={13} /> Departure
                </label>
                <input
                  type="date"
                  className="us-field-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Return Date */}
              {tripType === "roundtrip" && (
                <div className="us-field">
                  <label className="us-field-label">
                    <Calendar size={13} /> Return
                  </label>
                  <input
                    type="date"
                    className="us-field-input"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={date || new Date().toISOString().split("T")[0]}
                  />
                </div>
              )}

              {/* Passengers */}
              <div className="us-field us-field-sm">
                <label className="us-field-label">
                  <Users size={13} /> Passengers
                </label>
                <select
                  className="us-field-input"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div className="us-field us-field-sm">
                <label className="us-field-label">
                  <Star size={13} /> Class
                </label>
                <select
                  className="us-field-input"
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </div>

              {/* Search Button */}
              <button type="submit" className="us-search-btn">
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popular Routes */}
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          Popular Routes
        </h3>
        <div className="us-popular-grid">
          {POPULAR.map((r, i) => (
            <div
              key={i}
              className="us-popular-card"
              onClick={() => {
                setFromCity(r.from);
                setToCity(r.to);
              }}
            >
              <div className="us-popular-route">
                <span className="us-popular-city">{r.from}</span>
                <Plane
                  size={14}
                  style={{ color: "var(--accent)", flexShrink: 0 }}
                />
                <span className="us-popular-city">{r.to}</span>
              </div>
              <div className="us-popular-meta">
                <span className="us-popular-time">
                  <Clock size={12} /> {r.time}
                </span>
                <span className="us-popular-price">{r.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
