const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUser,
  getProfilePic,
  updateUser,
} = require("../controllers/user");
const { isSignedin, isAuthenticated, upload } = require("../controllers/auth");
router.param("userId", getUserById);

router.get("/profile/:userId", isSignedin, isAuthenticated, getUser);
router.get(
  "/profile/photo/:userId",
  isSignedin,
  isAuthenticated,
  getProfilePic
);

router.put(
  "/profile/update/:userId",
  isSignedin,
  isAuthenticated,
  upload.single("profilepic"),
  updateUser
);
module.exports = router;
