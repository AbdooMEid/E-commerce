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
const { createOrderCard } = require("./src/components/order/orde.service");
const app = express();

// Enable Other domain to access your application;
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());
dotenv.config({ path: "./src/config/config.env" });
// module check http req
app.use(helmet());
// DataBase Connections
dbConnection();
// check node env mode
if (process.env.ENV_MODE === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.ENV_MODE}`);
}
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

//route mount
app.use("/", require("./src/routes/index.routes"));

// checkout webhook
app.post(
  "/checkout-webhook",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    let event = req.body;
    const sig = req.headers["stripe-signature"];
    const endPointSecret = process.env.WEBHOOK_SECRET;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      createOrderCard(event.data.object);
    }
    res.status(200).json({ received: true });
  }
);

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
