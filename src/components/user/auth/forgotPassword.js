const crypto = require("crypto");
const { asyncHandling } = require("../../../utils/Error/asyncHandler");
const ApiError = require("../../../utils/Error/ApiError");
const User = require("../user.model");
const sendEmail = require("../../../utils/sendEmail");
const generateToken = require("../../../utils/generateToken");
//@desc   Forgot Password
//@route  Post /api/v1/auth/forgotPassword
//@access Public

const forgotPassword = asyncHandling(async (req, res, next) => {
  // 1) if is user exist email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`there is no user in that email ${req.body.email}`, 404)
    );
  //2) generate hash reset random 6 digits and save in it db
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashCode = crypto.createHash("sha256").update(randomCode).digest("hex");
  //save hash code into db
  user.passwordResetCode = hashCode;
  // Expiration Date to Reset code
  user.passwordResetExpiration = Date.now() + 10 * 60 * 1000;
  // verified reset code
  user.passwordResetVerified = false;
  // save into db
  await user.save();
  //3) send reset code in vie email
  let message = `Hi ${user.name} \n Please use this code to reset the password for the E-shop account \n Here is your code ${randomCode} \n Thanks \n The E-shop Account Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: `the reset code valid for 10 min`,
      message,
    });
  } catch (error) {
    //save hash code into db
    user.passwordResetCode = undefined;
    // Expiration Date to Reset code
    user.passwordResetExpiration = undefined;
    // verified reset code
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError(`There is a problem with the e-mail ${error}`, 500)
    );
  }

  res.status(200).json({ status: "success", data: "Reset Code Send To Email" });
});

//@desc   Verify Reset Code
//@route  Post /api/v1/auth/verifyCode
//@access Privet

const verifyResetCode = asyncHandling(async (req, res, next) => {
  // 1) get reset code and get user from reset code after hash reset code coming in body
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpiration: { $gt: Date.now() },
  });
  if (!user)
    return next(new ApiError("Reset Code Invalid Or Expire Date", 401));
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
});

//@desc   Verify Reset Code
//@route  Post /api/v1/auth/resetPassword
//@access Privet

const resetPassword = asyncHandling(async (req, res, next) => {
  // 1) catch to user because update password
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`There is user with not email ${req.body.email}`, 404)
    );
  // 2) check if password Reset Verified is true or false
  if (!user.passwordResetVerified)
    return next(new ApiError("Reset Code not Verified", 401));
  // 3) update password in db
  user.password = req.body.newPassword;
  user.passwordResetExpiration = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token = generateToken(user._id);
  res.status(200).json({ status: "success", token });
});

module.exports = {
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
