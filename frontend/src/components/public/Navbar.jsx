// components/public/Navbar.jsx
// Responsive luxury navigation with scroll effect

import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="container-site">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Site Title */}
          <Link to="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : null}
            <span
              className={`font-display text-xl font-medium tracking-wide transition-colors duration-300 ${
                scrolled ? "text-charcoal" : "text-white"
              }`}
            >
              {settings?.websiteTitle || "Artist Portfolio"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-label font-medium tracking-widest uppercase transition-colors duration-200 pb-1 border-b-2 ${
                      isActive
                        ? "border-gold text-gold"
                        : `border-transparent ${scrolled ? "text-charcoal hover:text-gold" : "text-white/90 hover:text-white"}`
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 transition-colors ${scrolled ? "text-charcoal" : "text-white"}`}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden bg-charcoal transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container-site flex flex-col py-4 gap-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block py-3 px-2 text-sm font-label tracking-widest uppercase transition-colors ${
                    isActive ? "text-gold" : "text-white/80 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
