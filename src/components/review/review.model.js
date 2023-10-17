const mongoose = require("mongoose");
const Product = require("../product/product.model");
const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: [255, "title must belong at least 255 characters"],
      required: [true, "title is required"],
    },
    rating: {
      type: Number,
      min: [0.5, "Min Ratings Value Is .5"],
      max: [5, "Max Ratings Value Is 5"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review Must belong to User"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review Must belong to Product"],
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name",
  });
  next();
});
ReviewSchema.statics.calcAverageRatingAndTotalQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // stage 1 : get all review specific product
    { $match: { productId: productId } },
    // stage 2 :grouping review based productId and calc avgRating and ratingQuantity
    {
      $group: {
        _id: "productId",
        avgRating: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverages: result[0].avgRating,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAverages: 0,
      ratingQuantity: 0,
    });
  }
};
ReviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingAndTotalQuantity(this.productId);
});
ReviewSchema.post(
  "deleteOne",
  { query: false, document: true },
  async function () {
    await this.constructor.calcAverageRatingAndTotalQuantity(this.productId);
  }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);

module.exports = ReviewModel;
