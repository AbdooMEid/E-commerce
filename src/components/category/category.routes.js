const router = require("express").Router();
const {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  resizeImage,
} = require("./category.service");
const {
  getSpecificCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../../utils/Validator/CategoriesValidation");

router.use(
  "/:categoryId/subCategory",
  require("../subCategory/subCategory.routes")
);

router
  .route("/")
  .post(uploadImage, resizeImage, createCategoryValidator, addCategory)
  .get(getAllCategories);
router
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(uploadImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
