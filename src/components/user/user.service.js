const User = require("./user.model");
const sharp = require("sharp");
const { deleteHandling } = require("../Handler/deleteHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");
const asyncHandling = require("express-async-handler");
const { uploadSingleImage } = require("../../middleware/uploadImage");
const ApiError = require("../../utils/Error/ApiError");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

// upload single Image
const uploadImage = uploadSingleImage("imageProfile");
// resize Image
const resizeImage = asyncHandling(async (req, res, next) => {
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
//@desc   Create User
//@route  Post /api/v1/User
//@access Privet/Admin
const addUser = createHandler(User);
//@desc   Get All Categories
//@route  Get /api/v1/User
//@access Privet/Admin
const getAllUsers = getAllHandler(User);
//@desc   Get Specific User
//@route  Get /api/v1/User/:id
//@access Privet/Admin
const getSpecificUser = getSpecificHandler(User);

//@desc   Get Logged In User
//@route  Get /api/v1/User/getMe
//@access Privet/Auth
const getLoggedInUser = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
//@desc   Update Specific User
//@route  Put /api/v1/User/:id
//@access Privet/Admin
const updateUser = asyncHandling(async (req, res, next) => {
  const UpdateDocument = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      active: req.body.active,
      imageProfile: req.body.imageProfile,
      slug: req.body.slug,
    },
    {
      new: true,
    }
  );
  if (!UpdateDocument) {
    return next(new ApiError(`not Found for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: UpdateDocument });
});
//@desc   changePassword User
//@route  Put /api/v1/User/changePassword/:id
//@access Privet/Admin
const changePassword = asyncHandling(async (req, res, next) => {
  const UpdateDocument = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!UpdateDocument) {
    return next(new ApiError(`not Found for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: UpdateDocument });
});
//@desc   changePassword Logged In User
//@route  Put /api/v1/User/updateMyPassword
//@access Privet/Auth
const updateMyPassword = asyncHandling(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`not Found for this id ${req.params.id}`, 404));
  }
  const token = generateToken(user._id);
  res.status(200).json({ success: true, data: user, token });
});
//@desc   changePassword Logged In User WithOut (Password & Role)
//@route  Put /api/v1/User/updateMyProfile
//@access Privet/Auth
const updateMyProfile = asyncHandling(async (req, res, next) => {
  const UpdateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      imageProfile: req.body.imageProfile,
      slug: req.body.slug,
    },
    {
      new: true,
    }
  );
  if (!UpdateUser) {
    return next(new ApiError(`not Found for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: UpdateUser });
});
//@desc   Delete Specific User
//@route  Delete /api/v1/User/deleteMe
//@access Privet/Auth
const deleteMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
//@desc   Delete Specific User
//@route  Delete /api/v1/User/:id
//@access Privet/Admin
const deleteUser = deleteHandling(User);
// //@desc   Update Status Logged In User
// //@route  Put /api/v1/User/activateMe
// //@access Privet/Auth
// const activateMe = asyncHandling(async (req, res, next) => {
//   const UpdateUser = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       active: true,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!UpdateUser) {
//     return next(new ApiError(`not Found for this id`, 404));
//   }
//   const token = generateToken(UpdateUser._id);
//   res.status(200).json({ success: true, data: UpdateUser, token });
// });
module.exports = {
  addUser,
  getAllUsers,
  getSpecificUser,
  getLoggedInUser,
  updateUser,
  deleteUser,
  uploadImage,
  resizeImage,
  changePassword,
  updateMyPassword,
  updateMyProfile,
  deleteMe,
  // activateMe,
};
