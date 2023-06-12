const Category = require("./category.model");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");
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
};
