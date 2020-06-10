const express = require("express");
const router = express.Router();
const {
  signup,
  upload,
  signin,
  isSignedin,
  isAuthenticated,
} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

router.post("/signup", upload.single("profilepic"), signup);

router.post("/signin", signin);

router.get("/", (req, res) => {
  res.send("howm");
});

module.exports = router;
