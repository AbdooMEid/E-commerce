const { check } = require("express-validator");
const slugify = require("slugify");
const { validatorMiddleware } = require("./ValidatorMiddleware");
const User = require("../../components/user/user.model");
const ApiError = require("../Error/ApiError");
// const bcrypt = require("bcryptjs");

exports.registerValidator = [
  // check("name")
  //   .notEmpty()
  //   .withMessage("User name is required")
  //   .isLength({ min: 3 })
  //   .withMessage("Too short User name")
  //   .custom((val, { req }) => {
  //     req.body.slug = slugify(val);
  //     return true;
  //   }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    // .matches(/^(?=.*[A-Z]).{8,}$/)
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error("passwords do not match confirm password");
      }
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("password is required"),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (val) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("Email is Already Exists"));
        }
      });
    }),

  check("imageProfile").optional(),

  check("phoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("The phone number must be Egyptian or Saudi "),

  check("role").optional(),
  validatorMiddleware,
];

exports.loginValidator = [
  check("password")
    .notEmpty()
    .withMessage("password is required")
    // .matches(/^(?=.*[A-Z]).{8,}$/)
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email"),

  validatorMiddleware,
];
// exports.changePasswordValidator = [
//   check("id").isMongoId().withMessage("InValid User Id"),
//   check("currentPassword")
//     .notEmpty()
//     .withMessage("you must enter current password"),
//   check("passwordConfirm")
//     .notEmpty()
//     .withMessage("you must enter passwordConfirm"),
//   check("password")
//     .notEmpty()
//     .withMessage("you must enter password")
//     .custom(async (val, { req }) => {
//       // 1- verified current password
//       const user = await User.findById(req.params.id);
//       if (!user) throw new Error("there is no user for this id");
//       const isCorrectPassword = await bcrypt.compare(
//         req.body.currentPassword,
//         user.password
//       );
//       if (!isCorrectPassword) throw new Error("current password is correct");
//       // 2 - verified confirm password and new password
//       if (val !== req.body.passwordConfirm) {
//         throw new Error("passwords do not match confirm password");
//       }
//       return true;
//     }),
//   validatorMiddleware,
// ];
