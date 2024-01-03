const router = require("express").Router();
const { protect, allowedTo } = require("../../config/auth");
const {
  createCashOrder,
  filterOrderForLoggedUser,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderToDeliveredState,
  checkOutSession,
} = require("./orde.service");
const getRawBody = require("raw-body");

router.use(protect);
router.use(function (req, res, next) {
  getRawBody(
    req,
    {
      length: req.headers["content-length"],
      limit: "1mb",
      encoding: contentType.parse(req).parameters.charset,
    },
    function (err, string) {
      if (err) return next(err);
      req.text = string;
      next();
    }
  );
});
router.get("/checkout-session/:cartId", allowedTo("user"), checkOutSession);
router.route("/:cartId").post(allowedTo("user"), createCashOrder);
router.get(
  "/",
  allowedTo("user", "admin"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.get("/:id", allowedTo("user"), getSpecificOrder);
router.put("/:id/pay", allowedTo("admin"), updateOrderToPaid);
router.put("/:id/deliver", allowedTo("admin"), updateOrderToDelivered);
router.put("/:id/orderState", allowedTo("admin"), updateOrderToDeliveredState);

module.exports = router;
