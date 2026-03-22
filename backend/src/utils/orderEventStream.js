// Map: orderId -> Set of response objects (SSE clients)
const orderSubscribers = new Map();

function addSubscriber(orderId, res) {
  if (!orderSubscribers.has(orderId)) {
    orderSubscribers.set(orderId, new Set());
  }
  orderSubscribers.get(orderId).add(res);
}

function removeSubscriber(orderId, res) {
  const set = orderSubscribers.get(orderId);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) {
    orderSubscribers.delete(orderId);
  }
}

function sendOrderUpdate(order) {
  const orderId = order._id.toString();
  const subs = orderSubscribers.get(orderId);
  if (!subs) return;

  const payload = JSON.stringify({
    type: "ORDER_UPDATE",
    order,
  });

  for (const res of subs) {
    res.write(`event: orderUpdate\n`);
    res.write(`data: ${payload}\n\n`);
  }
}

module.exports = {
  addSubscriber,
  removeSubscriber,
  sendOrderUpdate
};
