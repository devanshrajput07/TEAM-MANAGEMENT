const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { PORT } = process.env;
require("./config/dbConnect").dbConnect();

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(function (req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); 
  next();
});


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//import routes
const userRouter = require("./router/userRouter");
// const listRouter = require("./router/listRouter");
const boardRouter = require("./router/boardRouter");
// const cardRouter = require("./router/cardRouter");
//routes
app.use("/api/user", userRouter);
app.use("/api/board", boardRouter);
// app.use("/api/list", listRouter);
// app.use("/api/card", cardRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



