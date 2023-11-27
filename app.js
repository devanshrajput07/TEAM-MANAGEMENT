const express = require("express");
const app = express();
require("dotenv").config();
const { PORT } = process.env || 8000;
require("./config/dbConnect").dbConnect();
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))
const userRouter = require("./routes/userRoutes")
const plannerRouter = require("./routes/plannerRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

app.use("/user", userRouter);
app.use("/planner", plannerRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);