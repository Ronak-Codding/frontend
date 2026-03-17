import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  Plane,
  CheckCircle,
  Smartphone,
  Building2,
  Wallet,
} from "lucide-react";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

const BANKS = [
  "SBI",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Bank",
  "Punjab National Bank",
];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const bookingId = searchParams.get("bookingId");
  const price = parseFloat(searchParams.get("price") || "0");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const flight = searchParams.get("flight");
  const seats = searchParams.get("seats");
  const date = searchParams.get("date");
  const passengers = searchParams.get("passengers");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  // Net Banking
  const [bank, setBank] = useState("");

  const formatCard = (val) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? clean.slice(0, 2) + "/" + clean.slice(2) : clean;
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/booking/payu-initiate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: price,
            name: name || "Test User",
            email: "test@gmail.com", // Valid email ZAROOR
            phone: "9999999999",
            bookingId,
            from,
            to,
            flight,
          }),
        },
      );

      const data = await res.json();
      if (!data.success) throw new Error("Initiate failed");

      // Hidden form submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payuUrl;
      form.style.display = "none";

      Object.entries(data.payuData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value ?? ""; // null/undefined → empty string
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Payment failed: " + err.message);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Booking Confirmed!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Your flight {flight} from {from} to {to} has been booked
            successfully.
          </p>

          <div className="mb-6 rounded-2xl border border-border/50 bg-card/80 p-6 text-left backdrop-blur-xl">
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground text-sm">Booking ID</span>
              <span className="font-mono text-sm text-foreground">
                {bookingId?.slice(-8).toUpperCase() ||
                  "BK" + Math.random().toString(36).slice(2, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground text-sm">Flight</span>
              <span className="text-sm text-foreground">{flight}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground text-sm">Route</span>
              <span className="text-sm text-foreground">
                {from} → {to}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground text-sm">Amount Paid</span>
              <span className="font-bold text-primary">
                ₹{price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Plane className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Payment</h1>
          <span className="text-sm text-muted-foreground">
            {from} → {to} · {flight}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Left - Payment Form */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Payment Method Tabs */}
            <div className="rounded-2xl border border-border/50 bg-card/80 p-4 backdrop-blur-xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      method === id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Form */}
            {method === "card" && (
              <div className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-xl flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCard(e.target.value))
                      }
                      className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {method === "upi" && (
              <div className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  UPI ID
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  e.g. name@okaxis, name@ybl, name@paytm
                </p>
              </div>
            )}

            {/* Net Banking */}
            {method === "netbanking" && (
              <div className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Select Bank
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {BANKS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBank(b)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        bank === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet */}
            {method === "wallet" && (
              <div className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
                <div className="grid grid-cols-3 gap-2">
                  {["Paytm", "PhonePe", "Amazon Pay"].map((w) => (
                    <button
                      key={w}
                      className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          <div className="md:col-span-2">
            <div className="sticky top-6 rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Order Summary
              </p>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight</span>
                  <span className="text-foreground">{flight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route</span>
                  <span className="text-foreground">
                    {from} → {to}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/30 pt-3">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span className="text-foreground">
                    ₹{(price * 0.85).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span className="text-foreground">
                    ₹{(price * 0.15).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-3 font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary text-lg">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay ₹{price.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Secured & Encrypted Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
