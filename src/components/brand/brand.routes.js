const router = require("express").Router({ mergeParams: true });
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
  .post(uploadImage, resizeImage, createBrandValidator, addBrand)
  .get(getAllBrand);
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(uploadImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
