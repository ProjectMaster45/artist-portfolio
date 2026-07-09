// components/public/Footer.jsx

import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-charcoal text-white">
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display text-2xl font-light mb-4">
              {settings?.websiteTitle || "Artist Portfolio"}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              {settings?.websiteDescription ||
                "Original artworks in oil, acrylic, watercolour and mixed media. Each piece is available for inquiry."}
            </p>
          </div>

          <div>
            <p className="eyebrow text-gold mb-4">Navigate</p>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/gallery", label: "Gallery" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold mb-4">Connect</p>
            <div className="space-y-2 mb-6">
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                >
                  {settings.contactEmail}
                </a>
              )}
              {settings?.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="block text-sm text-white/60 hover:text-white transition-colors"
                >
                  {settings.contactPhone}
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-gold transition-colors text-xs tracking-widest uppercase"
                >
                  Instagram
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-gold transition-colors text-xs tracking-widest uppercase"
                >
                  Facebook
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-gold transition-colors text-xs tracking-widest uppercase"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            {settings?.footerText || "(c) 2026 Artist Portfolio. All rights reserved."}
          </p>
          <Link
            to="/admin/login"
            className="text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
