import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Plane, User, LogOut, LayoutDashboard } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Flight Search", href: "/user/search" },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
  { label: "Services", href: "/services" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ─── Auth State ───────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("usertoken");
      const raw = localStorage.getItem("user");
      if (token && raw) {
        try {
          setCurrentUser(JSON.parse(raw));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth:change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth:change", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
  };
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href === "#flight-search") {
      e.preventDefault();
      if (location.pathname === "/") {
        document
          .getElementById("flight-search")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document
            .getElementById("flight-search")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      setIsMobileMenuOpen(false);
    }
  };

  // Short display name
  const displayName = currentUser?.fullname
    ? currentUser.fullname.split(" ").length > 1
      ? `${currentUser.fullname.split(" ")[0]} ${currentUser.fullname.split(" ").slice(-1)[0][0]}.`
      : currentUser.fullname
    : currentUser?.name
      ? currentUser.name.split(" ").length > 1
        ? `${currentUser.name.split(" ")[0]} ${currentUser.name.split(" ").slice(-1)[0][0]}.`
        : currentUser.name
      : "";

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
            Sky<span className="text-primary">Jet</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group relative text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Buttons — Desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          {currentUser ? (
            /* ── Logged-in state ── */
            <>
              {/* Dashboard Link */}
              <button
                onClick={() => navigate("/user/dashboard")}
                className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium uppercase tracking-wider text-primary transition-all hover:bg-primary/20 hover:border-primary/60"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </button>

              {/* User badge */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-white/90">
                  {displayName}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium uppercase tracking-wider text-white/80 transition-all hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            /* ── Logged-out state ── */
            <>
              <button
                className="text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]"
                onClick={() => navigate("/register")}
              >
                Register Now
              </button>
            </>
          )}
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
              onClick={(e) => {
                handleNavClick(e, link.href);
                setIsMobileMenuOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Auth Section */}
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            {currentUser ? (
              /* ── Mobile Logged-in ── */
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {currentUser.fullname || currentUser.name}
                    </span>
                    {currentUser.email && (
                      <span className="text-xs text-white/50">
                        {currentUser.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dashboard Button — Mobile */}
                <button
                  onClick={() => {
                    navigate("/user/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              /* ── Mobile Logged-out ── */
              <>
                <button
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
                <button
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]"
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Register Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
