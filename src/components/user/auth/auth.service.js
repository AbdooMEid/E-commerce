const asyncHandling = require("express-async-handler");
const User = require("../user.model");
const { uploadSingleImage } = require("../../../middleware/uploadImage");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../utils/Error/ApiError");
const generateToken = require("../../../utils/generateToken");

// upload single Image
const uploadImage = uploadSingleImage("imageProfile");
// resize Image
const resizeImage = asyncHandling(async (req, res, next) => {
  // if (!req.file) return next();
  const fileName = `user-${Date.now()}-${Math.random() * 1000}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(900, 900)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);
    req.body.imageProfile = fileName;
  }
  next();
});
//@desc   Register User
//@route  Post /api/v1/auth/register
//@access Public
const register = asyncHandling(async (req, res, next) => {
  // 1- Register User
  const user = await User.create(req.body);
  //2- Generate Token
  const token = generateToken(user._id);
  res.status(201).json({ success: true, data: user, token });
});
//@desc   Login User
//@route  Post /api/v1/auth/login
//@access Public
const login = asyncHandling(async (req, res, next) => {
  // 1- Register User
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect Password Or E-mail"));
  }
  //2- Generate Token
  const token = generateToken(user._id);

  res.status(200).json({ success: true, token });
});

module.exports = {
  register,
  uploadImage,
  resizeImage,
  login,
};
