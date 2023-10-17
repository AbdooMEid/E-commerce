const router = require("express").Router();
const { protect, allowedTo } = require("../../../config/auth");
const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("./wishList.service");
const {
  createWishListValidator,
  removeWishListValidator,
} = require("../../../utils/Validator/wishList.validator");

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(createWishListValidator, addProductToWishList)
  .get(getLoggedUserWishList);

router
  .route("/:productId")
  .delete(removeWishListValidator, removeProductFromWishList);

module.exports = router;
