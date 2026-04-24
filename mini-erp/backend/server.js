const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Create the Express app
const app = express();

// Middleware — teach Express to understand JSON
app.use(express.json());

// Middleware — allow frontend to talk to backend
app.use(cors());

// Test route — just to confirm server is working
app.get('/', (req, res) => {
  res.json({ message: ' Mini ERP API is running!' });
});

// Start listening for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});