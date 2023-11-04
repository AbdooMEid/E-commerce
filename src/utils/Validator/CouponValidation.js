const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const Coupon = require("../../components/coupon/coupon.model");

exports.getSpecificCouponValidator = [
  check("id").isMongoId().withMessage("InValid Coupon Id"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .custom(async (val, { req }) => {
      const couponName = await Coupon.findOne({ name: val });
      if (couponName) {
        return Promise.reject(new Error("Coupon name is already exists"));
      }
      return true;
    }),
  check("expire")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Invalid expire date"),
  check("discount").isNumeric().withMessage("Invalid discount"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("InValid Coupon Id"),
  check("name").custom(async (val, { req }) => {
    const couponName = await Coupon.findOne({ name: val });
    if (couponName) {
      return Promise.reject(new Error("Coupon name is already exists"));
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("InValid Coupon Id"),
  validatorMiddleware,
];
