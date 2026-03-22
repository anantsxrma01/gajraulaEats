// backend/src/services/fraudService.js

const mongoose = require("mongoose");
const FraudFlag = require("../models/FraudFlag");
const User = require("../models/User");
const Shop = require("../models/Shop");
const DeliveryPartner = require("../models/DeliveryPartner");

// 🔹 STEP 3: यहीं helper डालो
function getEntityModel(entityType) {
  switch (entityType) {
    case "USER":
      return User;
    case "SHOP":
      return Shop;
    case "DELIVERY_PARTNER":
      return DeliveryPartner;
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}

// 🔹 Auto-actions helper (Step 4)
async function applyAutoActions(entityType, entityDoc) {
  // Simple MVP rules

  if (entityType === "USER") {
    // Example: अगर risk score > 40 → COD block
    if (entityDoc.fraud_risk_score > 40 && !entityDoc.cod_blocked) {
      entityDoc.cod_blocked = true;
      // Optional: यहाँ comment field भी add कर सकते हो future में
    }
  }

  if (entityType === "SHOP") {
    // For now just threshold hold करो, auto-suspend नहीं
    // Example: if (entityDoc.fraud_risk_score > 60) { ... }
  }

  if (entityType === "DELIVERY_PARTNER") {
    // Example: अगर score > 50 -> future में auto temp block कर सकते हो
  }

  await entityDoc.save();
}

// 🔹 Main function (Step 5)
async function raiseFraudFlag({
  entity_type,
  entity_id,
  order_id = null,
  type,
  severity = 1,
  risk_points = 0,
  message = ""
}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const EntityModel = getEntityModel(entity_type);

    // 1. संबंधित entity load करो
    const entity = await EntityModel.findById(entity_id).session(session);

    if (!entity) {
      throw new Error(`Entity not found for fraud flag (${entity_type})`);
    }

    // 2. FraudFlag entry create करो
    const flag = await FraudFlag.create(
      [
        {
          entity_type,
          entity_id,
          order_id,
          type,
          severity,
          risk_points,
          message
        }
      ],
      { session }
    );

    // 3. Entity risk fields update करो
    entity.fraud_risk_score =
      (entity.fraud_risk_score || 0) + (risk_points || 0);
    entity.fraud_flags_count = (entity.fraud_flags_count || 0) + 1;
    entity.last_flagged_at = new Date();

    await entity.save({ session });

    // 4. Auto-action apply करो (COD block आदि)
    await applyAutoActions(entity_type, entity);

    await session.commitTransaction();
    session.endSession();

    return flag[0]; // created flag
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("raiseFraudFlag error:", err);
    throw err;
  }
}

module.exports = {
  raiseFraudFlag
};