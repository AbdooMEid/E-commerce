const {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
} = require("./category.service");
const {
  getSpecificCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../../utils/Validator/CategoriesValidation");
const router = require("express").Router();

router
  .route("/")
  .post(createCategoryValidator, addCategory)
  .get(getAllCategories);
router
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
