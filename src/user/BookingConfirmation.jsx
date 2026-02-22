import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const BookingConfirmation = () => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  // Booking details
  const bookingDetails = {
    bookingReference: "IND6E7F9K2",
    pnr: "6E7F9K",
    bookingDate: "19 Feb 2026, 10:30 AM",
    status: "confirmed",
    paymentMethod: "Credit Card (HDFC Bank)",
    amountPaid: 142171,
    
    flight: {
      from: {
        city: "Melbourne",
        airport: "Melbourne Airport",
        code: "MEL",
        terminal: "2",
        date: "20 Feb 2026",
        time: "08:30",
      },
      to: {
        city: "Mumbai",
        airport: "Chhatrapati Shivaji International",
        code: "BOM",
        terminal: "2",
        date: "21 Feb 2026",
        time: "16:45",
      },
      airline: "IndiGo",
      flightNumber: "6E-507",
      aircraft: "Airbus A320neo",
      duration: "15h 15m",
      stops: "1 Stop (Singapore)",
    },

    passengers: [
      {
        id: 1,
        name: "Mr. Rahul Sharma",
        type: "Adult",
        age: 32,
        seat: "12A",
        passport: "L1234567",
        status: "Confirmed",
        meal: "Regular",
        baggage: "30kg",
      },
      {
        id: 2,
        name: "Mrs. Priya Sharma",
        type: "Adult",
        age: 28,
        seat: "12B",
        passport: "L1234568",
        status: "Confirmed",
        meal: "Vegetarian",
        baggage: "30kg",
      },
      {
        id: 3,
        name: "Master. Arjun Sharma",
        type: "Child",
        age: 7,
        seat: "12C",
        passport: "L1234569",
        status: "Confirmed",
        meal: "Child Meal",
        baggage: "20kg",
      },
    ],

    addons: [
      { name: "Extra Baggage (15kg)", quantity: 1, price: 3500 },
      { name: "Meal Combo", quantity: 3, price: 3600 },
      { name: "Travel Insurance", quantity: 3, price: 2697 },
      { name: "Priority Boarding", quantity: 3, price: 1500 },
    ],

    taxes: [
      { name: "GST", amount: 8550 },
      { name: "User Development Fee", amount: 1500 },
      { name: "Airport Security Fee", amount: 900 },
      { name: "Fuel Surcharge", amount: 4800 },
    ],

    timeline: [
      { time: "19 Feb 2026, 10:30 AM", event: "Booking Confirmed", status: "completed" },
      { time: "19 Feb 2026, 10:35 AM", event: "Payment Processed", status: "completed" },
      { time: "19 Feb 2026, 11:00 AM", event: "E-ticket Generated", status: "completed" },
      { time: "20 Feb 2026, 06:00 AM", event: "Check-in Opens", status: "pending" },
      { time: "20 Feb 2026, 08:30 AM", event: "Flight Departure", status: "pending" },
    ],

    fareRules: [
      "Cancellation allowed up to 2 hours before departure",
      "Cancellation fee: ₹3000 per passenger",
      "Date change allowed: ₹2000 + fare difference",
      "No-show: 100% cancellation fee",
      "Refund will be processed within 7-10 working days",
    ],

    contactInfo: {
      email: "rahul.s@email.com",
      phone: "+91 98765 43210",
      emergency: "+91 98765 43211",
    },
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateSubtotal = () => {
    return bookingDetails.passengers.reduce((sum, p) => sum + 45299, 0);
  };

  const calculateAddonsTotal = () => {
    return bookingDetails.addons.reduce((sum, a) => sum + a.price, 0);
  };

  const calculateTaxesTotal = () => {
    return bookingDetails.taxes.reduce((sum, t) => sum + t.amount, 0);
  };

  const handleDownloadTicket = () => {
    setDownloading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setDownloading(false);
        setDownloadProgress(0);
        alert("Ticket downloaded successfully!");
      }
    }, 200);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleShare = (platform) => {
    alert(`Sharing via ${platform}`);
    setShowShareOptions(false);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Success Header */}
      <div className="text-center mb-4">
        <div className="d-inline-block bg-success bg-opacity-10 rounded-circle p-4 mb-3">
          <i className="fas fa-check-circle text-success fs-1"></i>
        </div>
        <h2 className="fw-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted mb-1">Your flight has been successfully booked</p>
        <div className="d-flex justify-content-center gap-3">
          <span className="badge bg-primary px-4 py-2">
            <i className="fas fa-ticket-alt me-2"></i>
            PNR: {bookingDetails.pnr}
          </span>
          <span className="badge bg-success px-4 py-2">
            <i className="fas fa-check me-2"></i>
            {bookingDetails.status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        <button 
          className="btn btn-primary px-5 py-3 rounded-pill"
          onClick={handleDownloadTicket}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Downloading... {downloadProgress}%
            </>
          ) : (
            <>
              <i className="fas fa-download me-2"></i>
              Download E-Ticket
            </>
          )}
        </button>
        
        <button className="btn btn-outline-primary px-5 py-3 rounded-pill" onClick={handlePrintTicket}>
          <i className="fas fa-print me-2"></i>
          Print Ticket
        </button>

        <div className="dropdown">
          <button 
            className="btn btn-outline-primary px-4 py-3 rounded-pill"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <i className="fas fa-share-alt me-2"></i>
            Share
          </button>
          
          {showShareOptions && (
            <div className="dropdown-menu show position-absolute mt-2">
              <button className="dropdown-item" onClick={() => handleShare('Email')}>
                <i className="fas fa-envelope me-2 text-primary"></i>
                Email
              </button>
              <button className="dropdown-item" onClick={() => handleShare('WhatsApp')}>
                <i className="fab fa-whatsapp me-2 text-success"></i>
                WhatsApp
              </button>
              <button className="dropdown-item" onClick={() => handleShare('SMS')}>
                <i className="fas fa-sms me-2 text-info"></i>
                SMS
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {/* Main Content - Left Side */}
        <div className="col-lg-8 mb-4">
          {/* Booking Reference Card */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <p className="text-muted mb-1">Booking Reference</p>
                  <h3 className="fw-bold text-primary mb-0">{bookingDetails.bookingReference}</h3>
                </div>
                <div className="col-md-4">
                  <p className="text-muted mb-1">Booking Date</p>
                  <p className="fw-bold mb-0">{bookingDetails.bookingDate}</p>
                </div>
                <div className="col-md-4">
                  <p className="text-muted mb-1">Payment Method</p>
                  <p className="fw-bold mb-0">{bookingDetails.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details Card */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-plane text-primary me-2"></i>
                Flight Details
              </h5>
            </div>

            <div className="card-body p-4">
              {/* Flight Route */}
              <div className="row align-items-center">
                <div className="col-md-5 text-center text-md-start">
                  <h4 className="fw-bold mb-1">{bookingDetails.flight.from.code}</h4>
                  <p className="mb-1 fw-semibold">{bookingDetails.flight.from.city}</p>
                  <p className="text-muted small mb-2">{bookingDetails.flight.from.airport}</p>
                  <p className="mb-0">
                    <span className="badge bg-light text-dark me-2">
                      Terminal {bookingDetails.flight.from.terminal}
                    </span>
                    <span className="fw-bold">{bookingDetails.flight.from.time}</span>
                  </p>
                  <p className="text-muted small">{bookingDetails.flight.from.date}</p>
                </div>

                <div className="col-md-2 text-center">
                  <i className="fas fa-plane fs-2 text-primary mb-2"></i>
                  <p className="small text-muted mb-1">{bookingDetails.flight.duration}</p>
                  <p className="small fw-semibold text-primary">{bookingDetails.flight.stops}</p>
                </div>

                <div className="col-md-5 text-center text-md-end">
                  <h4 className="fw-bold mb-1">{bookingDetails.flight.to.code}</h4>
                  <p className="mb-1 fw-semibold">{bookingDetails.flight.to.city}</p>
                  <p className="text-muted small mb-2">{bookingDetails.flight.to.airport}</p>
                  <p className="mb-0">
                    <span className="fw-bold">{bookingDetails.flight.to.time}</span>
                    <span className="badge bg-light text-dark ms-2">
                      Terminal {bookingDetails.flight.to.terminal}
                    </span>
                  </p>
                  <p className="text-muted small">{bookingDetails.flight.to.date}</p>
                </div>
              </div>

              <hr className="my-4" />

              {/* Airline Info */}
              <div className="row">
                <div className="col-md-4">
                  <p className="text-muted mb-1">Airline</p>
                  <p className="fw-bold mb-0">
                    {bookingDetails.flight.airline} • {bookingDetails.flight.flightNumber}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="text-muted mb-1">Aircraft</p>
                  <p className="fw-bold mb-0">{bookingDetails.flight.aircraft}</p>
                </div>
                <div className="col-md-4">
                  <p className="text-muted mb-1">Class</p>
                  <p className="fw-bold mb-0">Economy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Details Card */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-users text-primary me-2"></i>
                Passenger Details
              </h5>
            </div>

            <div className="card-body p-4">
              {bookingDetails.passengers.map((passenger, index) => (
                <div key={passenger.id} className={index < bookingDetails.passengers.length - 1 ? "mb-4 pb-4 border-bottom" : ""}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-primary me-3">{index + 1}</span>
                        <h6 className="fw-bold mb-0">{passenger.name}</h6>
                        <span className="badge bg-light text-dark ms-3">{passenger.type}</span>
                      </div>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <span className="badge bg-success">Seat {passenger.seat}</span>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-3">
                      <p className="text-muted small mb-1">Passport</p>
                      <p className="fw-semibold mb-0">{passenger.passport}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted small mb-1">Meal</p>
                      <p className="fw-semibold mb-0">{passenger.meal}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted small mb-1">Baggage</p>
                      <p className="fw-semibold mb-0">{passenger.baggage}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-muted small mb-1">Status</p>
                      <p className="fw-semibold text-success mb-0">{passenger.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons & Taxes Card */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-shopping-bag text-primary me-2"></i>
                Add-ons & Charges
              </h5>
            </div>

            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Add-ons</h6>
                  {bookingDetails.addons.map((addon, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        {addon.name} 
                        <span className="badge bg-light text-dark ms-2">x{addon.quantity}</span>
                      </span>
                      <span className="fw-bold">{formatPrice(addon.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Taxes & Fees</h6>
                  {bookingDetails.taxes.map((tax, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">{tax.name}</span>
                      <span className="fw-bold">{formatPrice(tax.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fare Rules Card */}
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-gavel text-primary me-2"></i>
                Fare Rules
              </h5>
            </div>

            <div className="card-body p-4">
              <ul className="list-unstyled mb-0">
                {bookingDetails.fareRules.map((rule, index) => (
                  <li key={index} className="mb-2">
                    <i className="fas fa-circle text-primary me-2" style={{ fontSize: '8px' }}></i>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="col-lg-4">
          {/* Price Summary Card */}
          <div className="card shadow-sm border-0 rounded-4 mb-4 sticky-lg-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white border-0 rounded-top-4 p-4">
              <h5 className="fw-bold mb-0">Price Summary</h5>
            </div>

            <div className="card-body p-4">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Base Fare ({bookingDetails.passengers.length} Passenger)</span>
                  <span className="fw-bold">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Add-ons</span>
                  <span className="fw-bold">{formatPrice(calculateAddonsTotal())}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Taxes & Fees</span>
                  <span className="fw-bold">{formatPrice(calculateTaxesTotal())}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h6 fw-bold">Total Amount</span>
                  <span className="h5 fw-bold text-primary">{formatPrice(bookingDetails.amountPaid)}</span>
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Amount Paid</span>
                  <span className="fw-bold text-success">{formatPrice(bookingDetails.amountPaid)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Payment Status</span>
                  <span className="badge bg-success">Paid</span>
                </div>
              </div>

              <button className="btn btn-outline-primary w-100 py-3 mb-3">
                <i className="fas fa-receipt me-2"></i>
                View Invoice
              </button>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-clock text-primary me-2"></i>
                Booking Timeline
              </h5>
            </div>

            <div className="card-body p-4">
              <div className="timeline">
                {bookingDetails.timeline.map((item, index) => (
                  <div key={index} className="timeline-item d-flex mb-3">
                    <div className="me-3">
                      <div className={`rounded-circle p-2 ${
                        item.status === 'completed' ? 'bg-success' : 'bg-secondary'
                      }`} style={{ width: '12px', height: '12px' }}></div>
                      {index < bookingDetails.timeline.length - 1 && (
                        <div className="timeline-line ms-1" style={{ 
                          width: '2px', 
                          height: '30px', 
                          backgroundColor: item.status === 'completed' ? '#28a745' : '#ddd'
                        }}></div>
                      )}
                    </div>
                    <div>
                      <p className="small text-muted mb-1">{item.time}</p>
                      <p className="fw-semibold mb-0">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-phone-alt text-primary me-2"></i>
                Contact Information
              </h5>
            </div>

            <div className="card-body p-4">
              <div className="mb-3">
                <p className="text-muted small mb-1">Email</p>
                <p className="fw-semibold mb-0">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  {bookingDetails.contactInfo.email}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-muted small mb-1">Phone</p>
                <p className="fw-semibold mb-0">
                  <i className="fas fa-phone me-2 text-primary"></i>
                  {bookingDetails.contactInfo.phone}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-muted small mb-1">Emergency Contact</p>
                <p className="fw-semibold mb-0">
                  <i className="fas fa-exclamation-circle me-2 text-danger"></i>
                  {bookingDetails.contactInfo.emergency}
                </p>
              </div>

              <hr />

              <h6 className="fw-bold mb-3">Need Help?</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-headset me-2"></i>
                  24/7 Customer Support
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-comment me-2"></i>
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
        <div>
          <i className="fas fa-shield-alt text-success me-2"></i>
          <span className="text-muted">This is your official e-ticket. Please carry a printout or digital copy.</span>
        </div>
        <div>
          <button className="btn btn-link text-primary me-3">
            <i className="fas fa-star me-2"></i>
            Rate Your Experience
          </button>
          <button className="btn btn-link text-primary">
            <i className="fas fa-flag me-2"></i>
            Report Issue
          </button>
        </div>
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
        }
        .timeline-line {
          margin-left: 5px;
        }
        @media print {
          .btn, .dropdown, .footer-actions {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;