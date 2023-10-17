const { check } = require("express-validator");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const ApiError = require("../Error/ApiError");
const User = require("../../components/user/user.model");
const Product = require("../../components/product/product.model");

exports.createWishListValidator = [
  check("productId")
    .isMongoId()
    .withMessage("InValid Product Id")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        return Promise.reject(new ApiError("Product Id Not Valid", 400));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.removeWishListValidator = [
  check("productId").isMongoId().withMessage("InValid Product Id"),
  validatorMiddleware,
];
