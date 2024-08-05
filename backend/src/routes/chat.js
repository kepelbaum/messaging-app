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
        const acc = await req.context.models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (acc) {
          const allChats = await req.context.models.Chat.find({
            users: { $in: [acc._id] },
          })
            .populate("lastMessage") //sorting left to do!!!!!!
            .exec();
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
            const acc = await req.context.models.Messenger.findOne({
              username: authData.user.username,
              password: authData.user.password,
            });
            if (acc) {
              const fullVerify = async () => {
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
                    users: req.body.users.concat(acc._id),
                    groupName: req.body.groupName,
                    lastMessage: newMessage._id,
                    messages: [newMessage._id],
                  }).catch((err) => {
                    res.send(err);
                  });
                  res.json({ result: newChat._id });
                } else {
                  const existingChat = await req.context.models.Chat.findOne({
                    $and: [
                      {
                        users: {
                          $all: [req.body.users[0], acc._id],
                        },
                      },
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
                        date: Date.now(),
                      }).catch((err) => {
                        res.send(err);
                      });
                    const newChat = await req.context.models.Chat.create({
                      users: req.body.users.concat(acc._id),
                      lastMessage: newMessage._id,
                      messages: [newMessage._id],
                    }).catch((err) => {
                      res.send(err);
                    });
                    res.json({ result: newChat._id });
                  }
                }
              };
              fullVerify();
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
  //field validation left to do!
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({ result: "You are not signed in." });
    } else {
      const fullVerify = async () => {
        const chat = await req.context.models.Chat.findById(
          req.params.chatId,
        ).catch((err) => {
          res.send(err);
        });
        const acc = await req.context.models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (!chat) {
          res.json({ result: "Chat not found" });
        }
        if (acc && chat.users.includes(acc._id)) {
          if (req.body.change === "groupName") {
            if (!chat.groupName) {
              res.json({ result: "Can only change name for group chats" });
            } else {
              const change = await req.context.models.Chat.findByIdAndUpdate(
                req.params.chatId,
                { groupName: req.body.groupName },
              );
              res.json({ result: "Change complete" });
            }
          } else if (req.body.change === "add") {
            const change = req.context.models.Chat.findOneByIdAndUpdate(
              req.params.chatId,
              { $push: { users: req.body.newUser } },
            );
            const userside = req.context.models.Messenger.findByIdAndUpdate(
              req.body.newUser,
              { $push: { chats: req.params.chatId } },
            );
            res.json({ result: "Change complete" });
          } else if (req.body.change === "leave") {
            const change = req.context.models.Chat.findOneByIdAndUpdate(
              req.params.chatId,
              { $pull: { users: acc._id } },
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
