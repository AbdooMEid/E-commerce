const User = require("../components/user/user.model");
const ApiError = require("../utils/Error/ApiError");
const asyncHandling = require("express-async-handler");
const jwt = require("jsonwebtoken");

const protect = asyncHandling(async (req, res, next) => {
  // 1- check if token exist
  let token;
  if (req.headers.token && req.headers.token.startsWith("Bearer")) {
    token = req.headers.token.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You Are Not Login , Please Login To Get Access This Route",
        401
      )
    );
  }
  // 2- verify token (no change happens , expired token)
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  // 3- check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser || currentUser.active === false)
    return next(
      new ApiError(
        "This user no longer exists or the user is Deactivate Please Activate Your Account",
        401
      )
    );
  // 4- check if user change password after created token
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "user recently changed his password , please login agin...",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

const allowedTo = (...roles) => {
  return asyncHandling((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not authorized to access this route", 403)
      );
    }
    next();
  });
};

module.exports = { protect, allowedTo };
