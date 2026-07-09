const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      required: true,
      enum: ["auth", "security", "artworks", "inquiries", "profile", "settings", "system"],
    },
    ipAddress: {
      type: String,
      default: "",
    },
    browser: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ module: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
