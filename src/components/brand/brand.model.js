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

const setImageURL = (doc) => {
  if (doc.image) {
    doc.image = `${process.env.IMAGE_URL}/brand/${doc.image}`;
  }
};
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});
const Brand = model("Brand", brandSchema);

module.exports = Brand;
