process.on("uncaughtException", (err) => {
  console.error(`uncaughtException : ${err.message} || ${err.stack}`);
});
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dbConnection = require("./src/database/dbConnection");
const {
  globalMiddlewareError,
} = require("./src/utils/Error/globalMiddlewareError");
const ApiError = require("./src/utils/Error/ApiError");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
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
