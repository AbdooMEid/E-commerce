const { check } = require("express-validator");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const Review = require("../../components/review/review.model");
const ApiError = require("../Error/ApiError");

exports.createReviewValidator = [
  check("title")
    .notEmpty()
    .withMessage("Review Title is required")
    .isLength({ min: 2 })
    .withMessage("Too short Review Title")
    .isLength({ max: 255 })
    .withMessage(`Too long Review Title`),
  check("rating")
    .isFloat({
      min: 0.5,
      max: 5,
    })
    .withMessage(`Review Rating must be a number between 0.5 and 5`),
  check("userId").isMongoId().withMessage("InValid Review Id"),
  check("productId")
    .isMongoId()
    .withMessage(`InValid Review Id`)
    .custom((val, { req }) => {
      return Review.findOne({
        userId: req.user._id,
        productId: req.body.productId,
      }).then((review) => {
        if (review)
          return Promise.reject(
            new ApiError(`You already created review before`, 400)
          );
      });
    }),
  validatorMiddleware,
];

exports.getSpecificReviewValidator = [
  check("id").isMongoId().withMessage("InValid Brand Id"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("InValid Review Id")
    .custom((val, { req }) => {
      return Review.findById(val).then((review) => {
        if (!review)
          return Promise.reject(
            new ApiError(`There is no review with id ${val}`, 400)
          );
        if (review.userId._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new ApiError(`You are not allowed to perform this action`, 400)
          );
        }
      });
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("InValid Review Id")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review)
            return Promise.reject(
              new ApiError(`There is no review with id ${val}`, 400)
            );
          if (review.userId._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new ApiError(`You are not allowed to perform this action`, 400)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
