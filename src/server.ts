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
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://squadcraft-client.vercel.app",
      "https://squadraft-client.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight requests handler
app.options("*", cors());
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
