// Booking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
    countryCode: "+1",
  });
  const [bookingData, setBookingData] = useState({
    pnr: "",
    status: "pending",
    totalAmount: 0,
    bookingDate: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Load flight data from localStorage (in a real app, this would come from state/context)
  useEffect(() => {
    const flightData = localStorage.getItem("selectedFlight");
    if (flightData) {
      setSelectedFlight(JSON.parse(flightData));
    } else {
      // Redirect to flight search if no flight selected
      navigate("/user/flights");
    }
  }, [navigate]);

  // Generate unique PNR
  const generatePNR = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pnr = "";
    for (let i = 0; i < 6; i++) {
      pnr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return pnr;
  };

  // Add passenger
  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        id: Date.now() + Math.random(),
        title: "Mr",
        firstName: "",
        lastName: "",
        gender: "male",
        age: "",
        passportNumber: "",
        nationality: "",
        seatNumber: null,
        mealPreference: "regular",
        baggage: "20kg",
      },
    ]);
  };

  // Remove passenger
  const removePassenger = (id) => {
    setPassengers(passengers.filter((p) => p.id !== id));
  };

  // Update passenger details
  const updatePassenger = (id, field, value) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );

    // Clear error for this field
    if (errors[`passenger_${id}_${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`passenger_${id}_${field}`];
        return newErrors;
      });
    }
  };

  // Handle contact details change
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate passenger details
  const validatePassenger = (passenger, index) => {
    const errors = {};

    if (!passenger.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!passenger.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!passenger.age) {
      errors.age = "Age is required";
    } else if (passenger.age < 0 || passenger.age > 120) {
      errors.age = "Invalid age";
    }

    if (passenger.passportNumber && passenger.passportNumber.length < 6) {
      errors.passportNumber = "Invalid passport number";
    }

    return errors;
  };

  // Validate step 1 (Passenger Details)
  const validateStep1 = () => {
    const newErrors = {};

    if (passengers.length === 0) {
      newErrors.passengers = "At least one passenger is required";
      setErrors(newErrors);
      return false;
    }

    passengers.forEach((passenger, index) => {
      const passengerErrors = validatePassenger(passenger, index);
      Object.keys(passengerErrors).forEach((key) => {
        newErrors[`passenger_${passenger.id}_${key}`] = passengerErrors[key];
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 2 (Contact Details)
  const validateStep2 = () => {
    const newErrors = {};

    if (!contactDetails.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactDetails.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!contactDetails.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(contactDetails.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-assign seats
  const assignSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F"];
    const seats = [];

    // Generate available seats
    for (let i = 1; i <= 30; i++) {
      rows.forEach((row) => {
        seats.push(`${i}${row}`);
      });
    }

    // Shuffle seats for random assignment
    const shuffled = seats.sort(() => 0.5 - Math.random());

    // Assign seats to passengers
    const updatedPassengers = passengers.map((passenger, index) => ({
      ...passenger,
      seatNumber: shuffled[index] || "TBA",
    }));

    setPassengers(updatedPassengers);
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!selectedFlight) return 0;

    const baseFare = selectedFlight.price || 299;
    const passengerCount = passengers.length;
    const taxes = baseFare * passengerCount * 0.18; // 18% tax

    return (baseFare * passengerCount + taxes).toFixed(2);
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        assignSeats();
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle booking submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Generate PNR
      const pnr = generatePNR();

      // Prepare booking data
      const bookingPayload = {
        pnr,
        flight: selectedFlight,
        passengers,
        contact: contactDetails,
        totalAmount: calculateTotal(),
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        paymentStatus: "pending",
      };

      // In a real app, you would send this to your backend
      // const response = await fetch("http://localhost:5000/api/bookings", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem("usertoken")}`
      //   },
      //   body: JSON.stringify(bookingPayload)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setBookingData({
        ...bookingData,
        pnr,
        status: "confirmed",
        totalAmount: calculateTotal(),
      });

      setBookingComplete(true);

      // Save booking to localStorage for demo
      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]",
      );
      existingBookings.push(bookingPayload);
      localStorage.setItem("bookings", JSON.stringify(existingBookings));
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ submit: "Failed to complete booking. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // View booking details
  const viewBooking = () => {
    navigate(`/user/bookings/${bookingData.pnr}`);
  };

  if (!selectedFlight) {
    return <div className="loading">Loading flight details...</div>;
  }

  if (bookingComplete) {
    return (
      <div className="booking-confirmation">
        <div className="confirmation-card">
          <div className="success-animation">
            <i className="fas fa-check-circle"></i>
          </div>

          <h2>Booking Confirmed!</h2>

          <div className="pnr-box">
            <span>PNR Number</span>
            <strong>{bookingData.pnr}</strong>
          </div>

          <div className="confirmation-details">
            <div className="detail-row">
              <span>Flight:</span>
              <strong>
                {selectedFlight.airline} - {selectedFlight.flightNumber}
              </strong>
            </div>
            <div className="detail-row">
              <span>Route:</span>
              <strong>
                {selectedFlight.from} → {selectedFlight.to}
              </strong>
            </div>
            <div className="detail-row">
              <span>Date:</span>
              <strong>
                {new Date(selectedFlight.departureDate).toLocaleDateString()}
              </strong>
            </div>
            <div className="detail-row">
              <span>Passengers:</span>
              <strong>{passengers.length}</strong>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <strong className="amount">${calculateTotal()}</strong>
            </div>
          </div>

          <div className="passenger-summary">
            <h3>Passenger Details</h3>
            {passengers.map((passenger, index) => (
              <div key={passenger.id} className="passenger-summary-item">
                <span>
                  {index + 1}. {passenger.title} {passenger.firstName}{" "}
                  {passenger.lastName}
                </span>
                <span>Seat: {passenger.seatNumber}</span>
              </div>
            ))}
          </div>

          <div className="confirmation-actions">
            <button className="view-booking-btn" onClick={viewBooking}>
              <i className="fas fa-eye"></i> View Booking
            </button>
            <button className="download-btn">
              <i className="fas fa-download"></i> Download Ticket
            </button>
            <button
              className="home-btn"
              onClick={() => navigate("/user/dashboard")}
            >
              <i className="fas fa-home"></i> Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      {/* Progress Bar */}
      <div className="booking-progress">
        <div
          className={`progress-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}
        >
          <div className="step-number">1</div>
          <div className="step-label">Passenger Details</div>
        </div>
        <div
          className={`progress-line ${currentStep >= 2 ? "active" : ""}`}
        ></div>
        <div
          className={`progress-step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}
        >
          <div className="step-number">2</div>
          <div className="step-label">Contact Info</div>
        </div>
        <div
          className={`progress-line ${currentStep >= 3 ? "active" : ""}`}
        ></div>
        <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">Review & Pay</div>
        </div>
      </div>

      <div className="booking-content">
        {/* Main Booking Form */}
        <div className="booking-form-container">
          {currentStep === 1 && (
            <div className="booking-step fade-in">
              <div className="step-header">
                <h2>
                  <i className="fas fa-users"></i>
                  Passenger Details
                </h2>
                <p>Enter details for all passengers</p>
              </div>

              {errors.passengers && (
                <div className="error-message global-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.passengers}
                </div>
              )}

              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="passenger-card">
                  <div className="passenger-header">
                    <h3>
                      <i className="fas fa-user"></i>
                      Passenger {index + 1}
                    </h3>
                    {passengers.length > 1 && (
                      <button
                        className="remove-passenger"
                        onClick={() => removePassenger(passenger.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <div className="passenger-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title</label>
                        <select
                          value={passenger.title}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "title",
                              e.target.value,
                            )
                          }
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "firstName",
                              e.target.value,
                            )
                          }
                          className={
                            errors[`passenger_${passenger.id}_firstName`]
                              ? "error"
                              : ""
                          }
                          placeholder="Enter first name"
                        />
                        {errors[`passenger_${passenger.id}_firstName`] && (
                          <span className="error-text">
                            {errors[`passenger_${passenger.id}_firstName`]}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "lastName",
                              e.target.value,
                            )
                          }
                          className={
                            errors[`passenger_${passenger.id}_lastName`]
                              ? "error"
                              : ""
                          }
                          placeholder="Enter last name"
                        />
                        {errors[`passenger_${passenger.id}_lastName`] && (
                          <span className="error-text">
                            {errors[`passenger_${passenger.id}_lastName`]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Gender</label>
                        <select
                          value={passenger.gender}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "gender",
                              e.target.value,
                            )
                          }
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Age *</label>
                        <input
                          type="number"
                          value={passenger.age}
                          onChange={(e) =>
                            updatePassenger(passenger.id, "age", e.target.value)
                          }
                          className={
                            errors[`passenger_${passenger.id}_age`]
                              ? "error"
                              : ""
                          }
                          placeholder="Enter age"
                          min="0"
                          max="120"
                        />
                        {errors[`passenger_${passenger.id}_age`] && (
                          <span className="error-text">
                            {errors[`passenger_${passenger.id}_age`]}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Meal Preference</label>
                        <select
                          value={passenger.mealPreference}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "mealPreference",
                              e.target.value,
                            )
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="child">Child Meal</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Passport Number (Optional)</label>
                        <input
                          type="text"
                          value={passenger.passportNumber}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "passportNumber",
                              e.target.value,
                            )
                          }
                          className={
                            errors[`passenger_${passenger.id}_passportNumber`]
                              ? "error"
                              : ""
                          }
                          placeholder="Enter passport number"
                        />
                        {errors[`passenger_${passenger.id}_passportNumber`] && (
                          <span className="error-text">
                            {errors[`passenger_${passenger.id}_passportNumber`]}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Nationality</label>
                        <input
                          type="text"
                          value={passenger.nationality}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "nationality",
                              e.target.value,
                            )
                          }
                          placeholder="Enter nationality"
                        />
                      </div>

                      <div className="form-group">
                        <label>Baggage</label>
                        <select
                          value={passenger.baggage}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              "baggage",
                              e.target.value,
                            )
                          }
                        >
                          <option value="15kg">15kg (Included)</option>
                          <option value="20kg">20kg (+$20)</option>
                          <option value="25kg">25kg (+$35)</option>
                          <option value="30kg">30kg (+$50)</option>
                        </select>
                      </div>
                    </div>

                    {passenger.seatNumber && (
                      <div className="assigned-seat">
                        <i className="fas fa-chair"></i>
                        Assigned Seat: <strong>{passenger.seatNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className="add-passenger-btn" onClick={addPassenger}>
                <i className="fas fa-plus"></i>
                Add Another Passenger
              </button>

              <div className="step-actions">
                <button
                  className="back-btn"
                  onClick={() => navigate("/user/flights")}
                >
                  <i className="fas fa-arrow-left"></i>
                  Back to Flights
                </button>
                <button className="next-btn" onClick={handleNext}>
                  Continue to Contact Info
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="booking-step fade-in">
              <div className="step-header">
                <h2>
                  <i className="fas fa-address-card"></i>
                  Contact Information
                </h2>
                <p>We'll send booking confirmation to these details</p>
              </div>

              <div className="contact-form">
                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope"></i>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactDetails.email}
                    onChange={handleContactChange}
                    className={errors.email ? "error" : ""}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country Code</label>
                    <select
                      name="countryCode"
                      value={contactDetails.countryCode}
                      onChange={handleContactChange}
                    >
                      <option value="+1">+1 (USA)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+61">+61 (Australia)</option>
                      <option value="+86">+86 (China)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-phone"></i>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactDetails.phone}
                      onChange={handleContactChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <span className="error-text">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="info-note">
                  <i className="fas fa-info-circle"></i>
                  Your booking confirmation and updates will be sent to these
                  contact details
                </div>
              </div>

              <div className="step-actions">
                <button className="back-btn" onClick={handlePrevious}>
                  <i className="fas fa-arrow-left"></i>
                  Back to Passengers
                </button>
                <button className="next-btn" onClick={handleNext}>
                  Continue to Review
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="booking-step fade-in">
              <div className="step-header">
                <h2>
                  <i className="fas fa-check-circle"></i>
                  Review & Confirm
                </h2>
                <p>Please review your booking details before payment</p>
              </div>

              <div className="review-section">
                <div className="review-card">
                  <h3>
                    <i className="fas fa-plane"></i>
                    Flight Details
                  </h3>
                  <div className="review-details">
                    <div className="review-row">
                      <span>Flight:</span>
                      <strong>
                        {selectedFlight.airline} - {selectedFlight.flightNumber}
                      </strong>
                    </div>
                    <div className="review-row">
                      <span>Route:</span>
                      <strong>
                        {selectedFlight.from} → {selectedFlight.to}
                      </strong>
                    </div>
                    <div className="review-row">
                      <span>Departure:</span>
                      <strong>
                        {new Date(
                          selectedFlight.departureDate,
                        ).toLocaleString()}
                      </strong>
                    </div>
                    <div className="review-row">
                      <span>Arrival:</span>
                      <strong>
                        {new Date(selectedFlight.arrivalDate).toLocaleString()}
                      </strong>
                    </div>
                    <div className="review-row">
                      <span>Duration:</span>
                      <strong>{selectedFlight.duration || "2h 30m"}</strong>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h3>
                    <i className="fas fa-users"></i>
                    Passenger Summary
                  </h3>
                  {passengers.map((passenger, index) => (
                    <div key={passenger.id} className="passenger-summary">
                      <div className="summary-row">
                        <span>
                          {index + 1}. {passenger.title} {passenger.firstName}{" "}
                          {passenger.lastName}
                        </span>
                        <span>Seat: {passenger.seatNumber}</span>
                      </div>
                      <div className="summary-details">
                        <span>Age: {passenger.age}</span>
                        <span>Meal: {passenger.mealPreference}</span>
                        <span>Baggage: {passenger.baggage}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="review-card">
                  <h3>
                    <i className="fas fa-address-card"></i>
                    Contact Details
                  </h3>
                  <div className="review-details">
                    <div className="review-row">
                      <span>Email:</span>
                      <strong>{contactDetails.email}</strong>
                    </div>
                    <div className="review-row">
                      <span>Phone:</span>
                      <strong>
                        {contactDetails.countryCode} {contactDetails.phone}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="price-breakdown">
                  <h3>Price Breakdown</h3>
                  <div className="price-row">
                    <span>
                      Base Fare ({passengers.length} × $
                      {selectedFlight.price || 299})
                    </span>
                    <span>
                      ${(selectedFlight.price || 299) * passengers.length}
                    </span>
                  </div>
                  <div className="price-row">
                    <span>Taxes & Fees (18%)</span>
                    <span>
                      $
                      {(
                        (selectedFlight.price || 299) *
                        passengers.length *
                        0.18
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="error-message global-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.submit}
                </div>
              )}

              <div className="step-actions">
                <button className="back-btn" onClick={handlePrevious}>
                  <i className="fas fa-arrow-left"></i>
                  Back to Contact
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i>
                      Confirm & Pay ${calculateTotal()}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Flight Summary Sidebar */}
        <div className="flight-summary">
          <h3>
            <i className="fas fa-plane-departure"></i>
            Your Trip
          </h3>

          <div className="summary-flight">
            <div className="airline-info">
              <i className="fas fa-plane"></i>
              <span>
                {selectedFlight.airline || "Sky Airlines"} -{" "}
                {selectedFlight.flightNumber || "SA123"}
              </span>
            </div>

            <div className="route-info">
              <div className="from-to">
                <div className="city">
                  <strong>{selectedFlight.from || "NYC"}</strong>
                  <span>{selectedFlight.departureTime || "10:30"}</span>
                </div>
                <div className="flight-line">
                  <i className="fas fa-plane"></i>
                </div>
                <div className="city">
                  <strong>{selectedFlight.to || "LAX"}</strong>
                  <span>{selectedFlight.arrivalTime || "13:00"}</span>
                </div>
              </div>
              <div className="duration">
                <i className="far fa-clock"></i>
                {selectedFlight.duration || "2h 30m"}
              </div>
            </div>
          </div>

          <div className="summary-details">
            <div className="summary-item">
              <span>Date:</span>
              <strong>
                {new Date(
                  selectedFlight.departureDate || Date.now(),
                ).toLocaleDateString()}
              </strong>
            </div>
            <div className="summary-item">
              <span>Passengers:</span>
              <strong>{passengers.length}</strong>
            </div>
            <div className="summary-item">
              <span>Class:</span>
              <strong>Economy</strong>
            </div>
            <div className="summary-item">
              <span>Baggage Allowance:</span>
              <strong>20kg per passenger</strong>
            </div>
          </div>

          <div className="summary-price">
            <span>Total Price</span>
            <strong>${calculateTotal()}</strong>
          </div>

          <div className="cancellation-policy">
            <h4>Cancellation Policy</h4>
            <ul>
              <li>Free cancellation within 24 hours</li>
              <li>75% refund before 7 days</li>
              <li>50% refund before 3 days</li>
              <li>No refund within 3 days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
