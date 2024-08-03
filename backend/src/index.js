import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { connectDb } from "./models";
import routes from "./routes";
import { verifyToken } from "./modules/verifytoken.js";
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

//   app.get('/session', (req, res) => {
//     return res.send(req.context.models.users[req.context.me.id]);
//   });

//   app.get('/users', (req, res) => {
//     return res.send(Object.values(req.context.models.users));
//   });

//   app.get('/users/:userId', (req, res) => {
//     return res.send(req.context.models.users[req.params.userId]);
//   });

//   app.get('/messages', (req, res) => {
//     return res.send(Object.values(req.context.models.messages));
//   });

//   app.get('/messages/:messageId', (req, res) => {
//     return res.send(req.context.models.messages[req.params.messageId]);
//   });

//   app.post('/messages', (req, res) => {
//     const id = uuidv4();
//     const message = {
//       id,
//       text: req.body.text,
//       userId: req.context.me.id,
//     };

//     req.context.models.messages[id] = message;

//     return res.send(message);
//   });

//   app.delete('/messages/:messageId', (req, res) => {
//     const {
//       [req.params.messageId]: message,
//       ...otherMessages
//     } = req.context.models.messages;

//     req.context.models.messages = otherMessages;

//     return res.send(message);
//   });

//   app.get('/users', (req, res) => {
//     return res.send(Object.values(users));
//   });

//   app.get('/users/:userId', (req, res) => {
//     return res.send(users[req.params.userId]);
//   });

//   app.get('/messages', (req, res) => {
//     return res.send(Object.values(messages));
//   });

//   app.get('/messages/:messageId', (req, res) => {
//     return res.send(messages[req.params.messageId]);
//   });

//   app.get('/session', (req, res) => {
//     return res.send(users[req.me.id]);
//   });

//   app.post('/messages', (req, res) => {
//     const id = uuidv4();
//     const message = {
//       id,
//       text: req.body.text,
//       userId: req.me.id,
//     };

//     messages[id] = message;

//     return res.send(message);
//   });

//   app.delete('/messages/:messageId', (req, res) => {
//     const {
//       [req.params.messageId]: message,
//       ...otherMessages
//     } = messages;

//     messages = otherMessages;

//     return res.send(message);
//   });

// app.get('/users', (req, res) => {
//     return res.send('GET HTTP method on user resource');
//   });

//   app.post('/users', (req, res) => {
//     return res.send('POST HTTP method on user resource');
//   });

//   app.put('/users', (req, res) => {
//     return res.send('PUT HTTP method on user resource');
//   });

//   app.delete('/users', (req, res) => {
//     return res.send('DELETE HTTP method on user resource');
//   });

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
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);
    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});

const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: "rwieruch",
  });

  const user2 = new models.User({
    username: "ddavids",
  });

  const message1 = new models.Message({
    text: "Published the Road to learn React",
    user: user1.id,
  });

  const message2 = new models.Message({
    text: "Happy to release ...",
    user: user2.id,
  });

  const message3 = new models.Message({
    text: "Published a complete ...",
    user: user2.id,
  });

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
  await user2.save();
};
