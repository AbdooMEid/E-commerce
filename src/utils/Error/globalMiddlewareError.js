const ApiError = require("./ApiError");

const devMode = (err, res) => {
  res.status(err.statusCode).json({
    Status: err.status,
    Message: err.message,
    Error: err,
    Stack: err.stack,
    StatusCode: err.statusCode,
  });
};

const prodMode = (err, res) => {
  res.status(err.statusCode).json({
    Status: err.status,
    StatusCode: err.statusCode,
    Message: err.message,
  });
};

const handlerErrorTokenSignature = () => {
  return new ApiError("Invalid token , please login agin", 401);
};
const handlerErrorTokenExpired = () => {
  return new ApiError("Token Expired , please login agin", 401);
};
module.exports.globalMiddlewareError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.ENV_MODE === "development") {
    devMode(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handlerErrorTokenSignature();
    if (err.name === "TokenExpiredError") err = handlerErrorTokenExpired();

    prodMode(err, res);
  }
};
