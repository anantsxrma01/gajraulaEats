const PlatformSettings = require("../models/PlatformSettings");
const { getPlatformSettings } = require("../utils/settingsService");

// GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    const settings = await getPlatformSettings();
    res.json({ success: true, settings });
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    const settings = await getPlatformSettings();

    const {
      platform_center,
      platform_radius_km,
      delivery_base_fee,
      delivery_base_distance_km,
      delivery_per_km_fee_after_base,
      default_shop_commission_percent,
      default_dp_per_km_rate,
      is_service_active
    } = req.body;

    if (platform_center) {
      if (typeof platform_center.lat === "number") {
        settings.platform_center.lat = platform_center.lat;
      }
      if (typeof platform_center.lng === "number") {
        settings.platform_center.lng = platform_center.lng;
      }
    }

    if (typeof platform_radius_km === "number") {
      settings.platform_radius_km = platform_radius_km;
    }
    if (typeof delivery_base_fee === "number") {
      settings.delivery_base_fee = delivery_base_fee;
    }
    if (typeof delivery_base_distance_km === "number") {
      settings.delivery_base_distance_km = delivery_base_distance_km;
    }
    if (typeof delivery_per_km_fee_after_base === "number") {
      settings.delivery_per_km_fee_after_base = delivery_per_km_fee_after_base;
    }
    if (typeof default_shop_commission_percent === "number") {
      settings.default_shop_commission_percent = default_shop_commission_percent;
    }
    if (typeof default_dp_per_km_rate === "number") {
      settings.default_dp_per_km_rate = default_dp_per_km_rate;
    }
    if (typeof is_service_active === "boolean") {
      settings.is_service_active = is_service_active;
    }

    await settings.save();

    res.json({ success: true, settings });
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
