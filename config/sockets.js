const { Server } = require('socket.io');
const User = require('../model/userModel');
const Chat = require('../model/chatsModel');

async function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    connectionStateRecovery: {},
  });

  io.on('connection', async (socket) => {
    console.log('a user connected');
    const { userId } = socket.handshake.query;
    console.log('a user connected with userId:', userId);

    socket.on('joinBoard', async (boardUserId) => {
      try {
        const user = await User.findById(boardUserId).populate("boards");
        user.boards.forEach(board => socket.join(board._id.toString()));
        console.log("join board form server");
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('chatMessage', async (msg, boardId) => {
      try {
        console.log(`msg is ${msg}`);
        console.log(`socket id is ${socket.id}`);
        console.log(`board id is ${boardId}`);
        io.to(boardId).emit('chat message', msg);
        const newChat = await Chat.create({
            senderId: userId,
            board: boardId,
            message: msg
            });
        console.log("newChat created is ", newChat);
      } catch (error) {
        console.error(error);
      }
    });
  });

  return io;
}

module.exports = { initializeSocket };
