const router = require("express").Router({ mergeParams: true });
const { protect, allowedTo } = require("../../config/auth");
const {
  createBrandValidator,
  updateBrandValidator,
  getSpecificBrandValidator,
  deleteBrandValidator,
} = require("../../utils/Validator/BrandValidation");
const {
  addBrand,
  getAllBrand,
  getSpecificBrand,
  updateBrand,
  deleteBrand,
  uploadImage,
  resizeImage,
} = require("./brand.service");

router
  .route("/")
  .post(protect,
    allowedTo("admin"),uploadImage, resizeImage, createBrandValidator, addBrand)
  .get(getAllBrand);
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(protect,
    allowedTo("admin"),uploadImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(protect,
    allowedTo("admin"),deleteBrandValidator, deleteBrand);
module.exports = router;
