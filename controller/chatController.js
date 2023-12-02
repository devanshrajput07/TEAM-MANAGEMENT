import Chat from '../model/chatModel.js';

// Handle new messages
export const newMessage = async (socket, message) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: message.chatId },
      {
        $push: {
          messages: {
            senderID: message.senderID,
            receiverID: message.receiverID,
            content: message.content,
            groupID: message.groupID,
          },
        },
      },
      { new: true }
    );

    socket.emit('newMessage', chat.messages[chat.messages.length - 1]);
    socket.broadcast.emit('newMessage', chat.messages[chat.messages.length - 1]);
  } catch (error) {
    console.error(error);
  }
};

// Handle user disconnection
export const userDisconnected = () => {
  console.log('User disconnected');
};