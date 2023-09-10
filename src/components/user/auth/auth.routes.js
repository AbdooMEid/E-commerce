const router = require("express").Router();
const {
  registerValidator,
  loginValidator,
} = require("../../../utils/Validator/authValidation");
const { register, uploadImage, resizeImage, login } = require("./auth.service");

// router
//   .route("/changePassword/:id")
//   .put(changePasswordValidator, changePassword);
router
  .route("/register")
  .post(uploadImage, resizeImage, registerValidator, register);
router.route("/login").post(loginValidator, login);

module.exports = router;
