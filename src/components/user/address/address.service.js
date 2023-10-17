const User = require("../user.model");
const asyncHandling = require("express-async-handler");

//@desc   Add Address To User
//@route  POST /api/v1/Address
//@access Privet/User

exports.addAddressToUser = asyncHandling(async (req, res, next) => {
  // $addToSet => add product to wishList if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    result: user.addresses.length,
    message: "Add Address Successfully",
    data: user.addresses,
  });
});

//@desc   Remove Address From User
//@route  DELETE /api/v1/Address/:addressId
//@access Privet/User
exports.removeAddressFromUser = asyncHandling(async (req, res, next) => {
  // $pull => remove product from wishList if exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Remove Address Successfully",
    data: user.addresses,
  });
});

//@desc   Get Logged User Address
//@route  GET /api/v1/Address
//@access Privet/User
exports.getLoggedUserAddress = asyncHandling(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    success: true,
    message: "Get Logged User WishList",
    result: user.addresses.length,
    data: user.addresses,
  });
});
