const router = require("express").Router();
const { protect, allowedTo } = require("../../config/auth");
const {
  createUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateMeValidator,
} = require("../../utils/Validator/UserValidation");
const {
  addUser,
  getAllUsers,
  getSpecificUser,
  getLoggedInUser,
  updateUser,
  deleteUser,
  resizeImage,
  uploadImage,
  changePassword,
  updateMyPassword,
  updateMyProfile,
  deleteMe, activateMe,
} = require("./user.service");

// Get My Profile Info
router.get("/getMe", protect, getLoggedInUser, getSpecificUser);

// Update My Profile Password
router.put(
  "/updateMyPassword",
  protect,
  changePasswordValidator,
  updateMyPassword
);

// Update My Profile Password
router.put(
  "/updateMyProfile",
  protect,
  uploadImage,
  resizeImage,
  updateMeValidator,
  updateMyProfile
);
// Deactivate MY Profile
router.delete("/deleteMe", protect, deleteMe, deleteUser);

router.post("/activeMe" , activateMe)
router
  .route("/changePassword/:id")
  .put(protect, allowedTo("admin"), changePasswordValidator, changePassword);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin"),
    uploadImage,
    resizeImage,
    addUser,
    createUserValidator
  )
  .get(protect, getAllUsers);

router
  .route("/:id")
  .get(protect, allowedTo("admin"), getSpecificUserValidator, getSpecificUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
