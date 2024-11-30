const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      productId: { type: Schema.Types.ObjectId },
      price: { type: Number },
    },
    houseNo: { type: String },
    sector: { type: String },
    city: { type: String },
    phoneNo: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Out for delivery", "Cancelled"],
      default: "Pending",
    },
    paymentMode: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },
    totalquantity: {
      type: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
