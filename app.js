require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//Importing custom Routes

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
//Connecting to the DB

mongoose
  .connect("mongodb://localhost:27017/mernstack", {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log("not connected");
  });

//adding middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//adding custom middlewares

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(5000, () => {
  console.log("Server is running at 5000");
});
