const {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("./forgotPassword");

const router = require("express").Router();

router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
