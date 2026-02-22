import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PaymentGateway = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [saveCard, setSaveCard] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Form states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
  });

  const [netBankingDetails, setNetBankingDetails] = useState({
    bank: "",
  });

  const [walletDetails, setWalletDetails] = useState({
    wallet: "",
  });

  // Booking summary data
  const bookingSummary = {
    flight: {
      from: "Melbourne (MEL)",
      to: "Mumbai (BOM)",
      airline: "IndiGo",
      flightNumber: "6E-507",
      departureDate: "20 Feb 2026",
      departureTime: "08:30",
      arrivalDate: "21 Feb 2026",
      arrivalTime: "16:45",
      duration: "15h 15m",
    },
    passengers: [
      { name: "Mr. Rahul Sharma", seat: "12A", price: 45299 },
      { name: "Mrs. Priya Sharma", seat: "12B", price: 45299 },
      { name: "Master. Arjun Sharma", seat: "12C", price: 33974 },
    ],
    addons: [
      { name: "Extra Baggage (15kg)", price: 3500 },
      { name: "Meal Combo", price: 1200 },
      { name: "Travel Insurance", price: 899 },
    ],
    taxes: 5600,
  };

  const calculateSubtotal = () => {
    return bookingSummary.passengers.reduce((sum, p) => sum + p.price, 0);
  };

  const calculateAddonsTotal = () => {
    return bookingSummary.addons.reduce((sum, a) => sum + a.price, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateAddonsTotal() + bookingSummary.taxes;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      if (paymentMethod === "credit-card") {
        setShowOtpModal(true);
      } else {
        setPaymentSuccess(true);
      }
    }, 2000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    setShowOtpModal(false);
    setPaymentSuccess(true);
  };

  const popularBanks = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", 
    "Kotak Mahindra", "Yes Bank", "PNB", "Bank of Baroda"
  ];

  const wallets = [
    { name: "Paytm", icon: "fa-paytm" },
    { name: "PhonePe", icon: "fa-phone-alt" },
    { name: "Google Pay", icon: "fa-google-pay" },
    { name: "Amazon Pay", icon: "fa-amazon-pay" },
    { name: "Mobikwik", icon: "fa-mobile-alt" },
    { name: "Freecharge", icon: "fa-bolt" },
  ];

  if (paymentSuccess) {
    return (
      <div className="container py-5">
        <div className="card shadow-lg border-0 rounded-4 text-center p-5">
          <div className="mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block">
              <i className="fas fa-check-circle text-success fs-1"></i>
            </div>
          </div>
          <h2 className="fw-bold mb-3">Payment Successful!</h2>
          <p className="text-muted mb-4">Your booking has been confirmed. Booking reference: <span className="fw-bold text-primary">IND6E7F9K2</span></p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary px-5 py-3">
              <i className="fas fa-download me-2"></i>
              Download Ticket
            </button>
            <button className="btn btn-outline-primary px-5 py-3">
              <i className="fas fa-envelope me-2"></i>
              Email Confirmation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {[
            { step: 1, label: "Flight", icon: "fa-plane" },
            { step: 2, label: "Passengers", icon: "fa-users" },
            { step: 3, label: "Seats", icon: "fa-chair" },
            { step: 4, label: "Payment", icon: "fa-credit-card", active: true },
            { step: 5, label: "Confirm", icon: "fa-check-circle" }
          ].map((item) => (
            <div key={item.step} className="text-center position-relative" style={{ width: '20%' }}>
              <div className={`rounded-circle p-3 mx-auto mb-2 ${
                item.active ? 'bg-primary' : item.step < 4 ? 'bg-success' : 'bg-light'
              }`} style={{ width: '50px', height: '50px' }}>
                <i className={`fas ${item.icon} ${
                  item.active || item.step < 4 ? 'text-white' : 'text-secondary'
                }`}></i>
              </div>
              <span className={`small fw-semibold d-none d-md-block ${
                item.active ? 'text-primary' : 'text-muted'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="progress" style={{ height: '3px' }}>
          <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
        </div>
      </div>

      <div className="row">
        {/* Payment Methods - Left Side */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h4 className="fw-bold mb-0">
                <i className="fas fa-credit-card text-primary me-2"></i>
                Payment Methods
              </h4>
              <p className="text-muted mb-0">Select your preferred payment method</p>
            </div>

            <div className="card-body p-4">
              {/* Payment Method Tabs */}
              <div className="row g-3 mb-4">
                {[
                  { id: "credit-card", label: "Credit/Debit Card", icon: "fa-credit-card" },
                  { id: "upi", label: "UPI", icon: "fa-mobile-alt" },
                  { id: "netbanking", label: "Net Banking", icon: "fa-university" },
                  { id: "wallet", label: "Wallets", icon: "fa-wallet" },
                ].map((method) => (
                  <div className="col-md-3 col-6" key={method.id}>
                    <button
                      className={`btn w-100 py-3 rounded-3 border-2 ${
                        paymentMethod === method.id 
                          ? 'btn-primary text-white' 
                          : 'btn-outline-secondary bg-white'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <i className={`fas ${method.icon} me-2`}></i>
                      <span className="small d-block d-md-inline">{method.label}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Credit/Debit Card Form */}
              {paymentMethod === "credit-card" && (
                <div className="credit-card-form">
                  {/* Card Preview */}
                  <div className="bg-primary text-white p-4 rounded-4 mb-4 position-relative" 
                       style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <i className="fas fa-credit-card fs-1"></i>
                      <i className="fas fa-wifi fs-2" style={{ transform: 'rotate(90deg)' }}></i>
                    </div>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-0">
                        {cardDetails.cardNumber || "**** **** **** ****"}
                      </h5>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <small>CARD HOLDER</small>
                        <p className="fw-bold mb-0">
                          {cardDetails.cardHolder || "YOUR NAME"}
                        </p>
                      </div>
                      <div>
                        <small>EXPIRY</small>
                        <p className="fw-bold mb-0">
                          {cardDetails.expiry || "MM/YY"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="fw-semibold mb-2">Card Number</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        value={cardDetails.cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\s/g, '');
                          if (value.length > 0) {
                            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
                          }
                          setCardDetails({...cardDetails, cardNumber: value});
                        }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="fw-semibold mb-2">Card Holder Name</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="As on card"
                        value={cardDetails.cardHolder}
                        onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value.length === 2 && !value.includes('/')) {
                            value = value + '/';
                          }
                          setCardDetails({...cardDetails, expiry: value});
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold mb-2">
                        CVV
                        <i className="fas fa-question-circle ms-2 text-muted" 
                           data-bs-toggle="tooltip" 
                           title="3 or 4 digit code on back of card"></i>
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="***"
                        maxLength="4"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="saveCard"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="saveCard">
                          Save card for future payments
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex align-items-center gap-3">
                        <i className="fab fa-cc-visa fs-1 text-primary"></i>
                        <i className="fab fa-cc-mastercard fs-1 text-danger"></i>
                        <i className="fab fa-cc-amex fs-1 text-info"></i>
                        <i className="fab fa-cc-discover fs-1 text-warning"></i>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {paymentMethod === "upi" && (
                <div>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="fw-semibold mb-2">UPI ID</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="username@okhdfcbank"
                        value={upiDetails.upiId}
                        onChange={(e) => setUpiDetails({...upiDetails, upiId: e.target.value})}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button className="btn btn-primary w-100 py-3">
                        Verify
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-3">Popular UPI Apps</p>
                    <div className="d-flex flex-wrap gap-3">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((app) => (
                        <button key={app} className="btn btn-outline-secondary">
                          <img 
                            src={`/images/${app.toLowerCase().replace(' ', '-')}.png`} 
                            alt={app}
                            style={{ height: '30px' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="alert alert-info mt-4">
                    <i className="fas fa-info-circle me-2"></i>
                    You will receive a notification on your UPI app to complete the payment
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {paymentMethod === "netbanking" && (
                <div>
                  <div className="mb-3">
                    <label className="fw-semibold mb-2">Select Your Bank</label>
                    <select 
                      className="form-select form-select-lg"
                      value={netBankingDetails.bank}
                      onChange={(e) => setNetBankingDetails({...netBankingDetails, bank: e.target.value})}
                    >
                      <option value="">Choose a bank</option>
                      <optgroup label="Popular Banks">
                        {popularBanks.map(bank => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded-3">
                        <h6 className="fw-bold mb-2">Other Banks</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {["Canara Bank", "Union Bank", "Indian Bank", "IDBI", "Yes Bank"].map(bank => (
                            <button key={bank} className="btn btn-sm btn-outline-secondary">
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded-3">
                        <h6 className="fw-bold mb-2">International Banks</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {["Citibank", "HSBC", "Standard Chartered", "Deutsche Bank"].map(bank => (
                            <button key={bank} className="btn btn-sm btn-outline-secondary">
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Form */}
              {paymentMethod === "wallet" && (
                <div>
                  <div className="row g-3">
                    {wallets.map(wallet => (
                      <div className="col-md-4 col-6" key={wallet.name}>
                        <button 
                          className={`btn w-100 py-3 border-2 ${
                            walletDetails.wallet === wallet.name 
                              ? 'btn-primary text-white' 
                              : 'btn-outline-secondary bg-white'
                          }`}
                          onClick={() => setWalletDetails({...walletDetails, wallet: wallet.name})}
                        >
                          <i className={`fas ${wallet.icon} me-2`}></i>
                          {wallet.name}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="bg-light p-3 rounded-3">
                      <h6 className="fw-bold mb-2">Wallet Balance</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Paytm Wallet</span>
                        <span className="fw-bold text-success">₹1,500</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="text-muted">Amazon Pay</span>
                        <span className="fw-bold text-success">₹750</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="mt-4 pt-4 border-top">
                <div className="row g-3">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter promo code"
                    />
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-outline-primary w-100 py-3">
                      Apply
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-light text-dark p-2 border">FIRSTFLY</span>
                  <span className="badge bg-light text-dark p-2 border">SAVE500</span>
                  <span className="badge bg-light text-dark p-2 border">WELCOME200</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary - Right Side */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 sticky-lg-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white border-0 rounded-top-4 p-4">
              <h5 className="fw-bold mb-0">Payment Summary</h5>
            </div>

            <div className="card-body p-4">
              {/* Flight Info */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Flight Details</h6>
                <div className="bg-light p-3 rounded-3">
                  <p className="fw-bold mb-2">{bookingSummary.flight.from} → {bookingSummary.flight.to}</p>
                  <p className="small text-muted mb-1">
                    <i className="fas fa-plane me-2"></i>
                    {bookingSummary.flight.airline} • {bookingSummary.flight.flightNumber}
                  </p>
                  <p className="small text-muted mb-0">
                    <i className="far fa-clock me-2"></i>
                    {bookingSummary.flight.departureTime} • {bookingSummary.flight.departureDate}
                  </p>
                </div>
              </div>

              {/* Passenger Summary */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Passenger Details</h6>
                {bookingSummary.passengers.map((passenger, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="badge bg-primary me-2">{index + 1}</span>
                      <span>{passenger.name}</span>
                    </div>
                    <div>
                      <span className="badge bg-info me-2">Seat {passenger.seat}</span>
                      <span className="fw-bold">{formatPrice(passenger.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              {bookingSummary.addons.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Add-ons</h6>
                  {bookingSummary.addons.map((addon, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">{addon.name}</span>
                      <span className="fw-bold">{formatPrice(addon.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Details</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Base Fare</span>
                  <span className="fw-bold">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Add-ons</span>
                  <span className="fw-bold">{formatPrice(calculateAddonsTotal())}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Taxes & Fees</span>
                  <span className="fw-bold">{formatPrice(bookingSummary.taxes)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h5 fw-bold">Total</span>
                  <span className="h4 fw-bold text-primary">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="terms">
                    I agree to the <a href="#" className="text-primary">Terms & Conditions</a> and 
                    <a href="#" className="text-primary"> Cancellation Policy</a>
                  </label>
                </div>
              </div>

              {/* Pay Button */}
              <button
                className="btn btn-primary w-100 py-3 fw-bold mb-3"
                onClick={handlePayment}
                disabled={processing || !acceptedTerms}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatPrice(calculateTotal())}
                    <i className="fas fa-lock ms-2"></i>
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="text-center">
                <div className="d-flex justify-content-center gap-3 mb-2">
                  <i className="fab fa-cc-visa fs-2 text-muted"></i>
                  <i className="fab fa-cc-mastercard fs-2 text-muted"></i>
                  <i className="fab fa-cc-amex fs-2 text-muted"></i>
                  <i className="fab fa-cc-discover fs-2 text-muted"></i>
                </div>
                <p className="small text-muted mb-0">
                  <i className="fas fa-shield-alt text-success me-2"></i>
                  256-bit SSL Secure Payment
                </p>
                <p className="small text-muted">
                  <i className="fas fa-lock text-success me-2"></i>
                  Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Enter OTP</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowOtpModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">
                  We've sent a 6-digit OTP to your registered mobile number ending with 7890
                </p>
                
                <div className="d-flex justify-content-center gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      className="form-control text-center"
                      style={{ width: '50px', height: '60px', fontSize: '24px' }}
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                    />
                  ))}
                </div>

                <p className="text-center mb-0">
                  <a href="#" className="text-primary text-decoration-none">
                    Resend OTP
                  </a>
                  <span className="text-muted mx-2">|</span>
                  <span className="text-muted">30s left</span>
                </p>
              </div>
              <div className="modal-footer border-0">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowOtpModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleOtpSubmit}
                  disabled={otp.some(d => !d)}
                >
                  Verify & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;