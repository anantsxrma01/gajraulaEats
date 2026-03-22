// MVP version: total rejected_assignments के base पर rule
async function handleFrequentRejectionRule(partner) {
  try {
    const totalRejects = partner.rejected_assignments || 0;

    // Example threshold: 10 rejections total → flag
    const THRESHOLD = 10;

    if (totalRejects >= THRESHOLD) {
      await fraudService.raiseFraudFlag({
        entity_type: "DELIVERY_PARTNER",
        entity_id: partner._id,
        type: "FREQUENT_REJECTION",
        severity: 2,
        risk_points: 10,
        message: `Partner has rejected ${totalRejects} orders so far`
      });

      // Optionally: auto action inside fraudService (e.g., set is_online=false if risk high)
    }
  } catch (err) {
    console.error("handleFrequentRejectionRule error:", err);
  }
}
