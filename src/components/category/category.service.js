const Category = require("./category.model");
const { asyncHandling } = require("../../utils/Error/asyncHandler");
const slugify = require("slugify");
const ApiError = require("../../utils/Error/ApiError");

//@desc   Create Category
//@route  Post /api/v1/Category
//@access Privet
const addCategory = asyncHandling(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.status(200).json({ success: true, data: newCategory });
});
//@desc   Get All Categories
//@route  Get /api/v1/Category
//@access Public
const getAllCategories = asyncHandling(async (req, res, next) => {
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || 5;
  let skip = (page - 1) * limit;
  const categories = await Category.find({}).skip(skip).limit(limit);
  if (!categories) {
    return next(new ApiError("not Found Categories", 404));
  }
  res.status(200).json({
    success: true,
    results: categories.length,
    page,
    data: categories,
  });
});
//@desc   Get Specific Category
//@route  Get /api/v1/Category/:id
//@access Public
const getSpecificCategory = asyncHandling(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`not Found Category for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: category });
});
//@desc   Update Specific Category
//@route  Put /api/v1/Category/:id
//@access Privet
const updateCategory = asyncHandling(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!category) {
    return next(new ApiError(`not Found Category for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: category });
});
//@desc   Delete Specific Category
//@route  Delete /api/v1/Category/:id
//@access Privet
const deleteCategory = asyncHandling(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`not Found Category for this id ${id}`, 404));
  }
  res.status(204).send();
});
module.exports = {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
};
