import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Plane,
  Calendar,
  Users,
  Download,
  Home,
  MapPin,
  Ticket,
} from "lucide-react";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const bookingId = searchParams.get("bookingId");
  const price = parseFloat(searchParams.get("price") || "0");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const flight = searchParams.get("flight");
  const date = searchParams.get("date");

  // ✅ URL se seats lo (PayU redirect se aata hai)
  const seatsParam = searchParams.get("seats") || "";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking details from MongoDB
  useEffect(() => {
    async function fetchBooking() {
      try {
        if (!bookingId) return;
        const res = await fetch(
          `http://localhost:5000/api/booking/${bookingId}`,
        );
        const data = await res.json();
        if (res.ok) setBooking(data);
      } catch (err) {
        console.error("Booking fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  // ✅ Seats - pehle booking se lo, nahi toh URL param se
  const displaySeats =
    booking?.seats?.length > 0 ? booking.seats.join(", ") : seatsParam || "—";

  // ✅ Passengers count - booking se lo
  const passengersCount = booking?.passengers?.length || 1;

  const shortId = bookingId
    ? "BK" + bookingId.slice(-6).toUpperCase()
    : "BK" + Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Success Banner */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your ticket has been booked successfully. Have a great flight! ✈️
          </p>
        </div>

        {/* Ticket Card */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl">
          {/* Top colored bar */}
          <div className="h-2 w-full bg-primary" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-border/30 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Booking ID
              </p>
              <p className="font-mono text-xl font-bold text-primary">
                {shortId}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">
                Confirmed
              </span>
            </div>
          </div>

          {/* Flight Info */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              {/* From */}
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{from}</p>
                <p className="mt-1 text-sm text-muted-foreground">Origin</p>
              </div>

              {/* Middle */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-px w-16 bg-border" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-px w-16 bg-border" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {flight}
                </p>
              </div>

              {/* To */}
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{to}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Destination
                </p>
              </div>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="relative flex items-center px-6">
            <div className="absolute -left-4 h-8 w-8 rounded-full bg-background" />
            <div className="w-full border-t-2 border-dashed border-border/50" />
            <div className="absolute -right-4 h-8 w-8 rounded-full bg-background" />
          </div>

          {/* Ticket Details */}
          <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3 w-3" /> Date
              </p>
              <p className="font-semibold text-foreground">{date || "—"}</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Users className="h-3 w-3" /> Passengers
              </p>
              <p className="font-semibold text-foreground">
                {passengersCount} Adult(s)
              </p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Ticket className="h-3 w-3" /> Seat(s)
              </p>
              {/* ✅ Fixed - booking se ya URL se seats dikhao */}
              <p className="font-semibold text-foreground">{displaySeats}</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3 w-3" /> Class
              </p>
              <p className="font-semibold text-foreground">Economy</p>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="relative flex items-center px-6">
            <div className="absolute -left-4 h-8 w-8 rounded-full bg-background" />
            <div className="w-full border-t-2 border-dashed border-border/50" />
            <div className="absolute -right-4 h-8 w-8 rounded-full bg-background" />
          </div>

          {/* Passenger Info from MongoDB */}
          {booking?.passengers?.[0] && (
            <div className="p-6 border-b border-border/30">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Passenger Info
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Name: </span>
                  <span className="font-medium text-foreground">
                    {booking.passengers[0].fullName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Passport: </span>
                  <span className="font-medium text-foreground">
                    {booking.passengers[0].passportNumber}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-medium text-foreground">
                    {booking.passengers[0].email}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone: </span>
                  <span className="font-medium text-foreground">
                    {booking.passengers[0].phone}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between p-6">
            <p className="text-muted-foreground">Total Amount Paid</p>
            <p className="text-2xl font-bold text-primary">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-all"
          >
            <Download className="h-4 w-4" />
            Download Ticket
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
