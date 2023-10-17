const { check } = require("express-validator");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const User = require("../../components/user/user.model");
const ApiError = require("../Error/ApiError");
exports.createAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (user.addresses.find((address) => address.alias === val)) {
        return Promise.reject(new ApiError("Alias is Already Exists"));
      }
      return true;
    }),
  check("details").notEmpty().withMessage("Details is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("The phone number must be Egyptian or Saudi "),
  check("postalCode")
    .notEmpty()
    .withMessage("Postal Code is required")
    .isPostalCode("any"),
  validatorMiddleware,
];

exports.removeAddressValidator = [
  check("addressId").isMongoId().withMessage("InValid Product Id"),
  validatorMiddleware,
];
