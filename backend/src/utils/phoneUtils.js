/**
 * Normalize a phone number to a 10-digit string.
 * Strips spaces, +91, 91 prefix. Returns digits only.
 * @param {string} phone
 * @returns {string} 10-digit phone
 */
function normalizePhone(phone) {
  if (!phone) return "";
  // Remove all non-digit characters except leading +
  let p = String(phone).trim();
  // Remove +91 or 91 prefix
  p = p.replace(/^\+91/, "").replace(/^91(?=\d{10}$)/, "");
  // Remove any remaining non-digit chars (spaces, dashes)
  p = p.replace(/\D/g, "");
  return p;
}

module.exports = { normalizePhone };
