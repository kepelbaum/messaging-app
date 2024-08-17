import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { connectDb } from "./models";
import routes from "./routes";
import { verifyToken } from "./modules/verifytoken.js";
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
import { v4 as uuidv4 } from "uuid";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const eraseDatabaseOnSync = true;

const app = express();

/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

// /////////////////////////////////////
// // Gets details of an uploaded image
// /////////////////////////////////////
// const getAssetInfo = async (publicId) => {
//   // Return colors in the response
//   const options = {
//     colors: true,
//   };

//   try {
//     // Get details about the asset
//     const result = await cloudinary.api.resource(publicId, options);
//     console.log(result);
//     return result.colors;
//   } catch (error) {
//     console.error(error);
//   }
// };

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
  };
  next();
});

app.use("/users", routes.user);
app.use("/messages", routes.message);
app.use("/chats", routes.chat);

app.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({ result: "You are not signed in." });
    } else {
      const fullVerify = async () => {
        const acc = await models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (acc) {
          res.json({
            message: "Welcome, " + authData.user.username + "!",
            name: acc.username,
            id: acc.id,
            friends: acc.friends,
          });
        } else {
          res.json({ result: "You are not signed in." });
        }
      };
      fullVerify();
    }
  });
});

app.post("/login", async (req, res, next) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  const check = await models.Messenger.findOne({
    username: user.username,
    password: user.password,
  });
  if (check) {
    jwt.sign({ user }, "secretkey", { expiresIn: "10h" }, (err, token) => {
      res.json({
        token,
        id: check._id,
      });
    });
  } else {
    res.json({ result: "Wrong username and/or password." });
  }
});

app.get("*", function (req, res, next) {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);

  error.statusCode = 301;

  next(error);
});

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 301) {
    return res.status(301).redirect("/not-found");
  }

  return res.status(error.statusCode).json({ error: error.toString() });
});

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.Messenger.deleteMany({}),
      models.Chat.deleteMany({}),
      models.Chatmessage.deleteMany({}),
    ]);
    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});

const createUsersWithMessages = async () => {
  const user1 = new models.Messenger({
    username: "roflan",
    password: "roflan",
    displayName: "roflan",
    avatar:
      "https://images.unsplash.com/photo-1606926233688-0594e2344efb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user2 = new models.Messenger({
    username: "rofl",
    password: "test",
    displayName: "rofl",
    avatar:
      "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user3 = new models.Messenger({
    username: "roflcopter",
    password: "test",
    displayName: "roflcopter",
    avatar:
      "https://plus.unsplash.com/premium_photo-1661962637716-e29cb0ac15c1?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://plus.unsplash.com/premium_photo-1666700698946-fbf7baa0134a?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user4 = new models.Messenger({
    username: "bob",
    password: "test",
    displayName: "Bob",
    avatar:
      "https://images.unsplash.com/photo-1719776555224-75afcc74d03b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://plus.unsplash.com/premium_photo-1682124752476-40db22034a58?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user5 = new models.Messenger({
    username: "ross",
    password: "test",
    displayName: "Ross",
    avatar:
      "https://images.unsplash.com/photo-1548546738-8509cb246ed3?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://plus.unsplash.com/premium_photo-1682124853113-d1aad6ae96ef?q=80&w=2663&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user6 = new models.Messenger({
    username: "thor",
    password: "test",
    displayName: "Thor",
    avatar:
      "https://images.unsplash.com/photo-1559087867-ce4c91325525?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://plus.unsplash.com/premium_photo-1664298006973-e98eb94d006c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user7 = new models.Messenger({
    username: "odin",
    password: "test",
    displayName: "Odin",
    avatar:
      "https://images.unsplash.com/photo-1525540796810-55f9fbc5592f?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://images.unsplash.com/photo-1457528877294-b48235bdaa68?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user8 = new models.Messenger({
    username: "loki",
    password: "test",
    displayName: "Loki",
    avatar:
      "https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://plus.unsplash.com/premium_photo-1678025061535-91fe679f8105?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user9 = new models.Messenger({
    username: "freya",
    password: "test",
    displayName: "Freya",
    avatar:
      "https://images.unsplash.com/photo-1532328076801-a862c9d5a74a?q=80&w=2652&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user10 = new models.Messenger({
    username: "skadi",
    password: "test",
    displayName: "Skadi",
    avatar:
      "https://images.unsplash.com/photo-1484278786775-527ac0d0b608?q=80&w=2561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://images.unsplash.com/photo-1484278786775-527ac0d0b608?q=80&w=2561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const user11 = new models.Messenger({
    username: "baldr",
    password: "test",
    displayName: "Baldr",
    avatar:
      "https://images.unsplash.com/photo-1564598328706-70cecb6ad257?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    background:
      "https://images.unsplash.com/photo-1540878724756-d5c4517dea9c?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const message1 = new models.Chatmessage({
    text: "What's up?",
    user: user2.id,
    date: Date.now() - 20000,
  });

  const message2 = new models.Chatmessage({
    text: "Hey test",
    user: user1.id,
    date: Date.now() - 150000000,
  });

  const message3 = new models.Chatmessage({
    text: "You there, man?",
    user: user1.id,
    date: Date.now() - 3000,
  });

  const message4 = new models.Chatmessage({
    text: "hey chat",
    user: user3.id,
    date: Date.now() - 5000,
  });

  const message6 = new models.Chatmessage({
    text: "MananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaaMananananaa",
    user: user1.id,
    date: Date.now(),
  });

  const message5 = new models.Chatmessage({
    img: "https://res.cloudinary.com/dxbkraqxl/image/upload/v1723673392/1cf6b1572ee65fd008e3866daf138f12.jpg",
    user: user1.id,
    date: Date.now() - 2000,
    text: "Image",
  });

  const chat1 = new models.Chat({
    users: [user1, user2],
    lastMessage: message1,
    messages: [message1],
  });

  const chat2 = new models.Chat({
    users: [user1, user2],
    lastMessage: message5,
    messages: [message2, message3, message5, message6],
    groupName: "Utopia",
  });

  const chat3 = new models.Chat({
    users: [user1, user2, user3],
    lastMessage: message4,
    messages: [message4],
    groupName: "Asylum",
  });

  user1.chats = [chat1, chat2, chat3];
  user2.chats = [chat1, chat2, chat3];
  user3.chats = [chat3];

  await message1.save();
  await message2.save();
  await message3.save();
  await message4.save();
  await message5.save();
  await message6.save();

  await chat1.save();
  await chat2.save();
  await chat3.save();

  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();
  await user5.save();
  await user6.save();
  await user7.save();
  await user8.save();
  await user9.save();
  await user10.save();
  await user11.save();
};
