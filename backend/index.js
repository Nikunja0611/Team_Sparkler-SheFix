// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- 1. Import cors
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// 2. Middleware to allow frontend to talk to backend
app.use(cors({
  origin: 'http://localhost:5173', // Allow your Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these request types
  credentials: true // Allow cookies/headers if needed
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));