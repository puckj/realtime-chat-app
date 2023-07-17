require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = process.env.LISTENING_PORT;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gk1ad0o.mongodb.net/`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res: any) => {
    console.log("Connected to MongoDB ", res);
  })
  .catch((err: any) => {
    console.log("Error connecting to MongoDB ", err);
  });

app.listen(port, () => {
  console.log("Server running on port " + port);
});
