const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      minlength: [3, "Too Short user name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    imageProfile: String,
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Too Short Password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpiration: Date,
    passwordResetVerified: Boolean,
    email: {
      type: String,
      required: [true, "user name is required"],
      unique: true,
      lowercase: true,
    },
    phoneNumber: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        id: { type: Schema.Types.ObjectId },
        alias: String,
        details: String,
        city: String,
        phone: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const setImageURL = (doc) => {
  if (doc.imageProfile) {
    doc.imageProfile = `${process.env.IMAGE_URL}/user/${doc.imageProfile}`;
  }
};
userSchema.post("init", (doc) => {
  setImageURL(doc);
});
userSchema.post("save", (doc) => {
  setImageURL(doc);
});
const User = model("User", userSchema);

module.exports = User;
