const { Schema, model, Types } = require("mongoose");

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: [true, "Coupon name must be unique"],
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expiration is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
  },
  { timestamps: true }
);

module.exports = model("Coupon", couponSchema);
