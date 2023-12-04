const { Schema, model, Types } = require("mongoose");

const ProductSchema = new Schema(
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
  {
    timestamps: true,
    // enable virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual reviews
ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "productId",
  localField: "_id",
});
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categoryId",
    select: "name  _id",
  });
  next();
});
const setImageURL = (doc) => {
  let images = [];
  if (doc.imageCover) {
    doc.imageCover = `${process.env.IMAGE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images.forEach((ele) => {
      images.push(`${process.env.IMAGE_URL}/products/${ele}`);
    });
    doc.images = images;
  }
};
// find,findOne,update
ProductSchema.post("init", (doc) => {
  setImageURL(doc);
});
// create
ProductSchema.post("save", (doc) => {
  setImageURL(doc);
});
const Product = model("Product", ProductSchema);

module.exports = Product;
