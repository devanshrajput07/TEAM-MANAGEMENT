const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { PORT } = process.env;
require("./config/dbConnect").dbConnect();
const path = require("path");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const { ObjectId } = require('mongodb');
const axios = require("axios");

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Content-Type', 'Authorization'], // Expose the 'Authorization' header

  })
);


//middlewares
app.use(express.static(path.resolve("./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//import routes
const userRouter = require("./router/userRouter");
const listRouter = require("./router/listRouter");
const boardRouter = require("./router/boardRouter");
const cardRouter = require("./router/cardRouter");
const paymentRouter = require("./router/paymentRouter")
//routes
app.use("/api/user", userRouter);
app.use("/api/board", boardRouter);
app.use("/api/list", listRouter);
app.use("/api/card", cardRouter);
app.use("/api", paymentRouter);

app.post('/sendToML', async (req, res) => {
  try {
    const { domain } = req.body;

    // Call machine learning API
    const mlApiResponse = await axios.post('https://erp.anaskhan.site/api/recommendation/', { domain });

    // Process ML API response
    const processedData = mlApiResponse.data;

    // Send processed data back to frontend
    res.json({ result: processedData });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const User = require("./model/userModel");
const Chat = require("./model/chatsModel");
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("newMessage", async (messageText, incomingUserId) => {
    let userId = new ObjectId(incomingUserId);
    const user = await User.findById(userId);
    const senderId = new ObjectId("655e5a3d67a8ae739ca6792b");
    // const newMessage = await Chat.create({sender : req.user._id, reciever : userId, message : messageText, isIndividualChat : true});
    const newMessage = await Chat.create({ sender: senderId, reciever: userId, message: messageText, isIndividualChat: true });
    user.chat.push(newMessage._id);
    console.log(newMessage);
    socket.broadcast.to(userId).emit("newMessage", message);
  });

});



app.get("/", (req, res) => {
  return res.sendFile("./public/index.html");
});






server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});