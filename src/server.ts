import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import playerRoutes from "./routes/playerRoutes";
import lineupRoutes from "./routes/lineupRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import noticeRoutes from "./routes/noticeRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://squadcraft-client.vercel.app',
    'https://squadraft-client.vercel.app'
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});
app.use(express.json());

// Public Auth Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/players", playerRoutes);
app.use("/api/lineup", lineupRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notices", noticeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("SquadCraft Backend Server is Running Successfully!");
});

// Start listening
app.listen(PORT, () => {
  console.log(`SquadCraft Express Server is running on port ${PORT}`);
});
