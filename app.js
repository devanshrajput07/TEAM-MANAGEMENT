import express from "express";
import paymentRoute from "./routes/route.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import axios from 'axios';
import http from 'http';
import { Server as socketIo } from 'socket.io';
dotenv.config();
import { newMessage, userDisconnected } from './controller/chatController.js';

dotenv.config();

export const app = express();

const server = http.createServer(app);
const io = new socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:7000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:7000",
  optionsSuccessStatus: 200
}));app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", paymentRoute);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new messages
  socket.on('newMessage', (message) => newMessage(socket, message));

  // Handle disconnection
  socket.on('disconnect', () => userDisconnected());
});

app.post('/api/createChat', async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();
    res.json(savedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getChat/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/sendToML', async (req, res) => {
  try {
    // Extract data from frontend request
    const { domain } = req.body;
    console.log('Received domain data:', domain);

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