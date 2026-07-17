const rateLimit = require("express-rate-limit");

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const readNumber = (name, defaultValue) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : defaultValue;
};

const logBlockedRequest = (req, reason) => {
  console.warn("Rate limit blocked request:", {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    endpoint: req.originalUrl,
    method: req.method,
    reason,
  });
};

const createJsonLimiter = ({ windowMs, max, message, reason }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logBlockedRequest(req, reason);
      return res.status(429).json({
        success: false,
        message,
      });
    },
  });

// Security: restrict repeated admin login attempts without changing auth behavior.
const loginRateLimiter = createJsonLimiter({
  windowMs: readNumber("LOGIN_RATE_LIMIT_WINDOW", FIFTEEN_MINUTES),
  max: readNumber("LOGIN_RATE_LIMIT_MAX", 5),
  message: "Too many login attempts. Please try again in 15 minutes.",
  reason: "login rate limit exceeded",
});

// Security: apply a conservative baseline limit to all API routes.
const generalRateLimiter = createJsonLimiter({
  windowMs: readNumber("GENERAL_RATE_LIMIT_WINDOW", FIFTEEN_MINUTES),
  max: readNumber("GENERAL_RATE_LIMIT_MAX", 100),
  message: "Too many requests.",
  reason: "general API rate limit exceeded",
});

// Security: limit Cloudinary-backed artwork upload endpoints.
const uploadRateLimiter = createJsonLimiter({
  windowMs: readNumber("UPLOAD_RATE_LIMIT_WINDOW", ONE_HOUR),
  max: readNumber("UPLOAD_RATE_LIMIT_MAX", 20),
  message: "Upload limit exceeded. Please try later.",
  reason: "upload rate limit exceeded",
});

module.exports = {
  loginRateLimiter,
  generalRateLimiter,
  uploadRateLimiter,
};
