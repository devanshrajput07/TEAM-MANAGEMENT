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

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//import routes
const userRouter = require("./router/userRouter");

//routes
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

