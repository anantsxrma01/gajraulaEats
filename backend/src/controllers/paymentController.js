const crypto = require("crypto");
const razorpay = require("../config/paymentConfig");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

// POST /api/payments/razorpay/order
// Body: { order_id }
const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    const order = await Order.findOne({ _id: order_id, user_id: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found for user" });
    }

    if (order.payment_status === "SUCCESS") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    const amountInPaise = Math.round(order.total_amount * 100);
    const currency = process.env.RAZORPAY_CURRENCY || "INR";

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: order.order_number,
      notes: {
        platform_order_id: order._id.toString(),
        user_id: userId.toString()
      }
    });

    // Payment record create/update
    let payment = await Payment.findOne({
      order_id: order._id,
      gateway_order_id: razorpayOrder.id
    });

    if (!payment) {
      payment = await Payment.create({
        order_id: order._id,
        gateway: "RAZORPAY",
        gateway_order_id: razorpayOrder.id,
        amount: order.total_amount,
        currency,
        status: "PENDING",
        raw_response: razorpayOrder
      });
    }

    // Order ke payment fields update
    order.payment_mode = "ONLINE";
    order.payment_status = "PENDING";
    await order.save();

    res.json({
      success: true,
      razorpay_order_id: razorpayOrder.id,
      amount: amountInPaise,
      currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      order_id: order._id,
      order_number: order.order_number
    });
  } catch (err) {
    console.error("createRazorpayOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/payments/razorpay/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id }
const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return res.status(400).json({
        message:
          "razorpay_order_id, razorpay_payment_id, razorpay_signature and order_id are required"
      });
    }

    const order = await Order.findOne({ _id: order_id, user_id: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.findOne({
      order_id: order._id,
      gateway_order_id: razorpay_order_id
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Verify signature
    const signPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signPayload)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      payment.status = "FAILED";
      payment.gateway_payment_id = razorpay_payment_id;
      payment.gateway_signature = razorpay_signature;
      await payment.save();

      order.payment_status = "FAILED";
      await order.save();

      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Valid -> success
    payment.status = "SUCCESS";
    payment.gateway_payment_id = razorpay_payment_id;
    payment.gateway_signature = razorpay_signature;
    await payment.save();

    order.payment_status = "SUCCESS";
    order.payment_mode = "ONLINE";
    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      order
    });
  } catch (err) {
    console.error("verifyRazorpayPayment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/payments/razorpay/webhook
// Razorpay dashboard me isi URL ko add karna hoga (with secret)
const handleRazorpayWebhook = async (req, res) => {
  try {
    // Agar webhook secret use kar rahe ho to yahan signature verify karo
    // const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    // const signature = req.headers["x-razorpay-signature"];

    const event = req.body;

    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;
      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;

      const payment = await Payment.findOne({
        gateway_order_id: razorpayOrderId
      });

      if (payment && payment.status !== "SUCCESS") {
        payment.status = "SUCCESS";
        payment.gateway_payment_id = razorpayPaymentId;
        await payment.save();

        const order = await Order.findById(payment.order_id);
        if (order && order.payment_status !== "SUCCESS") {
          order.payment_status = "SUCCESS";
          order.payment_mode = "ONLINE";
          await order.save();
        }
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("handleRazorpayWebhook error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook
};