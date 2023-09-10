const router = require("express").Router({ mergeParams: true });
const { protect, allowedTo } = require("../../config/auth");
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
  .post(
    protect,
    allowedTo("admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    addSubCategory
  )
  .get(createFilterObj, getAllSubCategories);
router
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory)
  .put(
    protect,
    allowedTo("admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
