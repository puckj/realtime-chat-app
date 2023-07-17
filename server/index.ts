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

const User = require("./models/user");
const Message = require("./models/message");

//endpoint
app.post("/register", (req: any, res: any) => {
  const { name, email, password, image } = req.body;

  //create a new User object
  const newUser = new User({
    name,
    email,
    password,
    image,
  });

  //save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registerd successfully" });
    })
    .catch((err: any) => {
      console.log("Error registering user", err);
      res.status(500).json({ message: "Error registering the user!" });
    });
});

//function to create a token for the user
const createToken = (userId: any) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };
  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

app.post("/login", (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }
  User.findOne({ email })
    .then((user: any) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid Password!" });
      }
      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error: any) => {
      console.log("error in finding the user", error);
      res.status(500).json({ message: "Internal server Error!" });
    });
});
