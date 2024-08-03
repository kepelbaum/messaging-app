import mongoose from "mongoose";

import Messenger from "./user";
import Chatmessage from "./message";
import Chat from "./chat";

const connectDb = () => {
  return mongoose.connect(process.env.MONGODB_URI);
};

const models = { Messenger, Chatmessage, Chat };

export { connectDb };

export default models;
