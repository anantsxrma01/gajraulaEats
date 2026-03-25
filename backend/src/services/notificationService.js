const Notification = require("../models/Notification");
const User = require("../models/User");
const Order = require("../models/Order");   
const Shop = require("../models/Shop");

const twilio = require("twilio");

const smsProvider = process.env.SMS_PROVIDER || "TWILIO";

async function sendSMSRaw(to, message) {
  console.log("[SMS] To:", to, "Message:", message);

  if (!to) {
    throw new Error("SMS 'to' is empty");
  }

  // Check if Twilio is configured
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_ACCOUNT_SID !== "your_twilio_account_sid" &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_AUTH_TOKEN !== "your_twilio_auth_token"
  ) {
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      const res = await client.messages.create({
        from: process.env.SMS_FROM_NUMBER,
        to,
        body: message
      });
      console.log(`[SMS] Twilio message sent successfully (SID: ${res.sid})`);
      return { provider: smsProvider, id: res.sid };
    } catch (error) {
      console.error("[SMS] Twilio failed to send message:", error.message);
      // Fallback or throw based on preference. Here we just log and throw to let authController handle it.
      throw new Error("Failed to send SMS via Twilio: " + error.message);
    }
  }

  console.log("[SMS] Twilio credentials missing or using placeholders. Simulating success.");
  return { provider: "DUMMY", id: "dummy-id" };
}

// Common function: log + (optionally) send
async function createAndSendNotification({
  userId,
  orderId,
  channel,
  type,
  title,
  message,
  to,
  meta
}) {
  // 1. Create DB entry (PENDING)
  const doc = await Notification.create({
    user_id: userId,
    order_id: orderId,
    channel,
    type,
    title,
    message,
    to,
    meta,
    status: "PENDING"
  });

  // 2. Channel-specific send
  try {
    if (channel === "SMS") {
      await sendSMSRaw(to, message);
      doc.status = "SENT";
      await doc.save();
    } else if (channel === "IN_APP") {
      // Kuch bhi external nahi – just mark SENT
      doc.status = "SENT";
      await doc.save();
    } else if (channel === "PUSH") {
      // Future: FCM integration
      doc.status = "SENT";
      await doc.save();
    }
  } catch (err) {
    console.error("Notification send error:", err);
    doc.status = "FAILED";
    doc.error = err.message;
    await doc.save();
  }

  return doc;
}
// Helper: user phone निकालने के लिए
async function getUserPhone(userId) {
  const user = await User.findById(userId);
  return user ? user.phone : null;
}

// ORDER_PLACED
async function notifyOrderPlaced({ order, user }) {
  const userId = user ? user._id : order.user_id;
  const phone = user ? user.phone : await getUserPhone(order.user_id);

  const msg = `Your order ${order.order_number} has been placed successfully. Total: ₹${order.total_amount}.`;

  // SMS to customer
  if (phone) {
    await createAndSendNotification({
      userId,
      orderId: order._id,
      channel: "SMS",
      type: "ORDER_PLACED",
      title: "Order placed",
      message: msg,
      to: `+91${phone}`, // adjust as needed
      meta: {}
    });
  }

  // IN_APP
  await createAndSendNotification({
    userId,
    orderId: order._id,
    channel: "IN_APP",
    type: "ORDER_PLACED",
    title: "Order placed",
    message: msg,
    meta: {}
  });
}

// ORDER_STATUS_CHANGED for user
// async function notifyOrderStatusChangedForUser({ order, newStatus }) {
//   const phone = await getUserPhone(order.user_id);
//   const userId = order.user_id;

//   const msg = `Order ${order.order_number} status updated to ${newStatus}.`;

//   if (phone) {
//     await createAndSendNotification({
//       userId,
//       orderId: order._id,
//       channel: "SMS",
//       type: `ORDER_${newStatus}`,
//       title: "Order update",
//       message: msg,
//       to: `+91${phone}`,
//       meta: {}
//     });
//   }

//   await createAndSendNotification({
//     userId,
//     orderId: order._id,
//     channel: "IN_APP",
//     type: `ORDER_${newStatus}`,
//     title: "Order update",
//     message: msg,
//     meta: {}
//   });
// }
/**
 * Dummy notification service.
 * Abhi ye sirf console par log karta hai.
 * Baad me yahan se SMS / Push / Email integrate kar sakte ho.
 */

async function notifyOrderStatusChangedForUser({ order, newStatus }) {
  try {
    console.log(
      `[Notification][USER] Order ${order.order_number} for user ${order.user_id} changed to ${newStatus}`
    );
  } catch (err) {
    console.error("notifyOrderStatusChangedForUser internal error:", err.message);
  }
}

