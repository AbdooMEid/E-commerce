process.on("uncaughtException", (err) => {
  console.error(`uncaughtException : ${err.message} || ${err.stack}`);
});
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 4000;
const dbConnection = require("./src/database/dbConnection");
const {
  globalMiddlewareError,
} = require("./src/utils/Error/globalMiddlewareError");

const ApiError = require("./src/utils/Error/ApiError");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { checkoutWebhook } = require("./src/components/order/orde.service");
const app = express();

// Enable Other domain to access your application;
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());
dotenv.config({ path: "./src/config/config.env" });
// To Apply Sanitization Middleware
app.use(mongoSanitize());
// module check http req
app.use(helmet());
// DataBase Connections
dbConnection();
// check node env mode
if (process.env.ENV_MODE === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.ENV_MODE}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "quantity",
      "sold",
      "ratingAverages",
      "ratingQuantity",
    ],
  })
);
// checkout webhook
app.post(
  "/checkout-webhook",
  express.raw({ type: "application/json" }),
  checkoutWebhook
);

//middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

//route mount
app.use("/", require("./src/routes/index.routes"));

//not found page
app.all("*", (req, res, next) => {
  next(new ApiError(`Route Not Found ${req.originalUrl}`, 404));
});
//handle error from express
app.use(globalMiddlewareError);

//run server
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}......`);
});
// handling rejection outside express
process.on("rejectionHandled", (err) => {
  console.error(`handleRejection : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutdown.....");
    process.exit(1);
  });
});
