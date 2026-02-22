import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState("economy");
  const [showLegend, setShowLegend] = useState(true);

  // Sample passenger data (from previous step)
  const passengers = [
    { id: 1, name: "Mr. Rahul Sharma", type: "adult", age: 32 },
    { id: 2, name: "Mrs. Priya Sharma", type: "adult", age: 28 },
    { id: 3, name: "Master. Arjun Sharma", type: "child", age: 7 },
  ];

  // Generate seat map data
  const generateSeats = () => {
    const rows = 30;
    const seatsPerRow = 6;
    const seats = [];
    
    const specialSeats = {
      emergency: [1, 12, 13, 29], // Emergency exit rows
      extraLegroom: [1, 12, 13, 14, 28, 29], // Extra legroom rows
      nearRestroom: [15, 16, 17, 27, 28, 29], // Near restrooms
    };

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatLetter = String.fromCharCode(64 + col); // A, B, C, D, E, F
        const seatNumber = `${row}${seatLetter}`;
        
        // Determine seat status (booked/available/unavailable)
        let status = "available";
        
        // Randomly book some seats (simulate already booked)
        if (Math.random() < 0.3 && row > 5 && row < 25) {
          status = "booked";
        }
        
        // Some seats are unavailable (like missing seats on some rows)
        if ((row === 13 && col === 3) || (row === 14 && col === 4)) {
          status = "unavailable";
        }

        // Determine seat features
        const features = [];
        if (col === 1 || col === 6) features.push("window");
        if (col === 3 || col === 4) features.push("aisle");
        if (col === 2 || col === 5) features.push("middle");
        if (specialSeats.emergency.includes(row)) features.push("emergency");
        if (specialSeats.extraLegroom.includes(row)) features.push("extralegroom");
        if (specialSeats.nearRestroom.includes(row)) features.push("nearRestroom");
        
        // Price variation based on features
        let price = 999;
        if (features.includes("extralegroom")) price = 2499;
        if (features.includes("emergency")) price = 1999;
        if (row <= 5) price = 1499; // Front rows premium
        
        seats.push({
          id: seatNumber,
          row,
          column: col,
          letter: seatLetter,
          status,
          features,
          price,
          passengerId: null, // Will be assigned when selected
        });
      }
    }
    return seats;
  };

  const [seats, setSeats] = useState(generateSeats());

  // Aircraft layout configuration
  const cabinLayout = {
    totalRows: 30,
    seatsPerRow: 6,
    exitRows: [1, 12, 13, 29],
    galleyRows: [6, 20],
    restroomRows: [15, 27],
  };

  const getSeatColor = (seat) => {
    if (selectedSeats.includes(seat.id)) return "btn-success";
    if (seat.status === "booked") return "btn-secondary";
    if (seat.status === "unavailable") return "btn-light";
    
    // Price-based coloring
    if (seat.price > 2000) return "btn-warning";
    if (seat.price > 1200) return "btn-info";
    return "btn-outline-primary";
  };

  const getSeatIcon = (seat) => {
    if (seat.features.includes("emergency")) return "🚨";
    if (seat.features.includes("extralegroom")) return "⬆️";
    if (seat.features.includes("nearRestroom")) return "🚻";
    if (seat.features.includes("window")) return "🪟";
    if (seat.features.includes("aisle")) return "🚶";
    return "💺";
  };

  const handleSeatClick = (seat) => {
    if (seat.status === "booked" || seat.status === "unavailable") return;
    
    // Check if seat already selected
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.id));
    } else {
      // Limit selection to number of passengers
      if (selectedSeats.length < passengers.length) {
        setSelectedSeats([...selectedSeats, seat.id]);
      } else {
        alert(`You can only select ${passengers.length} seats for ${passengers.length} passenger(s)`);
      }
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getSeatRecommendations = () => {
    const recommendations = [];
    const remainingSeats = passengers.length - selectedSeats.length;
    
    if (remainingSeats > 0) {
      // Find best available seats together
      for (let row = 1; row <= cabinLayout.totalRows; row++) {
        const rowSeats = seats.filter(s => s.row === row && s.status === "available");
        const availableInRow = rowSeats.length;
        
        if (availableInRow >= remainingSeats) {
          // Check for consecutive seats
          for (let i = 0; i <= rowSeats.length - remainingSeats; i++) {
            const consecutive = rowSeats.slice(i, i + remainingSeats);
            if (consecutive.every((s, idx) => idx === 0 || s.column === consecutive[idx-1].column + 1)) {
              recommendations.push({
                row,
                seats: consecutive.map(s => s.id),
                reason: "Seats together in same row"
              });
              break;
            }
          }
        }
      }
    }
    return recommendations.slice(0, 3);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {[
            { step: 1, label: "Flight", icon: "fa-plane" },
            { step: 2, label: "Passengers", icon: "fa-users" },
            { step: 3, label: "Seats", icon: "fa-chair", active: true },
            { step: 4, label: "Payment", icon: "fa-credit-card" },
            { step: 5, label: "Confirm", icon: "fa-check-circle" }
          ].map((item) => (
            <div key={item.step} className="text-center position-relative" style={{ width: '20%' }}>
              <div className={`rounded-circle p-3 mx-auto mb-2 ${
                item.active ? 'bg-primary' : item.step < 3 ? 'bg-success' : 'bg-light'
              }`} style={{ width: '50px', height: '50px' }}>
                <i className={`fas ${item.icon} ${
                  item.active || item.step < 3 ? 'text-white' : 'text-secondary'
                }`}></i>
              </div>
              <span className={`small fw-semibold d-none d-md-block ${
                item.active ? 'text-primary' : 'text-muted'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="progress" style={{ height: '3px' }}>
          <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
        </div>
      </div>

      <div className="row">
        {/* Seat Map - Left Side */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">
                  <i className="fas fa-chair text-primary me-2"></i>
                  Select Your Seats
                </h4>
                <button 
                  className="btn btn-outline-info btn-sm"
                  onClick={() => setShowLegend(!showLegend)}
                >
                  <i className="fas fa-info-circle me-2"></i>
                  {showLegend ? 'Hide' : 'Show'} Legend
                </button>
              </div>
              <p className="text-muted mb-0">
                Select {passengers.length - selectedSeats.length} more seat(s)
              </p>
            </div>

            {/* Legend */}
            {showLegend && (
              <div className="bg-light mx-4 mt-3 p-3 rounded-3">
                <div className="row g-3">
                  <div className="col-md-3 col-6">
                    <div className="d-flex align-items-center">
                      <div className="btn btn-success btn-sm me-2 disabled" style={{ width: '30px' }}>💺</div>
                      <span className="small">Selected</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="d-flex align-items-center">
                      <div className="btn btn-secondary btn-sm me-2 disabled" style={{ width: '30px' }}>💺</div>
                      <span className="small">Booked</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="d-flex align-items-center">
                      <div className="btn btn-warning btn-sm me-2 disabled" style={{ width: '30px' }}>⬆️</div>
                      <span className="small">Extra Legroom (+₹1500)</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="d-flex align-items-center">
                      <div className="btn btn-info btn-sm me-2 disabled" style={{ width: '30px' }}>🚨</div>
                      <span className="small">Emergency Exit</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="d-flex align-items-center">
                      <div className="btn btn-outline-primary btn-sm me-2 disabled" style={{ width: '30px' }}>🪟</div>
                      <span className="small">Window</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="d-flex align-items-center">
                      <div className="btn btn-outline-primary btn-sm me-2 disabled" style={{ width: '30px' }}>🚶</div>
                      <span className="small">Aisle</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cabin Tabs */}
            <div className="px-4 mt-3">
              <ul className="nav nav-pills">
                {["economy", "premium", "business"].map((cabin) => (
                  <li className="nav-item me-2" key={cabin}>
                    <button
                      className={`nav-link ${activeTab === cabin ? 'active' : ''}`}
                      onClick={() => setActiveTab(cabin)}
                    >
                      {cabin.charAt(0).toUpperCase() + cabin.slice(1)} Class
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aircraft Seat Map */}
            <div className="card-body p-4">
              {/* Aircraft Header */}
              <div className="text-center mb-4">
                <div className="d-inline-block bg-light rounded-pill px-4 py-2">
                  <i className="fas fa-plane-departure me-2 text-primary"></i>
                  <span className="fw-bold">Front of Aircraft</span>
                  <i className="fas fa-arrow-right ms-2 text-primary"></i>
                </div>
              </div>

              {/* Seat Map Grid */}
              <div className="seat-map-container">
                {/* Aisle Labels */}
                <div className="row mb-2">
                  <div className="col-12">
                    <div className="d-flex justify-content-center gap-4">
                      <div className="text-center" style={{ width: '60px' }}>A</div>
                      <div className="text-center" style={{ width: '60px' }}>B</div>
                      <div className="text-center" style={{ width: '60px' }}>C</div>
                      <div className="text-center" style={{ width: '20px' }}></div>
                      <div className="text-center" style={{ width: '60px' }}>D</div>
                      <div className="text-center" style={{ width: '60px' }}>E</div>
                      <div className="text-center" style={{ width: '60px' }}>F</div>
                    </div>
                  </div>
                </div>

                {/* Seat Rows */}
                {Array.from({ length: cabinLayout.totalRows }, (_, i) => i + 1).map((row) => (
                  <div key={row} className="row mb-2 align-items-center">
                    {/* Row Number */}
                    <div className="col-1">
                      <span className="fw-bold text-muted">{row}</span>
                    </div>

                    {/* Seats */}
                    <div className="col-11">
                      <div className="d-flex justify-content-center gap-2">
                        {[1, 2, 3].map((col) => {
                          const seat = seats.find(s => s.row === row && s.column === col);
                          if (!seat) return null;
                          return (
                            <button
                              key={seat.id}
                              className={`btn ${getSeatColor(seat)} seat-btn`}
                              style={{ width: '60px', height: '60px' }}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status === "booked" || seat.status === "unavailable"}
                              title={`${seat.id} - ₹${seat.price} - ${seat.features.join(', ')}`}
                            >
                              <div className="small">{getSeatIcon(seat)}</div>
                              <div className="small fw-bold">{seat.id}</div>
                            </button>
                          );
                        })}

                        {/* Aisle */}
                        <div style={{ width: '20px' }}></div>

                        {[4, 5, 6].map((col) => {
                          const seat = seats.find(s => s.row === row && s.column === col);
                          if (!seat) return null;
                          return (
                            <button
                              key={seat.id}
                              className={`btn ${getSeatColor(seat)} seat-btn`}
                              style={{ width: '60px', height: '60px' }}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status === "booked" || seat.status === "unavailable"}
                              title={`${seat.id} - ₹${seat.price} - ${seat.features.join(', ')}`}
                            >
                              <div className="small">{getSeatIcon(seat)}</div>
                              <div className="small fw-bold">{seat.id}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exit/Galley Indicators */}
                    {cabinLayout.exitRows.includes(row) && (
                      <div className="position-absolute start-50 translate-middle-x mt-4">
                        <span className="badge bg-warning text-dark">Emergency Exit</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Aircraft Footer */}
              <div className="text-center mt-4">
                <div className="d-inline-block bg-light rounded-pill px-4 py-2">
                  <i className="fas fa-arrow-left me-2 text-primary"></i>
                  <span className="fw-bold">Rear of Aircraft</span>
                  <i className="fas fa-plane-arrival ms-2 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Summary - Right Side */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 sticky-lg-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white border-0 rounded-top-4 p-4">
              <h5 className="fw-bold mb-0">Seat Summary</h5>
            </div>

            <div className="card-body p-4">
              {/* Selected Seats */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Selected Seats ({selectedSeats.length})</h6>
                {selectedSeats.length > 0 ? (
                  <div className="row g-2">
                    {selectedSeats.map((seatId, index) => {
                      const seat = seats.find(s => s.id === seatId);
                      return (
                        <div key={seatId} className="col-md-6">
                          <div className="bg-light p-2 rounded-3">
                            <div className="d-flex justify-content-between">
                              <div>
                                <span className="badge bg-primary me-2">{index + 1}</span>
                                <span className="fw-bold">{seatId}</span>
                              </div>
                              <span className="text-primary fw-bold">{formatPrice(seat?.price)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted">No seats selected yet</p>
                )}
              </div>

              {/* Passenger Assignment */}
              {selectedSeats.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Assign Passengers</h6>
                  {passengers.map((passenger, index) => (
                    <div key={passenger.id} className="mb-2">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-light text-dark me-2">{index + 1}</span>
                        <span className="flex-grow-1">{passenger.name}</span>
                        {selectedSeats[index] ? (
                          <span className="badge bg-success">Seat {selectedSeats[index]}</span>
                        ) : (
                          <select className="form-select form-select-sm w-auto">
                            <option value="">Select seat</option>
                            {selectedSeats.map(seatId => (
                              <option key={seatId} value={seatId}>{seatId}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Seat Recommendations */}
              {selectedSeats.length < passengers.length && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Recommended Seats</h6>
                  {getSeatRecommendations().map((rec, index) => (
                    <div key={index} className="bg-light p-3 rounded-3 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-bold">Row {rec.row}</span>
                          <p className="small text-muted mb-0">{rec.reason}</p>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            rec.seats.forEach(seatId => {
                              const seat = seats.find(s => s.id === seatId);
                              if (seat && selectedSeats.length < passengers.length) {
                                handleSeatClick(seat);
                              }
                            });
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Breakdown</h6>
                {selectedSeats.map(seatId => {
                  const seat = seats.find(s => s.id === seatId);
                  return seat ? (
                    <div key={seatId} className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Seat {seatId}</span>
                      <span className="fw-bold">{formatPrice(seat.price)}</span>
                    </div>
                  ) : null;
                })}
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h6 fw-bold">Total</span>
                  <span className="h5 fw-bold text-primary">{formatPrice(calculateTotalPrice())}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button 
                className="btn btn-primary w-100 py-3 fw-bold mb-3"
                disabled={selectedSeats.length !== passengers.length}
              >
                {selectedSeats.length === passengers.length 
                  ? 'Continue to Payment' 
                  : `Select ${passengers.length - selectedSeats.length} More Seat(s)`}
                <i className="fas fa-arrow-right ms-2"></i>
              </button>

              {/* Flight Info */}
              <div className="bg-light p-3 rounded-3">
                <h6 className="fw-bold mb-2">Flight Information</h6>
                <p className="small text-muted mb-1">
                  <i className="fas fa-plane-departure me-2"></i>
                  Melbourne (MEL) → Mumbai (BOM)
                </p>
                <p className="small text-muted mb-1">
                  <i className="far fa-calendar me-2"></i>
                  20 Feb 2026 • 08:30
                </p>
                <p className="small text-muted mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Duration: 15h 15m
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="position-fixed bottom-0 end-0 m-4">
        <button className="btn btn-light shadow-sm rounded-circle p-3 me-2" title="Auto-select seats">
          <i className="fas fa-magic text-primary"></i>
        </button>
        <button className="btn btn-light shadow-sm rounded-circle p-3" title="View seat map tips">
          <i className="fas fa-question text-primary"></i>
        </button>
      </div>

      <style jsx>{`
        .seat-btn {
          transition: all 0.2s;
          font-size: 0.8rem;
          padding: 0;
        }
        .seat-btn:hover:not(:disabled) {
          transform: scale(1.1);
          z-index: 1;
        }
        .seat-map-container {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 10px;
        }
        .seat-map-container::-webkit-scrollbar {
          width: 5px;
        }
        .seat-map-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default SeatSelection;