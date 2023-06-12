const { Schema, model } = require("mongoose");

const brandSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [2, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Brand = model("Brand", brandSchema);

module.exports = Brand;
