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
} = require("./product.service");

router.route("/").post(createProductValidator, addProduct).get(getAllProduct);
router
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
