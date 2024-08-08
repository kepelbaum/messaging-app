import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { connectDb } from "./models";
import routes from "./routes";
import { verifyToken } from "./modules/verifytoken.js";
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const eraseDatabaseOnSync = true;

const app = express();

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
    date: Date.now(),
  });

  const message4 = new models.Chatmessage({
    text: "hey chat",
    user: user3.id,
    date: Date.now() - 5000,
  });

  const chat1 = new models.Chat({
    users: [user1, user2],
    lastMessage: message1,
    messages: [message1],
  });

  const chat2 = new models.Chat({
    users: [user1, user2],
    lastMessage: message3,
    messages: [message2, message3],
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

  await chat1.save();
  await chat2.save();
  await chat3.save();

  await user1.save();
  await user2.save();
  await user3.save();
};
