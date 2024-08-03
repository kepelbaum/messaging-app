import { Router } from "express";
import { verifyToken } from "../modules/verifytoken.js";
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = Router();

router.get("/", async (req, res) => {
  const messages = await req.context.models.Message.find();
  return res.send(messages);
});

router.get("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId
  );
  return res.send(message);
});

router.post("/", async (req, res, next) => {
  const message = await req.context.models.Message.create({
    text: req.body.text,
    user: req.context.me.id,
  }).catch((error) => {
    error.statusCode = 400;
    next(error);
  });
  return res.send(message);
});

router.delete("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId
  );

  if (message) {
    await message.remove();
  }

  return res.send(message);
});

export default router;
