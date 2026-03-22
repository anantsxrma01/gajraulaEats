const mongoose = require("mongoose");

const orderActionLogSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    actor_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actor_role: {
      type: String
    },
    action_type: {
      type: String,
      enum: [
        "STATUS_CHANGE",
        "RIDER_ASSIGN",
        "RIDER_UNASSIGN",
        "ORDER_CANCEL",
        "NOTE_ADDED"
      ],
      required: true
    },
    from_status: {
      type: String
    },
    to_status: {
      type: String
    },
    note: {
      type: String
    },
    extra: {
      type: Object // e.g. { from_rider: X, to_rider: Y }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderActionLog", orderActionLogSchema);