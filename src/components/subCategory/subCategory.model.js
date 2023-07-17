const { Schema, model, Types } = require("mongoose");

const subCategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      unique: [true, "SubCategory name must be unique"],
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "the Category id is Required"],
    },
  },
  { timestamps: true }
);
subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "categoryId",
    select: "name , -_id",
  });
  next();
});

const subCategory = model("SubCategory", subCategorySchema);

module.exports = subCategory;
