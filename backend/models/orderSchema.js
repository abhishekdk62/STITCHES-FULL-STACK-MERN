const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      unique: true,
      required: true,
      default: () => "ORD-" + uuidv4().slice(0, 8),
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: [
            "Pending",
            "Returned",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ],
          default: "Pending",
        },
      },
    ],
    address: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
      addressType: {
        type: String,
        enum: ["Home", "Office", "Other"],
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["credit", "paypal", "cod", "wallet"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    coupon: {
      code: { type: String },
      value: { type: String },
    },
    
    tax: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },

    trackingNumber: {
      type: String,
    },
    orderNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
