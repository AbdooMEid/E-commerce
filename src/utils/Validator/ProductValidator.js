const { check } = require("express-validator");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const Category = require("../../components/category/category.model");
const SubCategory = require("../../components/subCategory/subCategory.model");
const { default: slugify } = require("slugify");

exports.getSpecificProductValidator = [
  check("id").isMongoId().withMessage("InValid Product Id"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Too short Product name")
    .isLength({ max: 100 })
    .withMessage("Too long Product name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product Description is required")
    .isLength({ min: 20 })
    .isLength({ max: 2000 })
    .withMessage("too long Description"),
  check("price")
    .notEmpty()
    .withMessage("Product Price Is Required")
    .isLength({ max: 10 })
    .withMessage("too beLong product price")
    .isNumeric()
    .withMessage("Product price must be number"),
  check("quantity")
    .notEmpty()
    .withMessage("Product Quantity Is Required")
    .isNumeric()
    .withMessage("quantity must be Number"),
  check("sold").optional().isNumeric().withMessage("Sold Must be Is Number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .isFloat()
    .withMessage("price After Discount must be Number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price After Discount must be lower then Price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be Array of string"),
  check("imageCover").notEmpty().withMessage("Image Cover Is required"),
  check("image")
    .optional()
    .isArray()
    .withMessage("image should be Array of string"),
  check("categoryId")
    .notEmpty()
    .withMessage("Category Id Is Required")
    .isMongoId()
    .withMessage("Invalid Category Id")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`category Id Not Found ${categoryId}`)
          );
        }
      })
    ),
  check("subCategoryId")
    .optional()
    .isArray()
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom((subCategoriesId) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoriesId } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subCategoriesId.length) {
            return Promise.reject(new Error(`SubCategory Id Not Found`));
          }
        }
      )
    )
    .custom(async (value, { req }) => {
      await SubCategory.find({ categoryId: req.body.categoryId }).then(
        (data) => {
          const subCategoryIdInDB = [];
          data.forEach((subCategoriesId) => {
            subCategoryIdInDB.push(subCategoriesId._id.toString());
          });
          if (!value.every((v) => subCategoryIdInDB.includes(v))) {
            return Promise.reject(
              new Error(`SubCategory Not belong to category`)
            );
          }
        }
      );
    }),
  check("brandId").optional().isMongoId().withMessage("Invalid ID Format"),
  check("ratingAverages")
    .optional()
    .isNumeric()
    .withMessage("ratingAverages must be number")
    .isLength({ min: 1 })
    .withMessage("Rating Must be above or Equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating Must be below or Equal 5"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be number"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("InValid Product Id"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("InValid Product Id"),
  validatorMiddleware,
];
