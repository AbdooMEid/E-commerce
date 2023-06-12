const app = require("express").Router();

app.use("/api/v1/Category", require("../components/category/category.routes"));
app.use(
  "/api/v1/SubCategory",
  require("../components/subCategory/subCategory.routes")
);
app.use("/api/v1/Brand", require("../components/brand/brand.routes"));
app.use("/api/v1/Product", require("../components/product/product.routes"));

module.exports = app;
