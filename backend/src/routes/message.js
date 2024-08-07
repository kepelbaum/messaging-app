import { Router } from "express";
import { verifyToken } from "../modules/verifytoken.js";
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = Router();

// router.get("/:messageId", verifyToken, async (req, res, next) => {
//   jwt.verify(req.token, "secretkey", (err, authData) => {
//     if (err) {
//       res.json({ result: "You are not signed in." });
//     } else {
//       const fullVerify = async () => {
//         const messages = await req.context.models.Chatmessage.find({
//           chat: req.params.chatId,
//         });
//         const chat = await req.context.models.Chat.findById(req.params.chatId);
//         const acc = await req.context.models.Messenger.findOne({
//           username: authData.user.username,
//           password: authData.user.password,
//         });
//         if (acc && chat.users.includes(authData.user.username)) {
//           res.json(messages);
//         } else {
//           res.json({ result: "Invalid authentication token" });
//         }
//       };
//       fullVerify();
//     }
//   });
// });

router.post(
  "/:chatId",
  body("message").isLength({ min: 1 }).withMessage("Please enter a message."),
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
            const findChat = await req.context.models.Chat.findById(
              req.params.chatId,
            );
            if (acc && findChat && findChat.users.includes(acc._id)) {
              const message = await req.context.models.Chatmessage.create({
                text: req.body.message,
                user: acc._id,
                date: Date.now(),
              }).catch((error) => {
                error.statusCode = 400;
                next(error);
              });
              const chat = await req.context.models.Chat.findByIdAndUpdate(
                req.params.chatId,
                {
                  $push: { messages: message._id },
                  lastMessage: message._id,
                },
              );
              return res.json({
                result: "Message posted",
              });
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

router.put(
  "/:messageId",
  body("message").isLength({ min: 1 }).withMessage("Please enter a message."),
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
            const message = await req.context.models.Chatmessage.findById(
              req.params.messageId,
            ).catch((error) => {
              error.statusCode = 400;
              next(error);
            });
            if (acc && message.user.toString() === acc.id) {
              const update =
                await req.context.models.Chatmessage.findByIdAndUpdate(
                  req.params.messageId,
                  { text: req.body.message },
                );
              return res.json({
                result: "Message updated",
              });
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

router.delete("/:chatId/:messageId", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({ result: "You are not signed in." });
    } else {
      const fullVerify = async () => {
        const message = await req.context.models.Chatmessage.findById(
          req.params.messageId,
        ).catch((error) => {
          error.statusCode = 400;
          next(error);
        });
        const acc = await req.context.models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (message && acc && message.user.toString() === acc.id) {
          const chat = await req.context.models.Chat.findById(
            req.params.chatId,
          );
          const del = await req.context.models.Chatmessage.findByIdAndDelete(
            req.params.messageId,
          );

          if (chat.messages.length === 1) {
            chat.users.forEach(async (id) => {
              const eachUser =
                await req.context.models.Messenger.findByIdAndUpdate(id, {
                  $pull: { chats: chat._id },
                }).catch((err) => {
                  res.send(err);
                });
            });
            const delChat = await req.context.models.Chat.findByIdAndDelete(
              req.params.chatId,
            );

            return res.json({ result: "Chat deleted" });
          } else {
            const sortedChat = await req.context.models.Chat.findById(
              req.params.chatId,
            )
              .sort({ date: -1 })
              .limit(1);
            const updatedChat = await req.context.models.Chat.findByIdAndUpdate(
              req.params.chatId,
              {
                lastMessage: sortedChat.messages[0]._id,
                $pull: { messages: req.params.messageId },
              },
            );

            return res.json({
              result: "Message deleted",
            });
          }
        } else {
          res.json({ result: "Invalid authentication token" });
        }
      };
      fullVerify();
    }
  });
});

export default router;
