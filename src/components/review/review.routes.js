const router = require("express").Router({ mergeParams: true });
const { protect, allowedTo } = require("../../config/auth");
const {
  addReview,
  getAllReview,
  getSpecificReview,
  updateReview,
  deleteReview,
  setProductIdToBody,
  createFilterObj,
} = require("./review.service");
const {
  createReviewValidator,
  updateReviewValidator,
  getSpecificReviewValidator,
  deleteReviewValidator,
} = require("../../utils/Validator/ReviewValidation");

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    setProductIdToBody,
    createReviewValidator,
    addReview
  )
  .get(createFilterObj, getAllReview);
router
  .route("/:id")
  .get(getSpecificReviewValidator, getSpecificReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("admin", "user"),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
