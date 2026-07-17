const Artwork = require("../models/Artwork");
const Settings = require("../models/Settings");
const ArtistProfile = require("../models/ArtistProfile");

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

const getOrCreateProfile = async () => {
  let profile = await ArtistProfile.findOne();
  if (!profile) {
    profile = await ArtistProfile.create({});
  }
  return profile;
};

const toPlainObject = (document) => {
  if (!document) return null;
  return document.toObject ? document.toObject({ versionKey: false }) : document;
};

const buildPublicSnapshot = async () => {
  const [settings, profile, artworks, categories] = await Promise.all([
    getOrCreateSettings(),
    getOrCreateProfile(),
    Artwork.find({}).sort({ createdAt: -1 }).lean({ versionKey: false }),
    Artwork.distinct("category"),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    settings: toPlainObject(settings),
    profile: toPlainObject(profile),
    artworks,
    categories: categories.filter(Boolean).sort(),
  };
};

module.exports = { buildPublicSnapshot };
