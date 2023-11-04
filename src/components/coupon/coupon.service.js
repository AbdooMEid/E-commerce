const { createHandler } = require("../Handler/createHandler");
const Coupon = require("./coupon.model");
const { getAllHandler, getSpecificHandler } = require("../Handler/getHandler");
const { updateHandler } = require("../Handler/updateHandler");
const { deleteHandling } = require("../Handler/deleteHandler");

//@desc   Create Coupon
//@route  Post /api/v1/Coupon
//@access Privet / Admin - Manger
const addCoupon = createHandler(Coupon);
//@desc   Get All Coupon
//@route  Get /api/v1/Coupon
//@access Privet / Admin - Manger
const getAllCoupon = getAllHandler(Coupon);
//@desc   Get Specific Coupon
//@route  Get /api/v1/Coupon/:id
//@access Privet / Admin - Manger
const getSpecificCoupon = getSpecificHandler(Coupon);
//@desc   Update Specific Coupon
//@route  Put /api/v1/Coupon/:id
//@access Privet / Admin - Manger
const updateCoupon = updateHandler(Coupon);
//@desc   Delete Specific Coupon
//@route  Delete /api/v1/Coupon/:id
//@access Privet / Admin - Manger
const deleteCoupon = deleteHandling(Coupon);

module.exports = {
  addCoupon,
  getAllCoupon,
  getSpecificCoupon,
  updateCoupon,
  deleteCoupon,
};
