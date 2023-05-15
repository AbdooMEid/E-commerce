const {
  addCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
} = require("./category.service");

const router = require("express").Router();

router.route("/").post(addCategory).get(getAllCategories);
router
  .route("/:id")
  .get(getSpecificCategory)
  .put(updateCategory)
  .delete(deleteCategory);
module.exports = router;
