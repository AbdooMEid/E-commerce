const { Schema, model, Types } = require("mongoose");

const ProductSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "title product is required"],
      minlength: [3, "Too Short Product Title"],
      maxlength: [100, "Too Long Product Title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product Description is required"],
      minlength: [20, "Too Short Product Description"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity Product is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      max: [3000, "too beLong product price"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "image Cover is required"],
    },
    images: [String],
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Category Id is Required"],
    },
    subCategoryId: [
      {
        type: Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    ratingAverages: {
      type: Number,
      min: [1, "rating Averages must be above or equal 1"],
      max: [5, "rating Averages must below or equal 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categoryId",
    select: "name",
  });
  next();
});

const Product = model("Product", ProductSchema);

module.exports = Product;
