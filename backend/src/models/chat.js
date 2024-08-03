import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Messenger", required: true },
  ],
  ifGroup: { type: Boolean, required: true },
  lastMessage: { type: Date, default: null },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
