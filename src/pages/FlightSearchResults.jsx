// components/FlightSearchResults.js
import React from "react";
import "./FlightSearchResults.css";

const FlightSearchResults = ({
  searchResults,
  passengers,
  onBookFlight,
  onNewSearch,
  formatFlightTime,
  calculateTotalPrice,
}) => {
  if (!searchResults) return null;

  return (
    <section className="search-results" id="search-results">
      <div className="container">
        <div className="results-header">
          <h2>Flight Search Results</h2>
          <p>
            Found {searchResults.departure_flights.length} flights from{" "}
            {searchResults.search_params.from.city} to{" "}
            {searchResults.search_params.to.city}
          </p>

          {searchResults.search_params.trip_type === "round-trip" && (
            <p className="text-success">
              Round trip search: {searchResults.return_flights.length} return
              flights found
            </p>
          )}
        </div>

        {/* Departure Flights */}
        <div className="flights-list">
          <h3 className="flights-title">Departure Flights</h3>

          {searchResults.departure_flights.length === 0 ? (
            <div className="no-flights">
              <i className="fas fa-plane-slash"></i>
              <h4>No flights found</h4>
              <p>Try adjusting your search criteria or dates</p>
            </div>
          ) : (
            <div className="flights-grid">
              {searchResults.departure_flights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-header">
                    <div className="airline-info">
                      <div className="airline-logo">
                        <i className="fas fa-plane"></i>
                      </div>
                      <div>
                        <h4>{flight.airline.airline_name}</h4>
                        <p className="flight-number">
                          {flight.flight_number} • {flight.aircraft_type}
                        </p>
                      </div>
                    </div>
                    <div className="flight-status">
                      <span
                        className={`status-badge status-${flight.status.toLowerCase()}`}
                      >
                        {flight.status}
                      </span>
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="route">
                      <div className="airport">
                        <h3>{flight.from.airport_code}</h3>
                        <p>{flight.from.city}</p>
                        <p className="time">
                          {formatFlightTime(flight.departure_time)}
                        </p>
                      </div>

                      <div className="route-info">
                        <div className="duration">
                          <i className="fas fa-clock"></i>
                          <span>{flight.duration_formatted}</span>
                        </div>
                        <div className="route-line">
                          <div className="dot start"></div>
                          <div className="line"></div>
                          <div className="dot end"></div>
                        </div>
                        <p className="route-type">Direct</p>
                      </div>

                      <div className="airport">
                        <h3>{flight.to.airport_code}</h3>
                        <p>{flight.to.city}</p>
                        <p className="time">
                          {formatFlightTime(flight.arrival_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flight-footer">
                    <div className="seats-info">
                      <i className="fas fa-chair"></i>
                      <span>{flight.seats_available} seats left</span>
                    </div>

                    <div className="price-section">
                      <div className="price">
                        <h3>${flight.price}</h3>
                        <p>per person</p>
                      </div>

                      <div className="total-price">
                        <p>Total for {passengers} passenger(s):</p>
                        <h3>${calculateTotalPrice(flight, passengers)}</h3>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => onBookFlight(flight.id)}
                      >
                        <i className="fas fa-ticket-alt"></i>
                        Select Flight
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Return Flights (for round trip) */}
        {searchResults.search_params.trip_type === "round-trip" &&
          searchResults.return_flights.length > 0 && (
            <div className="flights-list">
              <h3 className="flights-title">Return Flights</h3>
              <div className="flights-grid">
                {searchResults.return_flights.map((flight) => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                      <div className="airline-info">
                        <div className="airline-logo">
                          <i className="fas fa-plane"></i>
                        </div>
                        <div>
                          <h4>{flight.airline.airline_name}</h4>
                          <p className="flight-number">
                            {flight.flight_number} • {flight.aircraft_type}
                          </p>
                        </div>
                      </div>
                      <div className="flight-status">
                        <span
                          className={`status-badge status-${flight.status.toLowerCase()}`}
                        >
                          {flight.status}
                        </span>
                      </div>
                    </div>

                    <div className="flight-details">
                      <div className="route">
                        <div className="airport">
                          <h3>{flight.from.airport_code}</h3>
                          <p>{flight.from.city}</p>
                          <p className="time">
                            {formatFlightTime(flight.departure_time)}
                          </p>
                        </div>

                        <div className="route-info">
                          <div className="duration">
                            <i className="fas fa-clock"></i>
                            <span>{flight.duration_formatted}</span>
                          </div>
                          <div className="route-line">
                            <div className="dot start"></div>
                            <div className="line"></div>
                            <div className="dot end"></div>
                          </div>
                          <p className="route-type">Direct</p>
                        </div>

                        <div className="airport">
                          <h3>{flight.to.airport_code}</h3>
                          <p>{flight.to.city}</p>
                          <p className="time">
                            {formatFlightTime(flight.arrival_time)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flight-footer">
                      <div className="seats-info">
                        <i className="fas fa-chair"></i>
                        <span>{flight.seats_available} seats left</span>
                      </div>

                      <div className="price-section">
                        <div className="price">
                          <h3>${flight.price}</h3>
                          <p>per person</p>
                        </div>

                        <div className="total-price">
                          <p>Total for {passengers} passenger(s):</p>
                          <h3>${calculateTotalPrice(flight, passengers)}</h3>
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => onBookFlight(flight.id)}
                        >
                          <i className="fas fa-ticket-alt"></i>
                          Select Flight
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Search Again Button */}
        <div className="search-again">
          <button className="btn btn-outline" onClick={onNewSearch}>
            <i className="fas fa-search"></i>
            New Search
          </button>
        </div>
      </div>
    </section>
  );
};

// Helper functions
export const formatFlightTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateTotalPrice = (flight, passengers) => {
  return (flight.price * parseInt(passengers)).toFixed(2);
};

export default FlightSearchResults;
