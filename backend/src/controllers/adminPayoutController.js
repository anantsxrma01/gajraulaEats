// backend/src/controllers/adminPayoutController.js

// NOTE: अभी हम सिर्फ़ dummy / minimal implementation रख रहे हैं
// ताकि routes सही से load हों और server क्रैश न हो।

// GET /api/admin/payouts
const listPayouts = async (req, res) => {
  try {
    // Future: yahan DB se actual payouts list karna
    res.json({
      success: true,
      payouts: [],
      message: "Payouts listing not implemented yet (stub)."
    });
  } catch (err) {
    console.error("listPayouts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/payouts/:id
const getPayoutDetail = async (req, res) => {
  try {
    const { id } = req.params;
    // Future: yahan DB se single payout fetch karna
    res.json({
      success: true,
      payout: null,
      message: `Payout detail stub for id=${id}`
    });
  } catch (err) {
    console.error("getPayoutDetail error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/payouts/:id/mark-paid
const markPayoutPaid = async (req, res) => {
  try {
    const { id } = req.params;
    // Future: DB me payout ko PAID mark karna
    res.json({
      success: true,
      message: `Payout ${id} marked as PAID (stub).`
    });
  } catch (err) {
    console.error("markPayoutPaid error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listPayouts,
  getPayoutDetail,
  markPayoutPaid
};
// NOTE: इस file में सिर्फ़ admin के payouts related endpoints हैं
// बाकी endpoints जैसे delivery partner payouts, shop payouts, etc. अलग files में होंगे
// ताकि code modular रहे और समझने में आसान हो
// Future: जब actual DB integration hoga, tab yahan actual logic implement karna
// अभी सिर्फ़ stubs hain taaki routes ka structure ready rahe
// और server crash na ho
// इस file ka purpose hai ki admin payouts ke endpoints ready rahein
// और baaki files mein bhi consistency bani rahe