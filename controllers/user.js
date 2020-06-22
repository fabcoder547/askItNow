const User = require("../models/User");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

exports.getUserById = (req, res, next, userId) => {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.json({
          error: "user does not exist",
        });
      } else {
        req.profile = user;
        next();
      }
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Invalid id",
      });
    });
};

exports.getUser = (req, res) => {
  req.profile.encry_password = undefined;
  req.profile.salt = undefined;
  return res.status(200).json({
    user: req.profile,
  });
};

exports.getProfilePic = (req, res) => {
  if (req.profile.profilepic) {
    res.set("Content-Type", req.profile.profilepic.ContentType);

    res.send(req.profile.profilepic.data);
  }
};

exports.updateUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  let updateduser = {};
  if (!req.body.name && req.profile.name) {
    updateduser.name = req.profile.name;
  } else {
    updateduser.name = req.body.name;
  }
  if (!req.body.lastname && req.profile.lastname) {
    updateduser.lastname = req.profile.lastname;
  } else {
    updateduser.lastname = req.body.lastname;
  }
  if (!req.body.email && req.profile.email) {
    updateduser.email = req.profile.email;
  } else {
    updateduser.email = req.body.email;
  }
  if (!req.body.country && req.profile.country) {
    updateduser.country = req.profile.country;
  } else {
    updateduser.country = req.body.country;
  }
  if (!req.body.profession && req.profile.profession) {
    updateduser.profession = req.profile.profession;
  } else {
    updateduser.profession = req.body.profession;
  }
  if (!req.body.age && req.profile.age) {
    updateduser.age = req.profile.age;
  } else {
    updateduser.age = req.body.age;
  }
  if (!req.body.birthdate && req.profile.birthdate) {
    updateduser.birthdate = req.profile.birthdate;
  } else {
    updateduser.birthdate = req.body.birthdate;
  }

  if (req.file && req.file.size < 2000000) {
    updateduser.profilepic = {};
    if (!req.file && req.profile.profilepic) {
      updateduser.profilepic.data = req.profile.profilepic.data;
      updateduser.profilepic.ContentType = req.profile.profilepic.ContentType;
    } else {
      updateduser.profilepic.data = req.file.buffer;
      updateduser.profilepic.ContentType = req.file.mimetype;
    }
  }

  User.findOneAndUpdate(
    { email: req.profile.email },
    {
      $set: updateduser,
    }
  )
    .then((user) => {
      user
        .save()
        .then((user) => {
          res.json({
            user: user,
          });
        })
        .catch((err) => {
          res.json({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).json({
        error: `Error in updating user ${err.message}`,
      });
    });
};
