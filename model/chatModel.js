import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  messageID: {
    type: String,
    required: true,
  },
  senderID: {
    type: String,
    required: true,
  },
  receiverID: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  groupID: {
    type: String,
  },
});

const chatSchema = new mongoose.Schema({
  participants: [userSchema],
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;