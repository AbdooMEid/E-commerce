const User = require("../user.model");
const asyncHandling = require("express-async-handler");

//@desc   Add Product TO WishList
//@route  POST /api/v1/WishList
//@access Privet/User
exports.addProductToWishList = asyncHandling(async (req, res, next) => {
  // $addToSet => add product to wishList if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Add Product To Your WishList",
    data: user.wishlist,
  });
});

//@desc   Remove Product From WishList
//@route  DELETE /api/v1/WishList/:productId
//@access Privet/User
exports.removeProductFromWishList = asyncHandling(async (req, res, next) => {
  // $pull => remove product from wishList if exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Remove Product To Your WishList",
    data: user.wishlist,
  });
});

//@desc   Get Logged User WishList
//@route  GET /api/v1/WishList
//@access Privet/User
exports.getLoggedUserWishList = asyncHandling(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    success: true,
    message: "Get Logged User WishList",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
