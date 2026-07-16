// components/public/Footer.jsx

import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <defs>
        <radialGradient id="instagram-gradient" cx="30%" cy="107%" r="140%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="10%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="url(#instagram-gradient)" />
      <rect x="6.8" y="6.8" width="10.4" height="10.4" rx="3.2" stroke="white" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.6" stroke="white" strokeWidth="1.7" />
      <circle cx="16.1" cy="7.9" r="1" fill="white" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path fill="white" d="M14.2 8.4V6.9c0-.7.5-.9 1-.9h1.8V3l-2.6-.1c-2.8 0-4.3 1.7-4.3 4.6v.9H7.3V12h2.8v9.7h4.1V12h2.8l.4-3.6h-3.2Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#FF0000" d="M21.6 7.1a3 3 0 0 0-2.1-2.1C17.6 4.5 12 4.5 12 4.5s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.9 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.9Z" />
      <path fill="white" d="M10 15.4V8.6l5.8 3.4-5.8 3.4Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path fill="white" d="M12.1 5.3a6.6 6.6 0 0 0-5.7 9.9l-.9 3.4 3.5-.9a6.7 6.7 0 1 0 3.1-12.4Zm0 12.2a5.4 5.4 0 0 1-2.8-.8l-.2-.1-2.1.5.6-2-.1-.2a5.4 5.4 0 1 1 4.6 2.6Zm3-4.1c-.2-.1-1-.5-1.2-.5-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a4.5 4.5 0 0 1-2.2-1.9c-.1-.2 0-.3.1-.4l.3-.3.2-.4v-.4l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4c-.1 0-.3.1-.5.2-.2.2-.7.7-.7 1.7s.7 1.9.8 2.1c.1.1 1.5 2.3 3.6 3.2.5.2.9.3 1.2.4.5.2 1 .1 1.4.1.4-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  ),
};

const SocialLink = ({ href, label, icon }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white transition-transform hover:-translate-y-0.5 hover:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-charcoal"
    >
      {icon}
    </a>
  );
};

const Footer = () => {
  const { settings } = useSettings();
  const whatsappLink = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
    : "";

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
            <div className="flex flex-wrap gap-3">
              <SocialLink href={settings?.instagram} label="Instagram" icon={socialIcons.instagram} />
              <SocialLink href={settings?.facebook} label="Facebook" icon={socialIcons.facebook} />
              <SocialLink href={settings?.youtube} label="YouTube" icon={socialIcons.youtube} />
              <SocialLink href={whatsappLink} label="WhatsApp" icon={socialIcons.whatsapp} />
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
