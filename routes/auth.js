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
const { check } = require("express-validator");

router.param("userId", getUserById);

router.post(
  "/signup",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 5 }),
    check("name").isString(),
  ],
  upload.single("profilepic"),
  signup
);

router.post("/signin", [check("email").isEmail()], signin);

router.get("/", (req, res) => {
  res.send("howm");
});

module.exports = router;
