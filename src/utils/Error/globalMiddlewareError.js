module.exports.globalMiddlewareError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.ENV_MODE === "development") {
    devMode(err, res);
  } else {
    prodMode(err, res);
  }
};

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
