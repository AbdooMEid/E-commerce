const SubCategory = require("./subCategory.model");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");

// Nested route (Create)
// POST /api/v1/Category/:categoryId/SubCategory
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.categoryId) req.body.categoryId = req.params.categoryId;
  next();
};
// Nested route
// GET /api/v1/Category/:categoryId/SubCategory
const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId)
    filterObject = { categoryId: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//@desc   Create SubCategory
//@route  Post /api/v1/SubCategory
//@access Privet
const addSubCategory = createHandler(SubCategory);

//@route  Get /api/v1/Category/:categoryId/subCategory  => Nested Route
//@desc   Get All SubCategories
//@route  Get /api/v1/SubCategory
//@access Public
const getAllSubCategories = getAllHandler(SubCategory);
//@desc   Get Specific SubCategory
//@route  Get /api/v1/SubCategory/:id
//@access Public
const getSpecificSubCategory = getSpecificHandler(SubCategory);
//@desc   Update Specific SubCategory
//@route  Put /api/v1/SubCategory/:id
//@access Privet
const updateSubCategory = updateHandler(SubCategory);
//@desc   Delete Specific SubCategory
//@route  Delete /api/v1/SubCategory/:id
//@access Privet
const deleteSubCategory = deleteHandling(SubCategory);
module.exports = {
  addSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
};
