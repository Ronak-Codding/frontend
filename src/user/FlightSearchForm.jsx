import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AirportAutocomplete from "../components/AirportAutocomplete";
import "./FlightSearch.css";

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("roundtrip");

  //  Airport Selection State
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);

  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [cabinClass, setCabinClass] = useState("economy");
  const [validated, setValidated] = useState(false);

  // Multi City
  const [multiCityFlights, setMultiCityFlights] = useState([
    { id: 1, from: null, to: null, departDate: "" },
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

  const updateMultiCityAirport = (id, field, airport) => {
    setMultiCityFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, [field]: airport._id } : flight,
      ),
    );
  };

  const updateMultiCityDate = (id, date) => {
    setMultiCityFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, departDate: date } : flight,
      ),
    );
  };

  const addNewFlight = () => {
    setMultiCityFlights([
      ...multiCityFlights,
      {
        id: multiCityFlights.length + 1,
        from: null,
        to: null,
        departDate: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!fromAirport || !toAirport) {
      alert("Please select From and To airports");
      return;
    }

    if (!departDate) {
      alert("Please select departure date");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/flights/public-search",
        {
          params: {
            from: fromAirport._id, // IMPORTANT: must send ID
            to: toAirport._id,
            date: departDate,
          },
        },
      );

      const flights = response.data;

      if (!flights.length) {
        alert("No flights found for selected route/date");
        return;
      }

      navigate("/user/flight-details", {
        state: {
          flights,
          searchData: {
            from: fromAirport,
            to: toAirport,
            departDate,
            returnDate,
            passengers,
            cabinClass,
          },
        },
      });
    } catch (error) {
      console.error("Flight search error:", error);
      alert("Something went wrong while searching flights");
    }
  };

  const swapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  return (
    <div className="container">
      <div className="card shadow-lg p-4 rounded-4">
        <h4 className="fw-bold mb-4 text-center">
          <i className="fas fa-plane me-2 text-info"></i>
          Search Flights
        </h4>

        {/* Trip Type Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {["roundtrip", "oneway", "multicity"].map((type) => (
            <button
              key={type}
              className={`btn ${
                tripType === type ? "btn-info text-white" : "btn-outline-info"
              }`}
              onClick={() => setTripType(type)}
              type="button"
            >
              {type === "roundtrip" && "ROUND TRIP"}
              {type === "oneway" && "ONE WAY"}
              {type === "multicity" && "MULTI CITY"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className={validated ? "was-validated" : ""}
        >
          {/* Round Trip & One Way */}
          {(tripType === "roundtrip" || tripType === "oneway") && (
            <div className="row g-3 mb-4">
              <div className="col-md-5">
                <AirportAutocomplete
                  label="From"
                  icon="fa-plane-departure"
                  required
                  value={fromAirport}
                  onSelect={(airport) => setFromAirport(airport)}
                />
              </div>

              {/* Swap Button */}
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                <button
                  type="button"
                  className="btn btn-light rounded-circle shadow"
                  onClick={swapAirports}
                  style={{
                    width: "55px",
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-exchange-alt text-info"></i>
                </button>
              </div>

              <div className="col-md-5">
                <AirportAutocomplete
                  label="To"
                  icon="fa-plane-arrival"
                  required
                  value={toAirport}
                  onSelect={(airport) => setToAirport(airport)}
                />
                {/* {toAirport && (
                  <small className="text-muted">
                    {toAirport.city || toAirport.name} ({toAirport.code})
                  </small>
                )} */}
              </div>

              <div className="col-md-6">
                <label className="fw-semibold">Depart</label>
                <input
                  type="date"
                  className="form-control py-3"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {tripType === "roundtrip" && (
                <div className="col-md-6">
                  <label className="fw-semibold">Return</label>
                  <input
                    type="date"
                    className="form-control py-3"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departDate || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Multi City */}
          {tripType === "multicity" &&
            multiCityFlights.map((flight, index) => (
              <div key={flight.id} className="card p-3 mb-3 bg-light">
                <h6 className="fw-bold">Flight {index + 1}</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <AirportAutocomplete
                      label="From"
                      icon="fa-plane-departure"
                      required
                      onSelect={(airport) =>
                        updateMultiCityAirport(flight.id, "from", airport)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <AirportAutocomplete
                      label="To"
                      icon="fa-plane-arrival"
                      required
                      onSelect={(airport) =>
                        updateMultiCityAirport(flight.id, "to", airport)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold">Depart</label>
                    <input
                      type="date"
                      className="form-control py-3"
                      value={flight.departDate}
                      onChange={(e) =>
                        updateMultiCityDate(flight.id, e.target.value)
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

          {tripType === "multicity" && (
            <button
              className="btn btn-outline-info w-100 mb-3"
              type="button"
              onClick={addNewFlight}
            >
              + Add Flight
            </button>
          )}

          {/* Passenger + Class */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="fw-semibold">Passengers</label>

              <div className="border rounded p-3">
                {/* Adults */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Adults</strong>
                    <div className="text-muted small">12+ years</div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updatePassengers("adults", "decrease")}
                    >
                      -
                    </button>

                    <span className="fw-bold">{passengers.adults}</span>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updatePassengers("adults", "increase")}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Children</strong>
                    <div className="text-muted small">2-11 years</div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updatePassengers("children", "decrease")}
                    >
                      -
                    </button>

                    <span className="fw-bold">{passengers.children}</span>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updatePassengers("children", "increase")}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Infants</strong>
                    <div className="text-muted small">Below 2 years</div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updatePassengers("infants", "decrease")}
                    >
                      -
                    </button>

                    <span className="fw-bold">{passengers.infants}</span>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updatePassengers("infants", "increase")}
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr />
                <div className="text-end fw-bold">
                  Total: {totalPassengers} Passenger(s)
                </div>
              </div>
            </div>

            {/* Cabin Class */}
            <div className="col-md-6">
              <label className="fw-semibold">Cabin Class</label>
              <select
                className="form-select py-3"
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 py-3 text-white fw-bold"
          >
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlightSearch;
