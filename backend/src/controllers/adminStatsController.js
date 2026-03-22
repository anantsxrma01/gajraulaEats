const Order = require("../models/Order");
const Shop = require("../models/Shop");
const DeliveryPartner = require("../models/DeliveryPartner");

// Helper: start of today
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// GET /api/admin/stats/overview
const getOverviewStats = async (req, res) => {
  try {
    const todayStart = startOfToday();

    // 1) Total & today orders
    const [totalOrders, todayOrders] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ createdAt: { $gte: todayStart } })
    ]);

    // 2) Total & today revenue (DELIVERED + SUCCESS)
    const [totalRevenueAgg, todayRevenueAgg] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            order_status: "DELIVERED",
            payment_status: "SUCCESS"
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_amount" }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            order_status: "DELIVERED",
            payment_status: "SUCCESS",
            createdAt: { $gte: todayStart }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_amount" }
          }
        }
      ])
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    // 3) Active shops (APPROVED + is_open)
    const activeShops = await Shop.countDocuments({
      status: "APPROVED",
      is_open: true
    });

    // 4) Active riders (status ACTIVE + is_online)
    const activeRiders = await DeliveryPartner.countDocuments({
      status: "ACTIVE",
      is_online: true
    });

    // 5) Live orders (in progress)
    const LIVE_STATUSES = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "ASSIGNED",
      "PICKED"
    ];

    const liveOrders = await Order.countDocuments({
      order_status: { $in: LIVE_STATUSES }
    });

    // 6) Avg delivery time (DELIVERED orders, last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deliveredLast7 = await Order.aggregate([
      {
        $match: {
          order_status: "DELIVERED",
          "timeline.placed_at": { $exists: true },
          "timeline.delivered_at": { $exists: true },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $project: {
          diffMinutes: {
            $divide: [
              { $subtract: ["$timeline.delivered_at", "$timeline.placed_at"] },
              1000 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgMinutes: { $avg: "$diffMinutes" }
        }
      }
    ]);

    const avgDeliveryTimeMinutes = deliveredLast7[0]?.avgMinutes || null;

    res.json({
      success: true,
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      activeShops,
      activeRiders,
      liveOrders,
      avgDeliveryTimeMinutes
    });
  } catch (err) {
    console.error("getOverviewStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/stats/daily?days=7
const getDailyOrderStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days || "7", 10);

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - (days - 1));
    fromDate.setHours(0, 0, 0, 0);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$order_status", "DELIVERED"] },
                    { $eq: ["$payment_status", "SUCCESS"] }
                  ]
                },
                "$total_amount",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.y",
              month: "$_id.m",
              day: "$_id.d"
            }
          },
          orders: 1,
          revenue: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.json({ success: true, stats });
  } catch (err) {
    console.error("getDailyOrderStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/stats/top-shops?limit=5&days=30
const getTopShopsStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "5", 10);
    const days = parseInt(req.query.days || "30", 10);

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          order_status: "DELIVERED",
          payment_status: "SUCCESS"
        }
      },
      {
        $group: {
          _id: "$shop_id",
          orders: { $sum: 1 },
          revenue: { $sum: "$total_amount" }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: "shops",
          localField: "_id",
          foreignField: "_id",
          as: "shop"
        }
      },
      {
        $unwind: {
          path: "$shop",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          shop_id: "$_id",
          shop_name: "$shop.name",
          orders: 1,
          revenue: 1
        }
      }
    ]);

    res.json({ success: true, stats });
  } catch (err) {
    console.error("getTopShopsStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/stats/top-items?limit=5&days=30
const getTopItemsStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "5", 10);
    const days = parseInt(req.query.days || "30", 10);

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate },
          order_status: "DELIVERED",
          payment_status: "SUCCESS"
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item_id",
          name: { $first: "$items.name" },
          qtySold: { $sum: "$items.qty" },
          revenue: { $sum: "$items.total_price" }
        }
      },
      {
        $sort: { qtySold: -1 }
      },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          item_id: "$_id",
          name: 1,
          qtySold: 1,
          revenue: 1
        }
      }
    ]);

    res.json({ success: true, stats });
  } catch (err) {
    console.error("getTopItemsStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOverviewStats,
  getDailyOrderStats,
  getTopShopsStats,
  getTopItemsStats
};