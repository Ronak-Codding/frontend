import { useState, useEffect } from "react";
import { Menu, X, Plane } from "lucide-react";

const navLinks = [
  { label: "Flights", href: "#flights" },
  { label: "Destinations", href: "#destinations" },
  { label: "Experience", href: "#experience" },
  { label: "Loyalty", href: "#loyalty" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 py-3 shadow-xl backdrop-blur-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
            <Plane className="h-5 w-5 text-primary-foreground transition-transform group-hover:rotate-12" />
            <div className="absolute inset-0 rounded-full bg-primary opacity-0 blur-lg transition-opacity group-hover:opacity-50" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Sky<span className="text-primary">Voyage</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <button className="text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white">
            Sign In
          </button>
          <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]">
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden bg-background/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? "max-h-[500px] border-b border-border" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <button className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:bg-white/5 hover:text-white">
              Sign In
            </button>
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
