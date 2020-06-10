const mongoose = require("mongoose");
const uuid = require("uuid/v1");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    encry_password: {
      type: String,
      required: true,
    },
    profilepic: {
      data: Buffer,
      ContentType: String,
    },
    country: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    birthdate: {
      type: Date,
    },
    age: {
      type: Number,
    },
    profession: {
      type: String,
    },
    questionsAsked: {
      type: Number,
      default: 0,
    },
    answersGiven: {
      type: Number,
      default: 0,
    },
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: {
      currentTime: () => {
        const date = new Date();
        return (
          date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        );
      },
    },
  }
);

User.virtual("password")
  .set(function (plainpassword) {
    this._password = plainpassword;
    this.salt = uuid();
    console.log(this.salt);
    this.encry_password = this.encryptPassword(plainpassword);
  })
  .get(function () {
    return this._password;
  });

User.methods = {
  checkPassword: function (checkingpassword) {
    return this.encryptPassword(checkingpassword) === this.encry_password;
  },

  encryptPassword: function (plainpassword) {
    console.log(this.salt);
    if (plainpassword === "") {
      return "";
    } else {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    }
  },
};

module.exports = mongoose.model("myuser", User);
