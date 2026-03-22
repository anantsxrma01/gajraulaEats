const Address = require("../models/Address");
const { getPlatformSettings } = require("../utils/settingsService");
const { distanceInKm } = require("../utils/distance");

// Helper: calculate serviceability using settings from DB
async function checkServiceability(lat, lng) {
  const settings = await getPlatformSettings();

  const distance = distanceInKm(
    settings.platform_center.lat,
    settings.platform_center.lng,
    lat,
    lng
  );

  const distanceKm = Number(distance.toFixed(2));
  const isServiceable = distanceKm <= settings.platform_radius_km;

  return {
    isServiceable,
    distanceKm,
    radiusLimitKm: settings.platform_radius_km,
    center: settings.platform_center
  };
}

// POST /api/addresses
const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      lat,
      lng,
      is_default
    } = req.body;

    if (!line1 || lat == null || lng == null) {
      return res.status(400).json({
        message: "line1, lat and lng are required"
      });
    }

    const { isServiceable, distanceKm, radiusLimitKm, center } =
      await checkServiceability(lat, lng);

    const addressData = {
      user_id: userId,
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      is_serviceable: isServiceable,
      distance_from_center_km: distanceKm
    };

    // default address logic
    if (is_default) {
      await Address.updateMany(
        { user_id: userId, is_default: true },
        { $set: { is_default: false } }
      );
      addressData.is_default = true;
    }

    const address = await Address.create(addressData);

    res.status(201).json({
      success: true,
      address,
      message: isServiceable
        ? "Address saved and is within service area."
        : `Address saved but outside service radius (${radiusLimitKm} km from center).`,
      platform_center: center,
      radius_km: radiusLimitKm
    });
  } catch (err) {
    console.error("createAddress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/addresses
const getMyAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user_id: userId }).sort({
      is_default: -1,
      createdAt: -1
    });

    res.json({ success: true, addresses });
  } catch (err) {
    console.error("getMyAddresses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/addresses/:id/default
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user_id: userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.updateMany(
      { user_id: userId, is_default: true },
      { $set: { is_default: false } }
    );

    address.is_default = true;
    await address.save();

    res.json({ success: true, address });
  } catch (err) {
    console.error("setDefaultAddress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/addresses/check-service
const checkServiceArea = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const { isServiceable, distanceKm, radiusLimitKm, center } =
      await checkServiceability(lat, lng);

    res.json({
      success: true,
      is_serviceable: isServiceable,
      distance_from_center_km: distanceKm,
      radius_limit_km: radiusLimitKm,
      center
    });
  } catch (err) {
    console.error("checkServiceArea error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAddress,
  getMyAddresses,
  setDefaultAddress,
  checkServiceArea
};