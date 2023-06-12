const { check } = require("express-validator");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const { default: slugify } = require("slugify");

exports.getSpecificCategoryValidator = [
  check("id").isMongoId().withMessage("InValid Category Id"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("InValid Category Id"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("InValid Category Id"),
  validatorMiddleware,
];
