const PlatformSettings = require("../models/PlatformSettings");

// Always returns a settings doc (creates default if missing)
async function getPlatformSettings() {
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) {
    return {
      platform_center: { lat: 28.8459, lng: 78.2323 },
      platform_radius_km: 30,
    };
  }

  let settings = await PlatformSettings.findOne({ key: "GLOBAL" });

  if (!settings) {
    settings = await PlatformSettings.create({ key: "GLOBAL" });
  }

  return settings;
}

module.exports = {
  getPlatformSettings
};
