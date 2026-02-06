import React, { useState } from "react";
import "./Fights.css";

const FlightSearchForm = () => {
  const [tripType, setTripType] = useState("one-way");
  const [fromCity, setFromCity] = useState("New York (JFK)");
  const [toCity, setToCity] = useState("London (LHR)");
  const [departureDate, setDepartureDate] = useState("2024-06-15");
  const [returnDate, setReturnDate] = useState("2024-06-20");
  const [passengers, setPassengers] = useState("2");
  const [multiCityFlights, setMultiCityFlights] = useState([
    { from: "", to: "", date: "" },
  ]);
  // const cleanCity = (value) => {
  //   return value.split("(")[0].trim();
  // };

  const cleanCode = (value) => {
    const match = value.match(/\((.*?)\)/);
    return match ? match[1] : value;
  };

  const handleSearchFlights = async () => {
    const from = cleanCode(fromCity); // JFK
    const to = cleanCode(toCity); // LHR

    const response = await fetch(
      `http://localhost:5000/api/flights/search?from=${from}&to=${to}&departureDate=${departureDate}&passengers=${passengers}`,
    );

    const data = await response.json();
    console.log("✈ Flights Found:", data.flights);
  };

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const addMultiCityFlight = () => {
    if (multiCityFlights.length < 4) {
      setMultiCityFlights([
        ...multiCityFlights,
        { from: "", to: "", date: "" },
      ]);
    }
  };

  const removeMultiCityFlight = (index) => {
    if (multiCityFlights.length > 1) {
      const updatedFlights = multiCityFlights.filter((_, i) => i !== index);
      setMultiCityFlights(updatedFlights);
    }
  };

  const updateMultiCityFlight = (index, field, value) => {
    const updatedFlights = [...multiCityFlights];
    updatedFlights[index][field] = value;
    setMultiCityFlights(updatedFlights);
  };

  return (
    <div className="new-hero-image">
      <div className="new-hero-card">
        <div className="new-hero-card-header">
          <h3>Quick Flight Search</h3>
          <p>Find the best deals in seconds</p>
        </div>

        <div className="new-hero-card-content">
          <div className="new-trip-type-tabs">
            <button
              className={`new-trip-tab ${tripType === "one-way" ? "active" : ""}`}
              onClick={() => setTripType("one-way")}
            >
              <i className="fas fa-arrow-right"></i>
              One Way
            </button>
            <button
              className={`new-trip-tab ${tripType === "round-trip" ? "active" : ""}`}
              onClick={() => setTripType("round-trip")}
            >
              <i className="fas fa-exchange-alt"></i>
              Round Trip
            </button>
            <button
              className={`new-trip-tab ${tripType === "multi-city" ? "active" : ""}`}
              onClick={() => setTripType("multi-city")}
            >
              <i className="fas fa-sitemap"></i>
              Multi City
            </button>
          </div>

          <div className="new-search-form">
            {(tripType === "one-way" || tripType === "round-trip") && (
              <>
                <div className="new-cities-container">
                  <div className="new-city-input-group">
                    <div className="new-city-input-header">
                      <i className="fas fa-plane-departure"></i>
                      <span>From</span>
                    </div>
                    <input
                      type="text"
                      className="new-city-input"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                    />
                  </div>

                  <button
                    className="new-swap-button"
                    onClick={handleSwapCities}
                    type="button"
                    title="Swap cities"
                  >
                    <i className="fas fa-exchange-alt"></i>
                  </button>

                  <div className="new-city-input-group">
                    <div className="new-city-input-header">
                      <i className="fas fa-plane-arrival"></i>
                      <span>To</span>
                    </div>
                    <input
                      type="text"
                      className="new-city-input"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="new-dates-container">
                  <div className="new-date-input-group">
                    <div className="new-date-header">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Departure</span>
                    </div>
                    <input
                      type="date"
                      className="new-date-input"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>

                  {tripType === "round-trip" && (
                    <div className="new-date-input-group">
                      <div className="new-date-header">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Return</span>
                      </div>
                      <input
                        type="date"
                        className="new-date-input"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departureDate}
                      />
                    </div>
                  )}

                  <div className="new-passenger-input-group">
                    <div className="new-passenger-header">
                      <i className="fas fa-user-friends"></i>
                      <span>Passengers</span>
                    </div>
                    <select
                      className="new-passenger-select"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                    >
                      <option value="1">1 Passenger</option>
                      <option value="2">2 Passengers</option>
                      <option value="3">3 Passengers</option>
                      <option value="4">4 Passengers</option>
                      <option value="5">5 Passengers</option>
                      <option value="6+">6+ Passengers</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {tripType === "multi-city" && (
              <div className="new-multi-city-form">
                {multiCityFlights.map((flight, index) => (
                  <div key={index} className="new-multi-city-row">
                    <div className="new-multi-city-inputs">
                      <div className="new-multi-city-group">
                        <div className="new-city-input-header">
                          <i className="fas fa-plane-departure"></i>
                          <span>From</span>
                        </div>
                        <input
                          type="text"
                          className="new-city-input"
                          placeholder="City"
                          value={flight.from}
                          onChange={(e) =>
                            updateMultiCityFlight(index, "from", e.target.value)
                          }
                        />
                      </div>
                      <div className="new-multi-city-group">
                        <div className="new-city-input-header">
                          <i className="fas fa-plane-arrival"></i>
                          <span>To</span>
                        </div>
                        <input
                          type="text"
                          className="new-city-input"
                          placeholder="City"
                          value={flight.to}
                          onChange={(e) =>
                            updateMultiCityFlight(index, "to", e.target.value)
                          }
                        />
                      </div>
                      <div className="new-multi-city-group">
                        <div className="new-date-header">
                          <i className="fas fa-calendar-alt"></i>
                          <span>Date</span>
                        </div>
                        <input
                          type="date"
                          className="new-date-input"
                          value={flight.date}
                          onChange={(e) =>
                            updateMultiCityFlight(index, "date", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        className="new-remove-flight"
                        onClick={() => removeMultiCityFlight(index)}
                        type="button"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}

                {multiCityFlights.length < 4 && (
                  <button
                    className="new-add-flight-btn"
                    onClick={addMultiCityFlight}
                    type="button"
                  >
                    <i className="fas fa-plus"></i> Add Another Flight
                  </button>
                )}

                <div className="new-passenger-input-group">
                  <div className="new-passenger-header">
                    <i className="fas fa-user-friends"></i>
                    <span>Passengers</span>
                  </div>
                  <select
                    className="new-passenger-select"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Passengers</option>
                    <option value="5">5 Passengers</option>
                    <option value="6+">6+ Passengers</option>
                  </select>
                </div>
              </div>
            )}

            <button className="new-search-button" onClick={handleSearchFlights}>
              <i className="fas fa-search"></i>
              <span>Search Flights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;
