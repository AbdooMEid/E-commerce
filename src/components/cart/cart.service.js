const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/Error/ApiError");
const Coupon = require("../coupon/coupon.model");
const Cart = require("./cart.model");
const Product = require("../product/product.model");

//calculate total price
const calculateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc   Add Product To Cart
// @route  POST /api/v1/Cart
// @access Privet/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  if (product.stock <= 0) {
    return next(new ApiError("Product out of stock", 400));
  }
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  // 1) Get Cart For Logged User
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      userId: req.user._id,
      cartItems: [
        {
          productId: productId,
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    // product is exist in cart , update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // This product is not exist in cart , add product to cart
      cart.cartItems.push({
        productId: productId,
        color: color,
        price: product.price,
      });
    }
  }

  // cart.totalPrice = totalPrice;
  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
    message: "Add Product To Cart",
  });
});

// @desc   Get Cart Logged User
// @route  GET /api/v1/Cart
// @access Privet/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There Is No Cart For This User Id ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc   Remove Specific Cart Items
// @route  DELETE /api/v1/Cart/:ItemId
// @access Privet/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There Is No Cart For This User Id ${req.user._id}`, 404)
    );
  }
  const removeItem = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.itemId },
      },
    },
    { new: true }
  );
  // calculate Total Price
  calculateTotalPrice(removeItem);
  await removeItem.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: removeItem.cartItems.length,
    data: removeItem,
  });
});

// @desc   Remove All Cart Items
// @route  DELETE /api/v1/Cart/
// @access Privet/User
exports.removeAllCartItems = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ userId: req.user._id });
  res.status(204).send();
});

// @desc   Update Quantity Of Specific Cart Items
// @route  PUT /api/v1/Cart/:ItemId
// @access Privet/User
exports.UpdateQuantityItems = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There Is No Cart For This User Id ${req.user._id}`, 404)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There Is No Item For This Id ${req.params.itemId}`, 404)
    );
  }

  // calculate Total Price
  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc   Apply coupon on logged User cart
// @route  PUT /api/v1/Cart/applyCoupon
// @access Privet/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1- check if coupon is valid or not
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gte: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`Coupon is Invalid or Expired`, 400));
  }

  // 2- find cart and calculate total price after discount
  const cart = await Cart.findOne({ userId: req.user._id });
  const totalCartPrice = cart.totalPrice;

  // 3- calculate total price after discount
  const totalPriceAfterDiscounts = (
    totalCartPrice -
    (totalCartPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscounts;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
