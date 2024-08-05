import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  users: [{ type: String, required: true }],
  groupName: { type: String },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Chatmessage" },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatmessage",
      default: [],
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
