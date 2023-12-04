const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order Must belong to user"],
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    deliveredState: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
    shippingAddress: {
      details: String,
      PhoneNumber: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name email phoneNumber imageProfile -_id",
  }).populate({
    path: "cartItems.productId",
    select: "title imageCover price priceAfterDiscount -_id",
  });
  next();
});
module.exports = mongoose.model("Order", orderSchema);
