const Product = require("./product.model");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");
//@desc   Create Product
//@route  Post /api/v1/Product
//@access Privet
const addProduct = createHandler(Product);
//@desc   Get All Categories
//@route  Get /api/v1/Product
//@access Public
const getAllProduct = getAllHandler(Product, "Product");
//@desc   Get Specific Product
//@route  Get /api/v1/Product/:id
//@access Public
const getSpecificProduct = getSpecificHandler(Product);
//@desc   Update Specific Product
//@route  Put /api/v1/Product/:id
//@access Privet
const updateProduct = updateHandler(Product);

//@desc   Delete Specific Product
//@route  Delete /api/v1/Product/:id
//@access Privet
const deleteProduct = deleteHandling(Product);
module.exports = {
  addProduct,
  getAllProduct,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
};
