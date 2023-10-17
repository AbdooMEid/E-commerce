const router = require("express").Router();
const { protect, allowedTo } = require("../../config/auth");
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

//Nested Route
router.use("/:productId/Review", require("../review/review.routes"));

router
  .route("/")
  .post(
    protect,
    allowedTo("admin"),
    uploadImage,
    resizeMultiImages,
    createProductValidator,
    addProduct
  )
  .get(getAllProduct);
router
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(
    protect,
    allowedTo("admin"),
    uploadImage,
    resizeMultiImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);
module.exports = router;
