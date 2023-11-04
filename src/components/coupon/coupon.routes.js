const router = require("express").Router();
const {
  addCoupon,
  getAllCoupon,
  getSpecificCoupon,
  updateCoupon,
  deleteCoupon,
} = require("./coupon.service");
const { protect, allowedTo } = require("../../config/auth");
const {
  getSpecificCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../../utils/Validator/CouponValidation");

router.use(protect, allowedTo("admin"));

router.route("/").post(createCouponValidator, addCoupon).get(getAllCoupon);
router
  .route("/:id")
  .get(getSpecificCouponValidator, getSpecificCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
