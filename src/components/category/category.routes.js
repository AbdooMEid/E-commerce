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
const { protect, allowedTo } = require("../../config/auth");

router.use(
  "/:categoryId/subCategory",
  require("../subCategory/subCategory.routes")
);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin"),
    uploadImage,
    resizeImage,
    createCategoryValidator,
    addCategory
  )
  .get(getAllCategories);
router
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(
    protect,
    allowedTo("admin"),
    uploadImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);
module.exports = router;
