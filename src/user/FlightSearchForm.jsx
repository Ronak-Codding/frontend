import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("roundtrip");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState("economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [validated, setValidated] = useState(false);

  // Multi City flights state
  const [multiCityFlights, setMultiCityFlights] = useState([
    { id: 1, from: "", to: "", departDate: "" },
  ]);

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  const updatePassengers = (type, operation) => {
    setPassengers((prev) => {
      const newCount =
        operation === "increase" ? prev[type] + 1 : prev[type] - 1;
      if (type === "adults" && newCount < 1) return prev;
      if (newCount < 0) return prev;
      if (type === "infants" && newCount > prev.adults) return prev;
      return { ...prev, [type]: newCount };
    });
  };

  // Add new flight for multi city
  const addNewFlight = () => {
    setMultiCityFlights([
      ...multiCityFlights,
      { id: multiCityFlights.length + 1, from: "", to: "", departDate: "" },
    ]);
  };

  // Remove flight for multi city
  const removeFlight = (id) => {
    if (multiCityFlights.length > 1) {
      setMultiCityFlights(
        multiCityFlights.filter((flight) => flight.id !== id)
      );
    }
  };

  // Update multi city flight data
  const updateFlight = (id, field, value) => {
    setMultiCityFlights(
      multiCityFlights.map((flight) =>
        flight.id === id ? { ...flight, [field]: value } : flight
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      // Handle form submission
      console.log("Form submitted", {
        tripType,
        passengers,
        cabinClass,
        multiCityFlights: tripType === "multicity" ? multiCityFlights : null,
      });
    }
  };

  // Custom styles
  const styles = {
    teal: {
      color: '#14b8a6'
    },
    tealBg: {
      backgroundColor: '#14b8a6'
    },
    tealLightBg: {
      backgroundColor: '#ccfbf1'
    },
    tealGradient: {
      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      border: 'none',
      boxShadow: '0 10px 20px rgba(20, 184, 166, 0.3)'
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 py-md-5">
      <div className="container">
        {/* Main Search Card */}
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Trip Type Tabs */}
              <div className="card-header bg-light border-0 p-3 p-md-4">
                <div className="row g-2">
                  <div className="col-12 col-md-4">
                    <button
                      className={`w-100 py-3 fw-semibold rounded-3 border-0 ${
                        tripType === "roundtrip"
                          ? "text-white"
                          : "bg-white text-dark"
                      }`}
                      style={
                        tripType === "roundtrip"
                          ? { backgroundColor: "#14b8a6" }
                          : {}
                      }
                      onClick={() => setTripType("roundtrip")}
                    >
                      <i className="fas fa-exchange-alt me-2"></i>
                      Round Trip
                    </button>
                  </div>
                  <div className="col-12 col-md-4">
                    <button
                      className={`w-100 py-3 fw-semibold rounded-3 border-0 ${
                        tripType === "oneway"
                          ? "text-white"
                          : "bg-white text-dark"
                      }`}
                      style={
                        tripType === "oneway"
                          ? { backgroundColor: "#14b8a6" }
                          : {}
                      }
                      onClick={() => setTripType("oneway")}
                    >
                      <i className="fas fa-arrow-right me-2"></i>
                      One Way
                    </button>
                  </div>
                  <div className="col-12 col-md-4">
                    <button
                      className={`w-100 py-3 fw-semibold rounded-3 border-0 ${
                        tripType === "multicity"
                          ? "text-white"
                          : "bg-white text-dark"
                      }`}
                      style={
                        tripType === "multicity"
                          ? { backgroundColor: "#14b8a6" }
                          : {}
                      }
                      onClick={() => setTripType("multicity")}
                    >
                      <i className="fas fa-city me-2"></i>
                      Multi City
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                <form 
                  className={`${validated ? 'was-validated' : ''}`} 
                  noValidate 
                  onSubmit={handleSubmit}
                >
                  {/* Round Trip & One Way - From/To Fields */}
                  {(tripType === "roundtrip" || tripType === "oneway") && (
                    <div className="row g-3 mb-4">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="fw-semibold text-secondary mb-2 d-block">
                            <i className="fas fa-plane-departure me-2" style={styles.teal}></i>
                            From
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="fas fa-map-marker-alt" style={styles.teal}></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 py-3"
                              placeholder="New York (JFK)"
                              required
                            />
                            <div className="invalid-feedback">
                              Please enter departure city
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="fw-semibold text-secondary mb-2 d-block">
                            <i className="fas fa-plane-arrival me-2" style={styles.teal}></i>
                            To
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="fas fa-map-marker-alt" style={styles.teal}></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 py-3"
                              placeholder="London (LHR)"
                              required
                            />
                            <div className="invalid-feedback">
                              Please enter destination city
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multi City - Multiple Flight Fields */}
                  {tripType === "multicity" && (
                    <div className="mb-4">
                      {multiCityFlights.map((flight, index) => (
                        <div key={flight.id} className="card mb-3 border-0 bg-light">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="fw-bold mb-0">
                                Flight {index + 1}
                              </h6>
                              {multiCityFlights.length > 1 && (
                                <button
                                  className="btn btn-link text-danger p-0"
                                  onClick={() => removeFlight(flight.id)}
                                >
                                  <i className="fas fa-times"></i> Remove
                                </button>
                              )}
                            </div>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label className="small text-secondary d-block">From</label>
                                  <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white">
                                      <i className="fas fa-plane-departure" style={styles.teal}></i>
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="New York (JFK)"
                                      value={flight.from}
                                      onChange={(e) =>
                                        updateFlight(
                                          flight.id,
                                          "from",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label className="small text-secondary d-block">To</label>
                                  <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white">
                                      <i className="fas fa-plane-arrival" style={styles.teal}></i>
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="London (LHR)"
                                      value={flight.to}
                                      onChange={(e) =>
                                        updateFlight(
                                          flight.id,
                                          "to",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label className="small text-secondary d-block">Depart</label>
                                  <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white">
                                      <i className="fas fa-calendar-alt" style={styles.teal}></i>
                                    </span>
                                    <input
                                      type="date"
                                      className="form-control"
                                      value={flight.departDate}
                                      onChange={(e) =>
                                        updateFlight(
                                          flight.id,
                                          "departDate",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Flight Button */}
                      <button
                        className="btn w-100 py-2 mt-2"
                        style={{ borderColor: "#14b8a6", color: "#14b8a6" }}
                        onClick={addNewFlight}
                      >
                        <i className="fas fa-plus-circle me-2"></i>
                        Add New Flight
                      </button>
                    </div>
                  )}

                  {/* Dates, Passengers, Class Row */}
                  <div className="row g-3 mb-4">
                    {/* Depart Date - For Round Trip and One Way */}
                    {(tripType === "roundtrip" || tripType === "oneway") && (
                      <>
                        <div className={`col-md-6 ${tripType === "roundtrip" ? "col-lg-3" : "col-lg-4"}`}>
                          <div className="form-group">
                            <label className="fw-semibold text-secondary mb-2 d-block">
                              <i className="fas fa-calendar-alt me-2" style={styles.teal}></i>
                              Depart
                            </label>
                            <input
                              type="date"
                              className="form-control py-3"
                              required
                            />
                            <div className="invalid-feedback">
                              Please select departure date
                            </div>
                          </div>
                        </div>

                        {/* Return Date - Only for round trip */}
                        {tripType === "roundtrip" && (
                          <div className="col-md-6 col-lg-3">
                            <div className="form-group">
                              <label className="fw-semibold text-secondary mb-2 d-block">
                                <i className="fas fa-calendar-check me-2" style={styles.teal}></i>
                                Return
                              </label>
                              <input
                                type="date"
                                className="form-control py-3"
                                required
                              />
                              <div className="invalid-feedback">
                                Please select return date
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Passengers Dropdown */}
                    <div
                      className={`col-md-6 ${
                        tripType === "roundtrip"
                          ? "col-lg-3"
                          : tripType === "oneway"
                          ? "col-lg-4"
                          : tripType === "multicity"
                          ? "col-lg-6"
                          : "col-lg-3"
                      }`}
                    >
                      <div className="form-group position-relative">
                        <label className="fw-semibold text-secondary mb-2 d-block">
                          <i className="fas fa-users me-2" style={styles.teal}></i>
                          Passengers
                        </label>
                        <button
                          className="w-100 py-3 d-flex align-items-center justify-content-between bg-white border rounded-3"
                          onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                          type="button"
                        >
                          <span>
                            <i className="fas fa-user me-2" style={styles.teal}></i>
                            {totalPassengers}{" "}
                            {totalPassengers === 1
                              ? "Passenger"
                              : "Passengers"}
                          </span>
                          <i className={`fas fa-chevron-down ${showPassengerDropdown ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Passenger Dropdown Menu */}
                        {showPassengerDropdown && (
                          <>
                            <div 
                              className="position-fixed top-0 start-0 w-100 h-100"
                              style={{ zIndex: 1040 }}
                              onClick={() => setShowPassengerDropdown(false)}
                            />
                            <div className="position-absolute w-100 mt-2 p-3 bg-white shadow-lg border-0 rounded-3" style={{ zIndex: 1050 }}>
                              {/* Adults */}
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                  <h6 className="mb-0 fw-bold">Adults</h6>
                                  <small className="text-secondary">
                                    12+ years
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    onClick={() => updatePassengers("adults", "decrease")}
                                    type="button"
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>
                                  <span className="fw-bold px-2">
                                    {passengers.adults}
                                  </span>
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    onClick={() => updatePassengers("adults", "increase")}
                                    type="button"
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                              </div>

                              {/* Children */}
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                  <h6 className="mb-0 fw-bold">Children</h6>
                                  <small className="text-secondary">
                                    2-11 years
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    onClick={() => updatePassengers("children", "decrease")}
                                    type="button"
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>
                                  <span className="fw-bold px-2">
                                    {passengers.children}
                                  </span>
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    onClick={() => updatePassengers("children", "increase")}
                                    type="button"
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                              </div>

                              {/* Infants */}
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h6 className="mb-0 fw-bold">Infants</h6>
                                  <small className="text-secondary">
                                    Under 2
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    onClick={() => updatePassengers("infants", "decrease")}
                                    type="button"
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>
                                  <span className="fw-bold px-2">
                                    {passengers.infants}
                                  </span>
                                  <button
                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                    onClick={() => updatePassengers("infants", "increase")}
                                    type="button"
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                              </div>

                              <hr className="my-3" />
                              <button
                                className="btn w-100 text-white"
                                style={{ backgroundColor: "#14b8a6", borderColor: "#14b8a6" }}
                                onClick={() => setShowPassengerDropdown(false)}
                                type="button"
                              >
                                Done
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Class Dropdown */}
                    <div
                      className={`col-md-6 ${
                        tripType === "roundtrip"
                          ? "col-lg-3"
                          : tripType === "oneway"
                          ? "col-lg-4"
                          : tripType === "multicity"
                          ? "col-lg-6"
                          : "col-lg-3"
                      }`}
                    >
                      <div className="form-group position-relative">
                        <label className="fw-semibold text-secondary mb-2 d-block">
                          <i className="fas fa-crown me-2" style={styles.teal}></i>
                          Class
                        </label>
                        <button
                          className="w-100 py-3 d-flex align-items-center justify-content-between bg-white border rounded-3"
                          onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                          type="button"
                        >
                          <span>
                            <i className="fas fa-crown me-2" style={styles.teal}></i>
                            <span className="text-capitalize">
                              {cabinClass}
                            </span>{" "}
                            Class
                          </span>
                          <i className={`fas fa-chevron-down ${showCabinDropdown ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Cabin Dropdown Menu */}
                        {showCabinDropdown && (
                          <>
                            <div 
                              className="position-fixed top-0 start-0 w-100 h-100"
                              style={{ zIndex: 1040 }}
                              onClick={() => setShowCabinDropdown(false)}
                            />
                            <div className="position-absolute w-100 mt-2 bg-white shadow-lg border-0 rounded-3 overflow-hidden" style={{ zIndex: 1050 }}>
                              {[
                                {
                                  value: "economy",
                                  label: "Economy Class",
                                  icon: "fa-chair",
                                },
                                {
                                  value: "premium",
                                  label: "Premium Economy",
                                  icon: "fa-couch",
                                },
                                {
                                  value: "business",
                                  label: "Business Class",
                                  icon: "fa-briefcase",
                                },
                                {
                                  value: "first",
                                  label: "First Class",
                                  icon: "fa-gem",
                                },
                              ].map((cabin) => (
                                <button
                                  key={cabin.value}
                                  className={`d-flex align-items-center gap-3 w-100 text-start px-3 py-3 border-0 bg-transparent ${
                                    cabinClass === cabin.value
                                      ? "bg-teal-50"
                                      : ""
                                  }`}
                                  style={cabinClass === cabin.value ? { backgroundColor: '#ccfbf1' } : {}}
                                  onClick={() => {
                                    setCabinClass(cabin.value);
                                    setShowCabinDropdown(false);
                                  }}
                                  type="button"
                                >
                                  <i className={`fas ${cabin.icon}`} style={styles.teal}></i>
                                  <span className="fw-medium">{cabin.label}</span>
                                  {cabinClass === cabin.value && (
                                    <i className="fas fa-check ms-auto" style={styles.teal}></i>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="row mt-4">
                    <div className="col">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3 fw-semibold border-0 text-white"
                        style={styles.tealGradient}
                      >
                        <i className="fas fa-search me-2"></i>
                        Search Flights
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional styles */}
      <style jsx>{`
        .rotate-180 {
          transform: rotate(180deg);
          transition: transform 0.3s;
        }
        .bg-teal-50 {
          background-color: #ccfbf1;
        }
      `}</style>
    </div>
  );
};

export default FlightSearch;