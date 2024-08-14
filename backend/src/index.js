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
  });

  const user2 = new models.Messenger({
    username: "rofl",
    password: "rofl",
    displayName: "rofl",
  });

  const user3 = new models.Messenger({
    username: "roflcopter",
    password: "roflcopter",
    displayName: "roflcopter",
  });

  const user4 = new models.Messenger({
    username: "bob",
    password: "rofl",
    displayName: "Bob",
  });

  const user5 = new models.Messenger({
    username: "ross",
    password: "rofl",
    displayName: "Ross",
  });

  const user6 = new models.Messenger({
    username: "thor",
    password: "rofl",
    displayName: "Thor",
  });

  const user7 = new models.Messenger({
    username: "odin",
    password: "rofl",
    displayName: "Odin",
  });

  const user8 = new models.Messenger({
    username: "loki",
    password: "rofl",
    displayName: "Loki",
  });

  const user9 = new models.Messenger({
    username: "freya",
    password: "rofl",
    displayName: "Freya",
  });

  const user10 = new models.Messenger({
    username: "skadi",
    password: "rofl",
    displayName: "Skadi",
  });

  const message1 = new models.Chatmessage({
    text: "What's up?",
    user: user2.id,
    date: Date.now() - 20000,
  });

  const message2 = new models.Chatmessage({
    text: "Hey rofl",
    user: user1.id,
    date: Date.now() - 15000,
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
};
