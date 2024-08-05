import { Router } from "express";
import { verifyToken } from "../modules/verifytoken.js";
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({ result: "You are not signed in." });
    } else {
      const fullVerify = async () => {
        const allChats = awaitreq.context.models.Chat.find({
          users: { $in: [authData.user.username] },
        })
          .populate("lastMessage") //sorting left to do!!!!!!
          .exec();
        const acc = await req.context.models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (acc) {
          res.json({ result: allChats });
        } else {
          res.json({ result: "Invalid authentication token" });
        }
      };
      fullVerify();
    }
  });
});

router.post(
  "/",
  body("message")
    .isLength({ min: 1 })
    .withMessage("Please enter the first message."),
  verifyToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
          res.json({ result: "You are not signed in." });
        } else {
          const fullVerify = async () => {
            if (req.body.users.includes(authData.user.username)) {
              const acc = await req.context.models.Messenger.findOne({
                username: authData.user.username,
                password: authData.user.password,
              });
              if (acc) {
                async () => {
                  if (req.body.groupName) {
                    const newMessage =
                      await req.context.models.Chatmessage.create({
                        text: req.body.message,
                        user: authData.user.username,
                        date: Date.now(),
                      }).catch((err) => {
                        res.send(err);
                      });
                    const newChat = await req.context.models.Chat.create({
                      users: req.body.users,
                      groupName: req.body.groupName,
                      lastMessage: newMessage._id,
                      messages: [newMessage._id],
                    }).catch((err) => {
                      res.send(err);
                    });
                    res.json({ result: newChat._id });
                  } else {
                    const existingChat = req.context.models.Chat.findOne({
                      $and: [
                        { username: { $in: [req.body.users[0]] } },
                        { username: { $in: [req.body.users[1]] } },
                        { groupName: null },
                      ],
                    });
                    if (existingChat) {
                      res.json({ result: "Chat already exists" });
                    } else {
                      const newMessage =
                        await req.context.models.Chatmessage.create({
                          text: req.body.message,
                          user: authData.user.username,
                        }).catch((err) => {
                          res.send(err);
                        });
                      const newChat = await req.context.models.Chat.create({
                        users: req.body.users,
                        lastMessage: newMessage._id,
                        messages: [newMessage._id],
                      }).catch((err) => {
                        res.send(err);
                      });
                      res.json({ result: newChat._id });
                    }
                  }
                };
              } else {
                res.json({ result: "Invalid authentication token" });
              }
            } else {
              res.json({ result: "Invalid authentication token" });
            }
          };
          fullVerify();
        }
      });
    }
  },
);

//WIP

router.put("/:chatId", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({ result: "You are not signed in." });
    } else {
      const fullVerify = async () => {
        const chat = awaitreq.context.models.Chat.find(req.body.id);
        const acc = await req.context.models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (acc && chat.users.includes(authData.user.username)) {
          if (req.body.change === "groupName") {
            if (chat.groupName === null) {
              res.json({ result: "Can only change name for group chats" });
            } else {
              const change = req.context.models.Chat.findOneByIdAndUpdate(
                req.body.id,
                { groupName: req.body.groupName },
              );
              res.json({ result: "Change complete" });
            }
          } else if (req.body.change === "add") {
            const change = req.context.models.Chat.findOneByIdAndUpdate(
              req.body.id,
              { $push: { users: req.body.newUser } },
            );
            res.json({ result: "Change complete" });
          } else if (req.body.change === "leave") {
            const change = req.context.models.Chat.findOneByIdAndUpdate(
              req.body.id,
              { $pull: { users: authData.user.username } },
            );
            res.json({ result: "Left the chat" });
          } else {
            res.json({ result: "Invalid change type" });
          }
        } else {
          res.json({ result: "Invalid authentication token" });
        }
      };
      fullVerify();
    }
  });
});

router.delete("/:chatId", verifyToken, async (req, res, next) => {
  const chat = await req.context.models.Chat.findById(req.body.id);
  if (!chat) {
    res.json({ result: "Chat not found" });
  } else {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        res.json({ result: "You are not signed in." });
      } else {
        const fullVerify = async () => {
          const acc = await req.context.models.Messenger.findOne({
            username: authData.user.username,
            password: authData.user.password,
          });
          if (acc && chat.users.includes(authData.user.username)) {
            if (chat.users.length > 1) {
              res.json({
                result:
                  "Cannot delete chat unless user is the last one remaining",
              });
            } else {
              async () => {
                const result =
                  await req.context.models.Chat.findOneByIdAndDelete(
                    req.body.id,
                  );
                res.json({ result: "Chat deleted" });
              };
            }
          } else {
            res.json({ result: "Invalid authentication token" });
          }
        };
        fullVerify();
      }
    });
  }
});

export default router;