async function notifyOrderStatusChangedForShop({ order, newStatus }) {
  try {
    console.log(
      `[Notification][SHOP] Order ${order.order_number} for shop ${order.shop_id} changed to ${newStatus}`
    );
  } catch (err) {
    console.error("notifyOrderStatusChangedForShop internal error:", err.message);
  }
}

async function notifyOrderStatusChangedForDeliveryPartner({ order, newStatus }) {
  try {
    console.log(
      `[Notification][DELIVERY] Order ${order.order_number} for delivery partner ${order.delivery_partner_id} changed to ${newStatus}`
    );
  } catch (err) {
    console.error(
      "notifyOrderStatusChangedForDeliveryPartner internal error:",
      err.message
    );
  }
}

// ORDER_ASSIGNED_TO_RIDER
async function notifyOrderAssignedToRider({ order, partner, userPhone }) {
  const msgForUser = `Your order ${order.order_number} is on the way. Rider is assigned.`;
  const phoneUser = userPhone || (await getUserPhone(order.user_id));

  if (phoneUser) {
    await createAndSendNotification({
      userId: order.user_id,
      orderId: order._id,
      channel: "SMS",
      type: "ORDER_ASSIGNED",
      title: "Rider assigned",
      message: msgForUser,
      to: `+91${phoneUser}`,
      meta: { partner_id: partner._id }
    });
  }

  await createAndSendNotification({
    userId: order.user_id,
    orderId: order._id,
    channel: "IN_APP",
    type: "ORDER_ASSIGNED",
    title: "Rider assigned",
    message: msgForUser,
    meta: { partner_id: partner._id }
  });

  // Rider ke liye notification (SMS + IN_APP future)
  const riderUser = await User.findById(partner.user_id);
  if (riderUser && riderUser.phone) {
    const msgForRider = `New delivery assigned for order ${order.order_number}.`;
    await createAndSendNotification({
      userId: riderUser._id,
      orderId: order._id,
      channel: "SMS",
      type: "RIDER_ASSIGNED",
      title: "New delivery",
      message: msgForRider,
      to: `+91${riderUser.phone}`,
      meta: {}
    });

    await createAndSendNotification({
      userId: riderUser._id,
      orderId: order._id,
      channel: "IN_APP",
      type: "RIDER_ASSIGNED",
      title: "New delivery",
      message: msgForRider,
      meta: {}
    });
  }
}

async function notifyRiderOrderProgress({ order, partner, action }) {
  // action: "PICKED" / "DELIVERED" etc.
  const riderUser = await User.findById(partner.user_id);
  if (!riderUser) return;

  const message =
    action === "PICKED"
      ? `You have picked order ${order.order_number}.`
      : `You have delivered order ${order.order_number}.`;

  // SMS
  if (riderUser.phone) {
    await createAndSendNotification({
      userId: riderUser._id,
      orderId: order._id,
      channel: "SMS",
      type: `RIDER_ORDER_${action}`,
      title: "Delivery update",
      message,
      to: `+91${riderUser.phone}`,
      meta: {}
    });
  }

  // IN_APP
  await createAndSendNotification({
    userId: riderUser._id,
    orderId: order._id,
    channel: "IN_APP",
    type: `RIDER_ORDER_${action}`,
    title: "Delivery update",
    message,
    meta: {}
  });
}

async function notifyShopOrderDelivered({ order }) {
  // Shop ke owner ko dhoondo
  const shop = await Shop.findById(order.shop_id);
  if (!shop) return;

  const ownerUser = await User.findById(shop.owner_user_id);
  if (!ownerUser) return;

  const msg = `Order ${order.order_number} has been delivered to the customer.`;

  // SMS
  if (ownerUser.phone) {
    await createAndSendNotification({
      userId: ownerUser._id,
      orderId: order._id,
      channel: "SMS",
      type: "SHOP_ORDER_DELIVERED",
      title: "Order delivered",
      message: msg,
      to: `+91${ownerUser.phone}`,
      meta: {}
    });
  }

  // IN_APP
  await createAndSendNotification({
    userId: ownerUser._id,
    orderId: order._id,
    channel: "IN_APP",
    type: "SHOP_ORDER_DELIVERED",
    title: "Order delivered",
    message: msg,
    meta: {}
  });
}


module.exports = {
  createAndSendNotification,
  notifyOrderPlaced,
  notifyOrderStatusChangedForUser,
  notifyOrderStatusChangedForShop,
  notifyOrderStatusChangedForDeliveryPartner,
  notifyOrderAssignedToRider,
  notifyRiderOrderProgress,    
  notifyShopOrderDelivered      
};