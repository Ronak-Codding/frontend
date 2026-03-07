import { useState } from "react";
import { Plane, Calendar, Users, ArrowRightLeft, Search } from "lucide-react";

export default function BookingForm() {
  const [tripType, setTripType] = useState("roundtrip");

  return (
    <section className="relative -mt-32 z-20 px-4 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
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
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                From
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Plane className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 text-muted-foreground" />
              </div>
            </div>

            {/* To */}
            <div className="group relative">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                To
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Plane className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 -rotate-45 text-muted-foreground" />
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
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Passengers */}
            <div className="group relative">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Passengers
              </label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-border bg-secondary/50 px-4 py-4 pr-10 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                  <option>4+ Adults</option>
                </select>
                <Users className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-center md:justify-end">
            <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.4)] md:w-auto">
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
