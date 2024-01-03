const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/Error/ApiError");
const Cart = require("../cart/cart.model");
const Product = require("../product/product.model");
const Order = require("./order.model");
const User = require("../user/user.model");
const { getAllHandler, getSpecificHandler } = require("../Handler/getHandler");
const getRawBody = require("raw-body");

// @desc   Create Cash Order
// @route  POST /api/v1/orders/cartId
// @access Privet/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1 - get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There Is No Cart With This Id ${req.params.cartId}`, 404)
    );
  }

  // check if the product quantity is greater than or equal to the quantity items on cart
  cart.cartItems.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (product.quantity < item.quantity || product.quantity === 0)
      return next(
        new ApiError(
          `The Quantity of Product ${product.title} Is Not Enough`,
          404
        )
      );
  });

  // 2 - Get Order Price depend on total Price cart "check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3 - create order with default payment method type "Cash"
  const order = await Order.create({
    userId: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4 - After creating order , decrement product quantity , increment product sold
  if (order) {
    let bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    // 5 - Clear Cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(200).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { userId: req.user._id };
  next();
});

// @desc   Get All Orders
// @route  POST /api/v1/Order
// @access Privet/User-Admin
exports.getAllOrders = getAllHandler(Order);

// @desc   Get Specific Order
// @route  POST /api/v1/Order
// @access Privet/User
exports.getSpecificOrder = getSpecificHandler(Order);

// @desc   Update status Order By Admin
// @route  PUT /api/v1/Order/:id/pay
// @access Privet/Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There Is such a order with id : ${req.params.id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc   Update status Order By Admin
// @route  PUT /api/v1/Order/:id/deliver
// @access Privet/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There Is such a order with id : ${req.params.id}`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc   Update status Order By Admin
// @route  PUT /api/v1/Order/:id/orderState
// @access Privet/Admin
exports.updateOrderToDeliveredState = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There Is such a order with id : ${req.params.id}`, 404)
    );
  }
  order.deliveredState = req.body.deliveredState;
  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc   Create checkOut Session from stripe and send it as response
// @route  GET /api/v1/Order/checkout-session/:cartId
// @access Privet/User
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1 - get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There Is No Cart With This Id ${req.params.cartId}`, 404)
    );
  }
  // check if the product quantity is greater than or equal to the quantity items on cart
  cart.cartItems.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (product.quantity < item.quantity || product.quantity === 0)
      return next(
        new ApiError(
          `The Quantity of Product ${product.title} Is Not Enough`,
          404
        )
      );
  });

  // 2 - Get Order Price depend on total Price cart "check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3 - Create CheckOut Session from stripe
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/Order`,
    cancel_url: `${req.protocol}://${req.get("host")}/Cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "Success", session });
});
const createOrderCard = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;
  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });
  // create Order with card payment
  const order = await Order.create({
    userId: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    deliveredState: "processing",
    paymentMethodType: "card",
  });
  // 4 - After creating order , decrement product quantity , increment product sold
  if (order) {
    let bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    // 5 - Clear Cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc   This webhook will run when stripe payment success paid
// @route  POST /checkout-webhook
// @access Privet/User
//checkout Webhook
exports.checkoutWebhook = asyncHandler(async (req, res, next) => {
  let event = req.body;
  const sig = req.headers["stripe-signature"];
  const endPointSecret = process.env.WEBHOOK_SECRET;
  const { body } = req.body;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createOrderCard(event.data.object);
  }
  res.status(200).json({ received: true });
});
