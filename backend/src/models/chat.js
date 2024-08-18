import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  // users: [{ type: String, required: true }],
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Messenger", required: true },
  ],
  groupName: { type: String },
  // lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Chatmessage" },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chatmessage",
      default: [],
    },
  ],
  background: { type: String },
  avatar: { type: String },
  bio: { type: String, required: true, default: "No description provided" },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
