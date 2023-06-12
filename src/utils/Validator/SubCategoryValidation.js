const { check } = require("express-validator");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const { default: slugify } = require("slugify");

exports.getSpecificSubCategoryValidator = [
  check("id").isMongoId().withMessage("InValid subCategory Id"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("categoryId")
    .notEmpty()
    .withMessage("SubCategory to belong Category")
    .isMongoId()
    .withMessage("Invalid subCategory Id"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("InValid subCategory Id"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("InValid subCategory Id"),
  validatorMiddleware,
];
