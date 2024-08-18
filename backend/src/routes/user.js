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

const router = Router();

router.get("/", async (req, res) => {
  const users = await req.context.models.Messenger.find().select(
    "-password -friends -chats",
  );
  return res.send(users);
});

router.get("/:user", async (req, res) => {
  const user = await req.context.models.Messenger.findOne({
    username: req.params.user,
  }).select("-password -friends -chats");
  return res.json({ result: user }); //revisit for hiding chats
});

router.post(
  "/",
  body("username").isLength({ min: 1 }).withMessage("Please enter a username."),
  body("displayName")
    .isLength({ min: 1 })
    .withMessage("Please enter a display name."),
  body("username").custom(async (value, { req }) => {
    const user = await req.context.models.Messenger.findOne({
      username: value.toLowerCase(),
    }).exec();
    if (user) {
      throw new Error(
        'Username "' + value.toLowerCase() + '" is already taken.',
      );
      return false;
    } else {
      return true;
    }
  }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password has to be at least 5 symbols long"),
  body("confirm").custom((value, { req }) => {
    if (value === req.body.password) return true;
    else throw new Error("Passwords do not match");
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      const user = {
        username: req.body.username.toLowerCase(),
        password: req.body.password,
        displayName: req.body.displayName,
      };
      const newuser = await req.context.models.Messenger.create(user).catch(
        (err) => {
          res.send(err);
        },
      );
      res.json({ result: "Account created." });
    }
  },
);

router.put(
  "/password",
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password has to be at least 5 symbols long"),
  body("confirm").custom((value, { req }) => {
    if (value === req.body.password) return true;
    else throw new Error("Passwords do not match");
  }),
  verifyToken,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
      jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
          res.send("You are not signed in.");
        } else {
          const fullVerify = async () => {
            const acc = await req.context.models.Messenger.findOne({
              username: authData.user.username,
              password: authData.user.password,
            });
            if (acc) {
              const user = await req.context.models.Messenger.findByIdAndUpdate(
                acc._id,
                {
                  password: req.body.password,
                  // friends: req.body.friends,
                  // displayName: req.body.displayName,
                  // avatar: req.body.avatar,
                },
              );
              return res.json({ message: "Settings updated" });
            } else {
              res.sendStatus(401);
            }
          };
          fullVerify();
        }
      });
    }
  },
);

router.put("/", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.send("You are not signed in.");
    } else {
      const fullVerify = async () => {
        const acc = await req.context.models.Messenger.findOne({
          username: authData.user.username,
          password: authData.user.password,
        });
        if (acc) {
          const user = await req.context.models.Messenger.findByIdAndUpdate(
            acc._id,
            {
              friends: req.body.friends,
              displayName: req.body.displayName,
              bio: req.body.bio,
            },
          );
          return res.json({ message: "Settings updated" });
        } else {
          res.sendStatus(401);
        }
      };
      fullVerify();
    }
  });
});

router.put(
  "/img",
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
            // const imagePath = req.file;
            // const publicId = await uploadImage(imagePath).secure_url;

            const uploadResult = await cloudinary.uploader
              .upload(req.file.path, {
                public_id: req.file.filename,
              })
              .catch((error) => {
                console.log(error);
              });
            if (req.body.change === "avatar") {
              const updatedUser =
                await req.context.models.Messenger.findByIdAndUpdate(acc._id, {
                  avatar: uploadResult.secure_url,
                });
            } else if (req.body.change === "background") {
              const updatedUser =
                await req.context.models.Messenger.findByIdAndUpdate(acc._id, {
                  background: uploadResult.secure_url,
                });
            } else {
              return res.json({ result: "Invalid change type" });
            }
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

export default router;
