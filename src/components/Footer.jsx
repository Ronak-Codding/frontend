import { Plane, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Baggage Info", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" className="group flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Sky<span className="text-primary">Voyage</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Experience luxury travel reimagined. Flying you to over 200 destinations with unmatched comfort and service.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Aviation Blvd, Sky City</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (800) SKY-VOYAGE</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@skyvoyage.com</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 SkyVoyage Airlines. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
