const router = require("express").Router();
const {
  getSpecificProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../../utils/Validator/ProductValidator");
const {
  addProduct,
  getAllProduct,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
  resizeMultiImages,
  uploadImage,
} = require("./product.service");
router
  .route("/")
  .post(uploadImage, resizeMultiImages, createProductValidator, addProduct)
  .get(getAllProduct);
router
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(uploadImage, resizeMultiImages, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
