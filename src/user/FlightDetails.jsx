import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FlightDetails = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    stops: "all",
    airlines: [],
    departureTime: "all",
    arrivalTime: "all",
  }); 
  const location = useLocation();
  const flights = location.state?.flights || [];
  const searchData = location.state?.searchData;

  const airlines = [...new Set(flights.map((f) => f.airline?.airline_name))];

  // Stops helper function
  const getStopsValue = (flight) => {
    if (!flight || flight.stops === undefined || flight.stops === null) {
      return 0;
    }
    return Number(flight.stops);
  };

  const filteredFlights = flights.filter((flight) => {
    const stops = getStopsValue(flight);

    // Price filter
    if (
      flight.price < filters.priceRange[0] ||
      flight.price > filters.priceRange[1]
    )
      return false;

    // Stops filter
    if (filters.stops !== "all") {
      if (filters.stops === "nonstop" && stops !== 0) return false;
      if (filters.stops === "1stop" && stops !== 1) return false;
      if (filters.stops === "2plus" && stops < 2) return false;
    }

    // Airlines filter
    if (
      filters.airlines.length > 0 &&
      !filters.airlines.includes(flight.airline?.airline_name)
    )
      return false;

    return true;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStopText = (stops) => {
    if (stops === 0) return "Non Stop";
    if (stops === 1) return "1 Stop";
    return `${stops} Stops`;
  };

  const getStopBadgeColor = (stops) => {
    if (stops === 0) return "success";
    if (stops === 1) return "warning";
    return "danger";
  };
  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const getStops = (flight) => {
    return typeof flight.stops === "number" ? flight.stops : 0;
  };

  return (
    <div
      className="container-fluid py-4 px-3 px-md-4 mt-3"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* Header with Back Button */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-light me-3 rounded-circle p-3 shadow-sm"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/user/search");
            }
          }}
        >
          <i className="fas fa-arrow-left text-primary"></i>
        </button>
        <div>
          <h4 className="fw-bold mb-1">
            {searchData?.from?.city} to {searchData?.to?.city}
          </h4>
          <p className="text-muted mb-0">
            {new Date(searchData?.departDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            <span className="mx-3">|</span>
            <i className="fas fa-users me-2"></i>1 Adult, 0 Children, 0 Infants
            <span className="mx-3">|</span>
            <i className="fas fa-chair me-2"></i>
            Economy
          </p>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm border-0 rounded-4 filter-sticky">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  <i className="fas fa-sliders-h me-2 text-primary"></i>
                  Filters
                </h5>
                <button
                  className="btn btn-link text-primary text-decoration-none p-0"
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 50000],
                      stops: "all",
                      airlines: [],
                      departureTime: "all",
                      arrivalTime: "all",
                    })
                  }
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* Price Range */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Range</h6>
                <div className="px-2">
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="50000"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [0, parseInt(e.target.value)],
                      })
                    }
                  />
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">{formatPrice(0)}</span>
                    <span className="fw-bold text-primary">
                      {formatPrice(filters.priceRange[1])}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stops Filter */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Stops</h6>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "nonstop", label: "Non Stop" },
                    { value: "1stop", label: "1 Stop" },
                    { value: "2plus", label: "2+ Stops" },
                  ].map((stop) => (
                    <button
                      key={stop.value}
                      className={`btn btn-sm rounded-pill ${
                        filters.stops === stop.value
                          ? "btn-primary text-white"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFilters({ ...filters, stops: stop.value })
                      }
                    >
                      {stop.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Airlines Filter */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Airlines</h6>
                {airlines.map((airline) => (
                  <div key={airline} className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`airline-${airline}`}
                      checked={filters.airlines.includes(airline)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({
                            ...filters,
                            airlines: [...filters.airlines, airline],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            airlines: filters.airlines.filter(
                              (a) => a !== airline,
                            ),
                          });
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`airline-${airline}`}
                    >
                      {airline}
                    </label>
                  </div>
                ))}
              </div>

              {/* Departure Time */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Departure Time</h6>
                <select
                  className="form-select"
                  value={filters.departureTime}
                  onChange={(e) =>
                    setFilters({ ...filters, departureTime: e.target.value })
                  }
                >
                  <option value="all">Anytime</option>
                  <option value="morning">Morning (6AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 6PM)</option>
                  <option value="evening">Evening (6PM - 12AM)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="col-lg-9">
          {/* Results Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">
                {filteredFlights.length} Flights Found
              </h5>
              <p className="text-muted mb-0">Prices include taxes & fees</p>
            </div>
            <select className="form-select w-auto">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Duration: Shortest</option>
              <option>Departure: Earliest</option>
            </select>
          </div>

          {/* Flight Cards */}
          <div className="row g-4">
            {filteredFlights.map((flight) => (
              <div key={flight._id} className="col-12">
                <div
                  className={`card border-0 shadow-sm rounded-4 hover-shadow transition-all ${
                    selectedFlight === flight._id
                      ? "border border-primary border-2"
                      : ""
                  }`}
                >
                  <div className="card-body p-4">
                    {/* Airline & Price Row */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-3 me-3">
                          <i className="fas fa-plane text-primary fs-4"></i>
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">
                            {flight.airline?.airline_name}
                          </h5>
                          <p className="text-muted mb-0">
                            {flight.flight_number} • {flight.aircraft_type}
                          </p>
                        </div>
                      </div>
                      <div className="text-end">
                        <h4 className="fw-bold text-primary mb-1">
                          {formatPrice(flight.price)}
                        </h4>
                        <span
                          className={`badge bg-${flight.refundable ? "success" : "warning"} bg-opacity-10 text-${flight.refundable ? "success" : "warning"}`}
                        >
                          {flight.refundable ? "Refundable" : "Non-refundable"}
                        </span>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="row align-items-center">
                      {/* From - To Times */}
                      <div className="col-md-8">
                        <div className="d-flex align-items-center">
                          {/* Departure */}
                          <div
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            <h3 className="fw-bold mb-0">
                              {new Date(
                                flight.departure_time,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </h3>
                            <p className="text-muted mb-0 small">
                              {flight.departureDate}
                            </p>
                            <p className="fw-semibold mb-0">
                              {flight.from_airport?.city}
                            </p>
                          </div>

                          {/* Flight Line */}
                          <div className="flex-grow-1 mx-3">
                            <div className="position-relative">
                              <hr className="border-2 border-top" />
                              <div className="position-absolute top-0 start-50 translate-middle">
                                <span
                                  className={`badge bg-${getStopBadgeColor(getStops(flight))} bg-opacity-10 text-${getStopBadgeColor(getStops(flight))} rounded-pill px-3 py-2`}
                                >
                                  {getStopText(getStops(flight))}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                              <span className="small text-muted">
                                {formatDuration(flight.duration)}
                              </span>
                              {flight.stopCity && (
                                <span className="small text-muted">
                                  via {flight.stopCity}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrival */}
                          <div
                            className="text-center"
                            style={{ minWidth: "100px" }}
                          >
                            <h3 className="fw-bold mb-0">
                              {new Date(flight.arrival_time).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </h3>
                            <p className="text-muted mb-0 small">
                              {flight.arrivalDate}
                            </p>
                            <p className="fw-semibold mb-0">
                              {flight.to_airport?.city}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Baggage & Amenities */}
                      <div className="col-md-2">
                        <div className="border-start ps-3">
                          {/* <div className="mb-2">
                            <i className="fas fa-suitcase text-primary me-2"></i>
                            <span className="small">{flight.baggage}</span>
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-utensils text-primary me-2"></i>
                            <span className="small">
                              {flight.mealsIncluded ? "Meals" : "No Meals"}
                            </span>
                          </div> */}
                          <div>
                            <i className="fas fa-chair text-primary me-2"></i>
                            <span className="small">
                              {flight.seats_available} seats
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Select Button */}
                      <div className="col-md-2">
                        <button
                          className={`btn w-100 py-3 rounded-pill fw-bold ${
                            selectedFlight === flight._id
                              ? "btn-primary text-white"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => {
                            setSelectedFlight(flight._id);
                            localStorage.setItem(
                              "selectedFlight",
                              JSON.stringify(flight),
                            );
                          }}
                        >
                          {selectedFlight === flight._id
                            ? "Selected"
                            : "Select"}
                        </button>
                      </div>
                    </div>

                    {/* Flight Details Accordion */}
                    <div className="mt-3">
                      <button
                        className="btn btn-link text-decoration-none text-primary p-0"
                        data-bs-toggle="collapse"
                        data-bs-target={`#details-${flight._id}`}
                      >
                        <i className="fas fa-chevron-down me-2"></i>
                        View Flight Details
                      </button>

                      <div
                        className="collapse mt-3"
                        id={`details-${flight._id}`}
                      >
                        <div className="card card-body bg-light border-0">
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-3">
                                Flight Information
                              </h6>
                              <table className="table table-sm">
                                <tr>
                                  <td className="text-muted border-0">
                                    Aircraft:
                                  </td>
                                  <td className="fw-semibold border-0">
                                    {flight.aircraft_type}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted">Cabin Class:</td>
                                  <td className="fw-semibold">Economy</td>
                                </tr>
                                <tr>
                                  <td className="text-muted">
                                    Seats Available:
                                  </td>
                                  <td className="fw-semibold">
                                    {flight.seats_available}
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-3">
                                Baggage Allowance
                              </h6>
                              <table className="table table-sm">
                                <tr>
                                  <td className="text-muted border-0">
                                    Check-in:
                                  </td>
                                  <td className="fw-semibold border-0">
                                    {flight.baggage}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted">Cabin:</td>
                                  <td className="fw-semibold">
                                    {flight.cabinBaggage}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-muted">Meals:</td>
                                  <td className="fw-semibold">
                                    {flight.mealsIncluded
                                      ? "Included"
                                      : "Not Included"}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          {selectedFlight && (
            <div className="position-fixed bottom-0 end-0 m-4 z-3">
              <button
                className="btn btn-primary btn-lg rounded-pill shadow-lg px-5"
                onClick={() => navigate("/user/bookings")}
              >
                Continue to Booking
                <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
