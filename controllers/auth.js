const User = require("../models/User");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const storage = multer.memoryStorage();

exports.upload = multer({ storage: storage });

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || user) {
      return res.status(400).json({
        err: "Either server error or account alreadt exists",
      });
    }
    const rawUser = {};
    rawUser.name = req.body.name;
    rawUser.lastname = req.body.lastname;
    rawUser.email = req.body.email;
    rawUser.country = req.body.country;
    rawUser.likes = req.body.likes;
    rawUser.password = req.body.password;
    rawUser.birthdate = req.body.birthdate;
    rawUser.age = req.body.age;
    rawUser.profession = req.body.profession;

    if (req.file && req.file.size < 400000) {
      rawUser.profilepic = {};
      rawUser.profilepic.data = req.file.buffer;
      rawUser.profilepic.ContentType = req.file.mimetype;
    }
    //   console.log(rawUser);
    const newUser = new User(rawUser);
    newUser
      .save()
      .then((user) => {
        res.status(200).json({
          msg: "done",
          user,
        });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).json({
          err: "error in saving a user",
        });
      });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User does not exist",
      });
    }

    if (user.checkPassword(req.body.password)) {
      payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      jwt.sign(payload, process.env.SECRET, (err, token) => {
        if (err) {
          return res.status(400).json({
            err: "error in assigning a token",
          });
        } else {
          res.status(200).json({
            user: payload,
            token: `bearer ${token}`,
          });
        }
      });
    } else {
      return res.status(400).json({
        msg: "custom",
        err: "email and password doesnot match",
      });
    }
  });
};

exports.isSignedin = (req, res, next) => {
  // console.log(req.headers);
  const header_params = req.headers["authorization"].split(" ");

  const token = header_params[1];

  jwt.verify(token, process.env.SECRET, (err, payload) => {
    if (err) {
      return res.status("400").json("Invalid token");
    } else {
      req.user = payload;
      next();
    }
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.profile && req.user._id == req.profile._id) {
    next();
  } else {
    console.log(req.user._id);
    console.log(req.profile._id);
    return res.json({
      err: "Not authenticated",
    });
  }
};
