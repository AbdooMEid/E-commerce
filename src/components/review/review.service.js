const Review = require("./review.model");
const { deleteHandling } = require("../Handler/deleteHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { createHandler } = require("../Handler/createHandler");
const { getSpecificHandler, getAllHandler } = require("../Handler/getHandler");

// Nested route (Create)
// POST /api/v1/Product/:productId/Review
const setProductIdToBody = (req, res, next) => {
  if (!req.body.productId) req.body.productId = req.params.productId;
  if (!req.body.userId) req.body.userId = req.user._id;
  next();
};
// Nested route
// GET /api/v1/Product/:productId/Review
const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { productId: req.params.productId };
  req.filterObj = filterObject;
  next();
};

//@desc   Create Review
//@route  Post /api/v1/Review
//@access Privet/Protract/User
const addReview = createHandler(Review);
//@desc   Get All Review
//@route  Get /api/v1/Review
//@access Public
const getAllReview = getAllHandler(Review);
//@desc   Get Specific Review
//@route  Get /api/v1/Review/:id
//@access Public
const getSpecificReview = getSpecificHandler(Review);
//@desc   Update Specific Review
//@route  Put /api/v1/Review/:id
//@access Privet/Protract/User
const updateReview = updateHandler(Review);
//@desc   Delete Specific Review
//@route  Delete /api/v1/Review/:id
//@access Privet/Protract/User-Admin-Manger
const deleteReview = deleteHandling(Review);
module.exports = {
  addReview,
  deleteReview,
  getAllReview,
  getSpecificReview,
  updateReview,
  setProductIdToBody,
  createFilterObj,
};
