const express = require("express");
const app = express();
require("dotenv").config();
const {PORT} = process.env;
const userRouter = require("./routes/userRoutes")

app.use("/user", userRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running `);
})