const ActivityLog = require("../models/ActivityLog");

const getIpAddress = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) return String(forwardedFor).split(",")[0].trim();
  return req.ip || req.socket?.remoteAddress || "";
};

const getDevice = (userAgent = "") => {
  if (/mobile|android|iphone|ipad/i.test(userAgent)) return "Mobile";
  if (/tablet/i.test(userAgent)) return "Tablet";
  return "Desktop";
};

const logActivity = async (req, { admin = null, action, module, metadata = {} }) => {
  try {
    const userAgent = req.headers["user-agent"] || "";

    await ActivityLog.create({
      admin: admin || req.user?._id || null,
      action,
      module,
      ipAddress: getIpAddress(req),
      browser: userAgent.slice(0, 240),
      device: getDevice(userAgent),
      metadata,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Activity log error:", error.message);
    }
  }
};

module.exports = { logActivity };
