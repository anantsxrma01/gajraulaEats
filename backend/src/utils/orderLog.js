const OrderActionLog = require("../models/OrderActionLog");

async function logOrderAction({
  order_id,
  actor_user_id,
  actor_role,
  action_type,
  from_status,
  to_status,
  note,
  extra
}) {
  try {
    await OrderActionLog.create({
      order_id,
      actor_user_id,
      actor_role,
      action_type,
      from_status,
      to_status,
      note,
      extra
    });
  } catch (err) {
    console.error("logOrderAction error:", err.message);
  }
}

module.exports = { logOrderAction };
