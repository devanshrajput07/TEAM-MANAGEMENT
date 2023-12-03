const { Server } = require('socket.io');
const User = require('../model/userModel');
const Chat = require('../model/chatsModel');
const { ObjectId } = require('mongodb');
const Board = require('../model/boardModel');

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
console.log("socket initialized")
  io.on('connection', async (socket) => {
    console.log('a user connected');
    const { userId } = socket.handshake.query;
    console.log('a user connected with userId:', userId);

    socket.on('joinBoard', async (boardUserId) => {
      try {
        const tempUserId = new ObjectId(boardUserId);
        const user = await User.findById(tempUserId).populate("boards");
        if(!user) {
          console.log("user not found");
          return ;
        }
        user.boards.forEach(
          board => {
            socket.join(board._id.toString());
            console.log(`user ${userId} joined board ${board._id}`);
          }
        );
        console.log("join board form server");
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('chatMessage', async (msg, boardId) => {
      try {
        const board = await Board.findById(boardId);
        if (!board) {
          console.log("board not found");
          return;
        }
        io.to(boardId).emit('chat message', { senderId: userId, message: msg });
        const newChat = await Chat.create({
            senderId: userId,
            board: boardId,
            message: msg
            });
        console.log("newChat created is ", newChat);
        socket.broadcast.to(boardId).emit("chat message", msg);
      } catch (error) {
        console.error(error);
      }
    });
  });

  return io;
}

module.exports = { initializeSocket };
