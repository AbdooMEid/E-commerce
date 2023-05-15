module.exports.globalMiddlewareError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.ENV_MODE === "development") {
    devMode(err, res);
  } else {
    prodMode(err, res);
  }
};

const devMode = (err, res) => {
  res
    .status(err.statusCode)
    .json({ status: err.statusCode, msg: err.message, stack: err.stack });
};

const prodMode = (err, res) => {
  res.status(err.statusCode).json({ status: err.statusCode, msg: err.message });
};
