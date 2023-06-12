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
} = require("./brand.service");

router.route("/").post(createBrandValidator, addBrand).get(getAllBrand);
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
