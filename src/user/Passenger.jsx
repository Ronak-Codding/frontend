import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PassengerDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [passengers, setPassengers] = useState([
    {
      id: 1,
      type: "adult",
      title: "",
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      nationality: "",
      passportNumber: "",
      passportExpiry: "",
      frequentFlyer: "",
      email: "",
      phone: "",
      emergencyContact: "",
      meals: "regular",
      seatPreference: "",
      specialAssistance: false,
      wheelchair: false,
    }
  ]);

  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
    countryCode: "+91",
    receiveUpdates: true,
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsPassenger: true,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Sample flight summary data
  const flightSummary = {
    from: "Melbourne (MEL)",
    to: "Mumbai (BOM)",
    departureDate: "20 Feb 2026",
    departureTime: "08:30",
    arrivalDate: "21 Feb 2026",
    arrivalTime: "16:45",
    airline: "IndiGo",
    flightNumber: "6E-507",
    duration: "15h 15m",
    cabinClass: "Economy",
    price: 45299,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    }
  };

  const titles = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
  const nationalities = ["Indian", "Australian", "American", "British", "Canadian", "Other"];
  const mealPreferences = ["Regular", "Vegetarian", "Vegan", "Jain", "Halal", "Kosher", "Child Meal"];
  const seatPreferences = ["Window", "Aisle", "Middle", "Near Exit", "Bulkhead"];

  const addPassenger = () => {
    if (passengers.length < flightSummary.passengers.adults + flightSummary.passengers.children + flightSummary.passengers.infants) {
      const newType = passengers.length < flightSummary.passengers.adults ? "adult" : 
                     passengers.length < flightSummary.passengers.adults + flightSummary.passengers.children ? "child" : "infant";
      
      setPassengers([...passengers, {
        id: passengers.length + 1,
        type: newType,
        title: "",
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
        frequentFlyer: "",
        meals: "regular",
        seatPreference: "",
        specialAssistance: false,
        wheelchair: false,
      }]);
    }
  };

  const updatePassenger = (id, field, value) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePassenger = (id) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const calculateTotalPrice = () => {
    let total = flightSummary.price;
    // Add taxes and fees
    total += 1800; // GST
    total += 500; // User Development Fee
    total += 300; // Airport Security Fee
    return total;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Progress Bar */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {[
            { step: 1, label: "Flight Selection", icon: "fa-plane" },
            { step: 2, label: "Passenger Details", icon: "fa-users" },
            { step: 3, label: "Seat Selection", icon: "fa-chair" },
            { step: 4, label: "Payment", icon: "fa-credit-card" },
            { step: 5, label: "Confirmation", icon: "fa-check-circle" }
          ].map((item) => (
            <div key={item.step} className="text-center position-relative" style={{ width: '20%' }}>
              <div className={`rounded-circle p-3 mx-auto mb-2 ${
                currentStep > item.step ? 'bg-success' : 
                currentStep === item.step ? 'bg-primary' : 'bg-light'
              }`} style={{ width: '50px', height: '50px' }}>
                <i className={`fas ${item.icon} ${
                  currentStep >= item.step ? 'text-white' : 'text-secondary'
                }`}></i>
              </div>
              <span className={`small fw-semibold d-none d-md-block ${
                currentStep >= item.step ? 'text-primary' : 'text-muted'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="progress" style={{ height: '2px' }}>
          <div className="progress-bar bg-primary" style={{ width: `${(currentStep-1) * 25}%` }}></div>
        </div>
      </div>

      <div className="row">
        {/* Main Form - Left Side */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h4 className="fw-bold mb-0">
                <i className="fas fa-user-edit text-primary me-2"></i>
                Passenger Details
              </h4>
              <p className="text-muted mb-0">Please provide accurate information as per passport</p>
            </div>

            <div className="card-body p-4">
              {/* Passenger Forms */}
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      Passenger {index + 1}
                      <span className={`badge ms-2 ${
                        passenger.type === 'adult' ? 'bg-primary' :
                        passenger.type === 'child' ? 'bg-info' : 'bg-warning'
                      } bg-opacity-10 text-dark px-3 py-2`}>
                        {passenger.type.charAt(0).toUpperCase() + passenger.type.slice(1)}
                      </span>
                    </h5>
                    {passengers.length > 1 && (
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removePassenger(passenger.id)}
                      >
                        <i className="fas fa-trash me-2"></i>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="row g-3">
                    {/* Title & Name */}
                    <div className="col-md-2">
                      <label className="fw-semibold mb-2">Title</label>
                      <select 
                        className="form-select"
                        value={passenger.title}
                        onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        {titles.map(title => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-5">
                      <label className="fw-semibold mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="As on passport"
                        value={passenger.firstName}
                        onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-5">
                      <label className="fw-semibold mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="As on passport"
                        value={passenger.lastName}
                        onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                        required
                      />
                    </div>

                    {/* Gender & DOB */}
                    <div className="col-md-4">
                      <label className="fw-semibold mb-2">Gender</label>
                      <select 
                        className="form-select"
                        value={passenger.gender}
                        onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="fw-semibold mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={passenger.dob}
                        onChange={(e) => updatePassenger(passenger.id, 'dob', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-semibold mb-2">Nationality</label>
                      <select 
                        className="form-select"
                        value={passenger.nationality}
                        onChange={(e) => updatePassenger(passenger.id, 'nationality', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        {nationalities.map(nat => (
                          <option key={nat} value={nat}>{nat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Passport Details */}
                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">
                        <i className="fas fa-passport text-primary me-2"></i>
                        Passport Number
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter passport number"
                        value={passenger.passportNumber}
                        onChange={(e) => updatePassenger(passenger.id, 'passportNumber', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Passport Expiry Date</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={passenger.passportExpiry}
                        onChange={(e) => updatePassenger(passenger.id, 'passportExpiry', e.target.value)}
                        required
                      />
                    </div>

                    {/* Frequent Flyer */}
                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">
                        <i className="fas fa-star text-primary me-2"></i>
                        Frequent Flyer Number (Optional)
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter FF number"
                        value={passenger.frequentFlyer}
                        onChange={(e) => updatePassenger(passenger.id, 'frequentFlyer', e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Emergency Contact</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Emergency contact number"
                        value={passenger.emergencyContact}
                        onChange={(e) => updatePassenger(passenger.id, 'emergencyContact', e.target.value)}
                      />
                    </div>

                    {/* Preferences */}
                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Meal Preference</label>
                      <select 
                        className="form-select"
                        value={passenger.meals}
                        onChange={(e) => updatePassenger(passenger.id, 'meals', e.target.value)}
                      >
                        {mealPreferences.map(meal => (
                          <option key={meal} value={meal.toLowerCase()}>{meal}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Seat Preference</label>
                      <select 
                        className="form-select"
                        value={passenger.seatPreference}
                        onChange={(e) => updatePassenger(passenger.id, 'seatPreference', e.target.value)}
                      >
                        <option value="">No Preference</option>
                        {seatPreferences.map(seat => (
                          <option key={seat} value={seat.toLowerCase()}>{seat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Special Assistance */}
                    <div className="col-12">
                      <div className="bg-light p-3 rounded-3">
                        <h6 className="fw-bold mb-3">Special Assistance</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-check">
                              <input 
                                type="checkbox" 
                                className="form-check-input"
                                id={`special-${passenger.id}`}
                                checked={passenger.specialAssistance}
                                onChange={(e) => updatePassenger(passenger.id, 'specialAssistance', e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor={`special-${passenger.id}`}>
                                Special Assistance Required
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check">
                              <input 
                                type="checkbox" 
                                className="form-check-input"
                                id={`wheelchair-${passenger.id}`}
                                checked={passenger.wheelchair}
                                onChange={(e) => updatePassenger(passenger.id, 'wheelchair', e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor={`wheelchair-${passenger.id}`}>
                                Wheelchair Assistance
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < passengers.length - 1 && <hr className="my-4" />}
                </div>
              ))}

              {/* Add Passenger Button */}
              {passengers.length < 9 && (
                <button 
                  className="btn btn-outline-primary w-100 py-3"
                  onClick={addPassenger}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Another Passenger
                </button>
              )}

              <hr className="my-4" />

              {/* Contact Details */}
              <h5 className="fw-bold mb-3">Contact Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="fw-semibold mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="your@email.com"
                    value={contactDetails.email}
                    onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                    required
                  />
                  <small className="text-muted">Booking confirmation will be sent here</small>
                </div>

                <div className="col-md-6">
                  <label className="fw-semibold mb-2">Phone Number</label>
                  <div className="input-group">
                    <select 
                      className="form-select" 
                      style={{ maxWidth: '100px' }}
                      value={contactDetails.countryCode}
                      onChange={(e) => setContactDetails({...contactDetails, countryCode: e.target.value})}
                    >
                      <option value="+91">+91</option>
                      <option value="+61">+61</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Phone number"
                      value={contactDetails.phone}
                      onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      id="receiveUpdates"
                      checked={contactDetails.receiveUpdates}
                      onChange={(e) => setContactDetails({...contactDetails, receiveUpdates: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="receiveUpdates">
                      Receive updates via WhatsApp/SMS about your flight status
                    </label>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <h5 className="fw-bold mb-3">Billing Address</h5>
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-check mb-3">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      id="sameAsPassenger"
                      checked={billingAddress.sameAsPassenger}
                      onChange={(e) => setBillingAddress({...billingAddress, sameAsPassenger: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="sameAsPassenger">
                      Same as passenger address
                    </label>
                  </div>
                </div>

                {!billingAddress.sameAsPassenger && (
                  <>
                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Address Line 1</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={billingAddress.addressLine1}
                        onChange={(e) => setBillingAddress({...billingAddress, addressLine1: e.target.value})}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Address Line 2</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={billingAddress.addressLine2}
                        onChange={(e) => setBillingAddress({...billingAddress, addressLine2: e.target.value})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-semibold mb-2">City</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-semibold mb-2">State</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="fw-semibold mb-2">Pincode</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={billingAddress.pincode}
                        onChange={(e) => setBillingAddress({...billingAddress, pincode: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary - Right Side */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 sticky-lg-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white border-0 rounded-top-4 p-4">
              <h5 className="fw-bold mb-0">Booking Summary</h5>
            </div>

            <div className="card-body p-4">
              {/* Flight Info */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-plane-departure text-primary fs-4 me-3"></i>
                  <div>
                    <h6 className="fw-bold mb-1">{flightSummary.from} → {flightSummary.to}</h6>
                    <p className="text-muted small mb-0">
                      {flightSummary.airline} • {flightSummary.flightNumber}
                    </p>
                  </div>
                </div>

                <div className="bg-light p-3 rounded-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Departure</span>
                    <span className="fw-bold">{flightSummary.departureTime}, {flightSummary.departureDate}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Arrival</span>
                    <span className="fw-bold">{flightSummary.arrivalTime}, {flightSummary.arrivalDate}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Duration</span>
                    <span className="fw-bold">{flightSummary.duration}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Summary */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Passenger Details</h6>
                {passengers.map((p, index) => (
                  <div key={p.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="badge bg-light text-dark me-2">{index + 1}</span>
                      <span>{p.title} {p.firstName} {p.lastName || "Not added"}</span>
                    </div>
                    <span className={`badge ${
                      p.type === 'adult' ? 'bg-primary' : 
                      p.type === 'child' ? 'bg-info' : 'bg-warning'
                    } bg-opacity-10 text-dark`}>
                      {p.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Details</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Base Fare ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})</span>
                  <span className="fw-bold">{formatPrice(flightSummary.price)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">GST</span>
                  <span className="fw-bold">{formatPrice(1800)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">User Development Fee</span>
                  <span className="fw-bold">{formatPrice(500)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Airport Security Fee</span>
                  <span className="fw-bold">{formatPrice(300)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h6 fw-bold">Total Amount</span>
                  <span className="h5 fw-bold text-primary">{formatPrice(calculateTotalPrice())}</span>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="terms" required />
                  <label className="form-check-label small" htmlFor="terms">
                    I confirm that the information provided is correct and I agree to the 
                    <a href="#" className="text-primary text-decoration-none"> Terms & Conditions</a> and 
                    <a href="#" className="text-primary text-decoration-none"> Privacy Policy</a>
                  </label>
                </div>
              </div>

              {/* Continue Button */}
              <button 
                className="btn btn-primary w-100 py-3 fw-bold"
                onClick={() => setCurrentStep(3)}
              >
                Continue to Seat Selection
                <i className="fas fa-arrow-right ms-2"></i>
              </button>

              {/* Secure Payment Badge */}
              <div className="text-center mt-3">
                <i className="fas fa-lock text-success me-2"></i>
                <span className="small text-muted">Your information is secure with 256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save & Exit Button */}
      <button className="btn btn-outline-secondary position-fixed bottom-0 end-0 m-4">
        <i className="fas fa-save me-2"></i>
        Save & Exit
      </button>
    </div>
  );
};

export default PassengerDetails;