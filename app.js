const express = require("express");
const app = express();
require("dotenv").config();
const { PORT } = process.env || 8000;
require("./config/dbConnect").dbConnect();
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))
const path = require('path')
const userRouter = require("./routes/userRoutes")
const plannerRouter = require("./routes/plannerRoutes")

app.use("/user", userRouter)
app.use("/planner", plannerRouter);