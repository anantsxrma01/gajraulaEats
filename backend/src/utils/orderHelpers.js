const { distanceInKm } = require("./distance");

// Simple order number: GAJ-YYYYMMDD-<random>
function generateOrderNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GAJ-${yyyy}${mm}${dd}-${rand}`;
}

// Delivery charge based on platform settings
function calculateDeliveryCharge(distanceKm, settings) {
  const baseFee = settings?.delivery_base_fee ?? 20;
  const baseDistance = settings?.delivery_base_distance_km ?? 3;
  const perKm = settings?.delivery_per_km_fee_after_base ?? 5;

  if (distanceKm <= baseDistance) return baseFee;

  const extraKm = Math.max(0, distanceKm - baseDistance);
  const extra = Math.ceil(extraKm) * perKm;

  return baseFee + extra;
}

module.exports = {
  generateOrderNumber,
  calculateDeliveryCharge
};