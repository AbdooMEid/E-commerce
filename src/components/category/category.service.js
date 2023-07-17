const Category = require("./category.model");
const sharp = require("sharp");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");
const { asyncHandling } = require("../../utils/Error/asyncHandler");
const { uploadSingleImage } = require("../../middleware/uploadImage");

// upload single Image
const uploadImage = uploadSingleImage("image");
// resize Image
const resizeImage = asyncHandling(async (req, res, next) => {
  console.log(req.file);
  const fileName = `category-${Date.now()}-${Math.random() * 1000}.jpeg`;
  await sharp(req.file.buffer)
    .resize(900, 900)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/category/${fileName}`);
  req.body.image = fileName;
  next();
});
//@desc   Create Category
//@route  Post /api/v1/Category
//@access Privet
const addCategory = createHandler(Category);
//@desc   Get All Categories
//@route  Get /api/v1/Category
//@access Public
const getAllCategories = getAllHandler(Category);
//@desc   Get Specific Category
//@route  Get /api/v1/Category/:id
//@access Public
const getSpecificCategory = getSpecificHandler(Category);
//@desc   Update Specific Category
//@route  Put /api/v1/Category/:id
//@access Privet
const updateCategory = updateHandler(Category);
//@desc   Delete Specific Category
//@route  Delete /api/v1/Category/:id
//@access Privet
const deleteCategory = deleteHandling(Category);
module.exports = {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  resizeImage,
};
