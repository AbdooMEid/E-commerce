const { Schema, model } = require("mongoose");

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      unique: [true, "category name must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
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

const category = model("Category", categorySchema);

module.exports = category;
