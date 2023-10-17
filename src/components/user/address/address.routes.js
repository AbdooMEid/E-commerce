const router = require("express").Router();
const { protect, allowedTo } = require("../../../config/auth");
const {
  addAddressToUser,
  removeAddressFromUser,
  getLoggedUserAddress,
} = require("./address.service");
const {
  removeAddressValidator,
  createAddressValidator,
} = require("../../../utils/Validator/address.validation");

router.use(protect, allowedTo("user"));
router
  .route("/")
  .post(createAddressValidator, addAddressToUser)
  .get(getLoggedUserAddress);
router
  .route("/:addressId")
  .delete(removeAddressValidator, removeAddressFromUser);
module.exports = router;
