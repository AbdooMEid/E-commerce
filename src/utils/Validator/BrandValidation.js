const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const { validatorMiddleware } = require("./ValidatorMiddleware");

exports.getSpecificBrandValidator = [
  check("id").isMongoId().withMessage("InValid subCategory Id"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("InValid Brand Id"),
  check("name").custom((val, { req }) => {
    if (req.body.slug) {
      req.body.slug = slugify(val);
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("InValid subCategory Id"),
  validatorMiddleware,
];
