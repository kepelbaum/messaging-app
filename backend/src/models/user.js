import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
  friends: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Messenger', default: [],
  }],
  chats: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: [],
  }]
});

const User = mongoose.model("Messenger", userSchema);

export default Messenger;
