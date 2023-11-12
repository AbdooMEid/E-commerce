const router = require("express").Router();
const { protect, allowedTo } = require("../../config/auth");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  removeAllCartItems,
  UpdateQuantityItems,
  applyCoupon,
} = require("./cart.service");

router.use(protect, allowedTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(removeAllCartItems);

router.route("/applyCoupon").put(applyCoupon);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(UpdateQuantityItems);

module.exports = router;
