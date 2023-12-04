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

router.use(protect);
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
