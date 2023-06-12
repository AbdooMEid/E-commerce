const Brand = require("./brand.model");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");
//@desc   Create Brand
//@route  Post /api/v1/Brand
//@access Privet
const addBrand = createHandler(Brand);

//@route  Get /api/v1/Category/:categoryId/Brand  => Nested Route
//@desc   Get All SubCategories
//@route  Get /api/v1/Brand
//@access Public
const getAllBrand = getAllHandler(Brand);
//@desc   Get Specific Brand
//@route  Get /api/v1/Brand/:id
//@access Public
const getSpecificBrand = getSpecificHandler(Brand);
//@desc   Update Specific Brand
//@route  Put /api/v1/Brand/:id
//@access Privet
const updateBrand = updateHandler(Brand);
//@desc   Delete Specific Brand
//@route  Delete /api/v1/Brand/:id
//@access Privet
const deleteBrand = deleteHandling(Brand);
module.exports = {
  addBrand,
  getAllBrand,
  getSpecificBrand,
  updateBrand,
  deleteBrand,
};
