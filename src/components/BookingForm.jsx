import { useState } from "react";
import { Plane, Users, ArrowRightLeft, Search } from "lucide-react";
import AirportAutocomplete from "../components/AirportAutocomplete";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const [tripType, setTripType] = useState("roundtrip");
  const fromCode = searchParams.get("from");
  const toCode = searchParams.get("to");

  const [departureDate, setDepartureDate] = useState(
    searchParams.get("date") || "",
  );
  const [passengers, setPassengers] = useState(
    searchParams.get("passengers") || "1",
  );
  const [fromAirport, setFromAirport] = useState(
    fromCode ? { airport_code: fromCode, city: fromCode } : null,
  );
  const [toAirport, setToAirport] = useState(
    toCode ? { airport_code: toCode, city: toCode } : null,
  );

  // ✅ Login check state
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Search clicked");

    const token = localStorage.getItem("usertoken");

    if (!token || token === "undefined" || token === "null") {
      setShowLoginAlert(true);
      return;
    }
    if (!departureDate) {
      alert("Please select departure date");
      return;
    }
    if (fromAirport.airport_code === toAirport.airport_code) {
      alert("From and To airports cannot be same");
      return;
    }
    navigate(
      `/results?from=${fromAirport.airport_code}&to=${toAirport.airport_code}&date=${departureDate}&passengers=${passengers}`,
    );
  };

  return (
    <section id="flight-search" className="relative -mt-32 z-20 px-4 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          {/* Login Alert Modal */}
          {showLoginAlert && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowLoginAlert(false)}
            >
              <div
                className="mx-4 w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Plane className="h-7 w-7 text-primary" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="mb-2 text-center text-lg font-bold text-foreground">
                  Login Required
                </h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Please login to search and book flights.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLoginAlert(false)}
                    className="flex-1 rounded-xl border border-border bg-secondary/50 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginAlert(false);
                      navigate("/login");
                    }}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
                  >
                    Login
                  </button>
                </div>

                {/* Register link */}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  New user?
                  <button
                    onClick={() => {
                      setShowLoginAlert(false);
                      navigate("/register");
                    }}
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Trip Type Toggle */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setTripType("roundtrip")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                tripType === "roundtrip"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Round Trip
            </button>
            <button
              onClick={() => setTripType("oneway")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                tripType === "oneway"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Plane className="h-4 w-4" />
              One Way
            </button>
          </div>

          {/* Search Form */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* From */}
            <div className="group relative">
              <div className="relative">
                <div className="group relative">
                  <AirportAutocomplete
                    label="From"
                    icon="fa-plane-departure"
                    value={fromAirport}
                    onSelect={(airport) => setFromAirport(airport)}
                  />
                </div>
              </div>
            </div>

            {/* To */}
            <div className="group relative">
              <div className="relative">
                <div className="group relative">
                  <AirportAutocomplete
                    label="To"
                    icon="fa-plane-arrival"
                    value={toAirport}
                    onSelect={(airport) => setToAirport(airport)}
                  />
                </div>
              </div>
            </div>

            {/* Departure */}
            <div className="group relative">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Departure
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Return */}
            <div
              className={`group relative ${tripType === "oneway" ? "opacity-50 pointer-events-none" : ""}`}
            >
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Return
              </label>
              <div className="relative">
                <input
                  type="date"
                  disabled={tripType === "oneway"}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="group relative">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Passengers
              </label>
              <div className="relative">
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adult</option>
                  <option value="3">3 Adult</option>
                  <option value="4">4 Adult</option>
                  <option value="5">5 Adult</option>
                  <option value="6">6 Adult</option>
                </select>
                <Users className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-center md:justify-end">
            <button
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.4)] md:w-auto"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
              <span>Search Flights</span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
