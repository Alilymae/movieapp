import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./src/routes/index.js";

const app = express();

// MIDDLEWARES
app.use(cors({
  origin: [
    "https://cinema-booking.netlify.app",
    "https://cinema-admin.netlify.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// API ROUTES
app.use("/api/v1", routes);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();

export default app;
