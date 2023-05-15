const app = require("express").Router();

app.use("/api/v1/Category", require("../components/category/category.routes"));

module.exports = app;
