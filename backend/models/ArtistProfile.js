// models/ArtistProfile.js
// Artist's public-facing profile information

const mongoose = require("mongoose");

const artistProfileSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },       // Cloudinary URL
    profilePhotoPublicId: { type: String, default: "" }, // For deletion
    about: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArtistProfile", artistProfileSchema);
