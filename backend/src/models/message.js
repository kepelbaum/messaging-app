import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messenger",
    required: true,
  },
  img: {
    type: String,
  },

  // chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  date: { type: Date, required: true },
});

const Chatmessage = mongoose.model("Chatmessage", messageSchema);

export default Chatmessage;
