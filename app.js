import express from "express";
import paymentRoute from "./routes/route.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import axios from 'axios';
dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", paymentRoute);

app.use(bodyParser.json());

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