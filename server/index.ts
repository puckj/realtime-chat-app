require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const port = process.env.LISTENING_PORT;
const multer = require("multer");

app.use(cors());
app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gk1ad0o.mongodb.net/`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((res: any) => {
    console.log("Connected to MongoDB ");
  })
  .catch((err: any) => {
    console.log("Error connecting to MongoDB ", err);
  });

app.listen(port, () => {
  console.log("Server running on port " + port);
});

const User = require("./models/user");
const Message = require("./models/message");

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req: any, file: any, cb: any) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// Configure multer for handling file uploads

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

//endpoint to access all the users except the user who's is currently logged in!
app.get("/users/:userId", (req: any, res: any) => {
  const loggedInUserId = req.params.userId;
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users: any) => {
      res.status(200).json(users);
    })
    .catch((err: any) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retrieving users" });
    });
});

app.post("/friend-request", async (req: any, res: any) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    //update the recepient's friendRequests array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//endpoint to show all the friend-requests of a particular user
app.get("/friend-request/:userId", async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the userId
    const user = await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();

    const friendRequests = user.friendRequests;

    res.status(200).json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint สำหรับ get รายชื่อ friendRequests ของ user นั้นขอเพิ่มเพื่อนไป (ยังไม่ได้ตอบรับเป็นเพื่อน)
app.get("/friend-requests/sent/:userId", async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();

    const sentFriendRequests = user.sentFriendRequests;

    res.json(sentFriendRequests);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server" });
  }
});

//endpoint สำหรับ get รายชื่อเพื่อนทั้งหมดของ user นั้น
app.get("/friends/:userId", (req: any, res: any) => {
  try {
    const { userId } = req.params;

    User.findById(userId)
      .populate("friends")
      .then((user: any) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const friendIds = user.friends.map((friend: any) => friend._id);

        res.status(200).json(friendIds);
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "internal server error" });
  }
});

//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req: any, res: any) => {
  try {
    const { senderId, recepientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.friendRequests = recepient.friendRequests.filter(
      (request: any) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request: any) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint เข้าถึงรายชื่อเพื่อนทั้งหมด ที่ตอบรับคำขอเป็นเพื่อนของ user นั้น
app.get("/accepted-friends/:userId", async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to post Messages and store it in the backend
app.post(
  "/messages",
  upload.single("imageFile"),
  async (req: any, res: any) => {
    try {
      const { senderId, recepientId, messageType, messageText } = req.body;
      // console.log(req.body);
      const newMessage = new Message({
        senderId,
        recepientId,
        messageType,
        message: messageText,
        timestamp: new Date(),
        imageUrl: messageType === "image" ? req.file.path : null,
      });
      // console.log(newMessage);
      await newMessage.save();
      res.status(200).json({ message: "Message sent Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

///endpoint to get the userDetails to design the chat Room header
app.get("/user/:userId", async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req: any, res: any) => {
  try {
    const { senderId, recepientId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to delete the messages
app.post("/deleteMessages", async (req: any, res: any) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }
    await Message.deleteMany({ _id: { $in: messages } });
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});
