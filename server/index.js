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
    "https://imagix-frontend.onrender.com", 
    "https://admin-imagix.onrender.com" 
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API ROUTES
app.use("/api/v1", routes);

// MONGODB CONNECTION
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  }
};

connectDB();

// START SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
