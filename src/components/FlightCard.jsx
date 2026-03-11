import { Plane, Clock, IndianRupee } from "lucide-react";

export default function FlightCard({ flight }) {
  const offer = flight.itineraries[0];
  const segment = offer.segments[0];
  const price = flight.price.total;
  const currency = flight.price.currency;
  const duration = offer.duration.replace("PT", "").toLowerCase(); // e.g. "2h 30m"

  const departure = segment.departure.at.split("T"); // ["2026-04-01", "06:00:00"]
  const arrival = segment.arrival.at.split("T");

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-md backdrop-blur-xl hover:border-primary/40 transition-all">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Airline + Flight No */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {segment.carrierCode} {segment.number}
            </p>
            <p className="text-xs text-muted-foreground">
              {segment.aircraft?.code || "Aircraft"}
            </p>
          </div>
        </div>

        {/* Departure → Arrival */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {departure[1].slice(0, 5)}
            </p>
            <p className="text-xs text-muted-foreground">
              {segment.departure.iataCode}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <div className="h-px w-16 bg-border" />
            <p className="text-xs text-muted-foreground">{duration}</p>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {arrival[1].slice(0, 5)}
            </p>
            <p className="text-xs text-muted-foreground">
              {segment.arrival.iataCode}
            </p>
          </div>
        </div>

        {/* Price + Button */}
        <div className="flex items-center gap-4 md:flex-col md:items-end">
          <div className="flex items-center gap-1 text-primary">
            <IndianRupee className="h-4 w-4" />
            <span className="text-xl font-bold">
              {parseFloat(price).toLocaleString("en-IN")}
            </span>
          </div>
          <button className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
