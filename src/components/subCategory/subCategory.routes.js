const router = require("express").Router({ mergeParams: true });
const {
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  createSubCategoryValidator,
} = require("../../utils/Validator/SubCategoryValidation");
const {
  addSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObj,
  setCategoryIdToBody,
} = require("./subCategory.service");

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, addSubCategory)
  .get(createFilterObj, getAllSubCategories);
router
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
