import { Router } from "express";
import { verifyToken } from "../modules/verifytoken.js";
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// /////////////////////////
// // Uploads an image file
// /////////////////////////
// const uploadImage = async (imagePath) => {
//   // Use the uploaded file's name as the asset's public ID and
//   // allow overwriting the asset with new versions
//   const options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: true,
//   };

//   try {
//     // Upload the image
//     const result = await cloudinary.uploader.upload(imagePath, options);
//     console.log(result);
//     return result.public_id;
//   } catch (error) {
//     console.error(error);
//   }
// };

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
            .populate("users") //sorting left to do!!!!!!
            .populate({ path: "messages", populate: { path: "user" } })
            // .sort({ _id: 1 })
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
  "/:userId",
  upload.single("image"),
  verifyToken,
  async (req, res, next) => {
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
            const existingChat = await req.context.models.Chat.findOne({
              $and: [
                {
                  users: {
                    $all: [req.params.userId, acc._id],
                  },
                },
                { groupName: null },
              ],
            });
            if (existingChat) {
              res.json({ result: "Chat already exists" });
            } else {
              const uploadResult = await cloudinary.uploader
                .upload(req.file.path, {
                  public_id: req.file.filename,
                })
                .catch((error) => {
                  console.log(error);
                });
              const newMessage = await req.context.models.Chatmessage.create({
                img: uploadResult.secure_url,
                text: "Image",
                user: acc._id,
                date: Date.now(),
              }).catch((err) => {
                res.send(err);
              });
              let newUsers = [req.params.userId].concat(acc._id);
              const newChat = await req.context.models.Chat.create({
                users: newUsers,
                messages: [newMessage._id],
              }).catch((err) => {
                res.send(err);
              });
              newUsers.forEach(async (id) => {
                const eachUser =
                  await req.context.models.Messenger.findByIdAndUpdate(id, {
                    $push: { chats: newChat._id },
                  }).catch((err) => {
                    res.send(err);
                  });
              });
              res.json({ result: newChat._id });
            }
          } else {
            res.json({ result: "Invalid authentication token" });
          }
        };
        fullVerify();
      }
    });
  },
);

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
              if (req.body.groupName) {
                const newMessage = await req.context.models.Chatmessage.create({
                  text: req.body.message,
                  user: acc._id,
                  date: Date.now(),
                }).catch((err) => {
                  res.send(err);
                });
                let newUsers = req.body.users.concat(acc._id);
                const newChat = await req.context.models.Chat.create({
                  users: newUsers,
                  groupName: req.body.groupName,
                  messages: [newMessage._id],
                }).catch((err) => {
                  res.send(err);
                });
                newUsers.forEach(async (id) => {
                  const eachUser =
                    await req.context.models.Messenger.findByIdAndUpdate(id, {
                      $push: { chats: newChat._id },
                    }).catch((err) => {
                      res.send(err);
                    });
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
                      user: acc._id,
                      date: Date.now(),
                    }).catch((err) => {
                      res.send(err);
                    });
                  let newUsers = req.body.users.concat(acc._id);
                  const newChat = await req.context.models.Chat.create({
                    users: newUsers,
                    messages: [newMessage._id],
                  }).catch((err) => {
                    res.send(err);
                  });
                  newUsers.forEach(async (id) => {
                    const eachUser =
                      await req.context.models.Messenger.findByIdAndUpdate(id, {
                        $push: { chats: newChat._id },
                      }).catch((err) => {
                        res.send(err);
                      });
                  });
                  res.json({ result: newChat._id });
                }
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

router.put(
  "/avatar/:chatId",
  upload.single("image"),
  verifyToken,
  async (req, res, next) => {
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
            // const imagePath = req.file;
            // const publicId = await uploadImage(imagePath).secure_url;

            const uploadResult = await cloudinary.uploader
              .upload(req.file.path, {
                public_id: req.file.filename,
              })
              .catch((error) => {
                console.log(error);
              });
            const updatedChat = await req.context.models.Chat.findByIdAndUpdate(
              req.params.chatId,
              {
                avatar: uploadResult.secure_url,
              },
            );
            return res.json({
              result: "Image uploaded",
            });
          } else {
            res.json({ result: "Invalid authentication token" });
          }
        };
        fullVerify();
      }
    });
  },
);

router.put(
  "/background/:chatId",
  upload.single("image"),
  verifyToken,
  async (req, res, next) => {
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
            // const imagePath = req.file;
            // const publicId = await uploadImage(imagePath).secure_url;

            const uploadResult = await cloudinary.uploader
              .upload(req.file.path, {
                public_id: req.file.filename,
              })
              .catch((error) => {
                console.log(error);
              });
            const updatedChat = await req.context.models.Chat.findByIdAndUpdate(
              req.params.chatId,
              {
                background: uploadResult.secure_url,
              },
            );
            return res.json({
              result: "Image uploaded",
            });
          } else {
            res.json({ result: "Invalid authentication token" });
          }
        };
        fullVerify();
      }
    });
  },
);

router.put("/:chatId", verifyToken, async (req, res, next) => {
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
          } else if (chat.groupName && req.body.change === "add") {
            const change = await req.context.models.Chat.findByIdAndUpdate(
              req.params.chatId,
              { $push: { users: req.body.newUser } },
            );
            const userside =
              await req.context.models.Messenger.findByIdAndUpdate(
                req.body.newUser,
                { $push: { chats: req.params.chatId } },
              );
            res.json({ result: "Change complete" });
          }
          //  else if (chat.groupName && req.body.change === "remove") {
          //   const change = await req.context.models.Chat.findByIdAndUpdate(
          //     req.params.chatId,
          //     { $pull: { users: req.body.oldUser } },
          //   );
          //   const userside =
          //     await req.context.models.Messenger.findByIdAndUpdate(
          //       req.body.oldUser,
          //       { $pull: { chats: req.params.chatId } },
          //     );
          //   res.json({ result: "Change complete" });
          // }
          else if (chat.groupName && req.body.change === "leave") {
            const change = await req.context.models.Chat.findByIdAndUpdate(
              req.params.chatId,
              { $pull: { users: acc._id } },
            );
            if (chat.users.length === 0) {
              const chatdelete =
                await req.context.models.Chat.findByIdAndDelete(
                  req.params.chatId,
                );
            }
            const userside =
              await req.context.models.Messenger.findByIdAndUpdate(acc._id, {
                $pull: { chats: req.params.chatId },
              });
            res.json({ result: "Left the chat" });
          } else if (chat.groupName && req.body.change === "bio") {
            const change = await req.context.models.Chat.findByIdAndUpdate(
              req.params.chatId,
              { bio: req.body.bio },
            );
            res.json({ result: "Bio updated" });
          } else if (
            !chat.groupName &&
            (req.body.change === "leave" || req.body.change === "add")
          ) {
            res.json({
              result: "Cannot add other users or leave a non-group chat",
            });
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
  const chat = await req.context.models.Chat.findById(req.params.chatId);
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
          if (acc && chat.users.includes(acc._id)) {
            if (chat.users.length > 1) {
              res.json({
                result:
                  "Cannot delete chat unless user is the last one remaining",
              });
            } else {
              const result = await req.context.models.Chat.findByIdAndDelete(
                req.params.chatId,
              );
              res.json({ result: "Chat deleted" });
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
