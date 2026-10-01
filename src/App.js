import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// import { clerkMiddleware } from "@clerk/express";

import { router } from "./Router/Router.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "https://samyogeesahityasansada.com",
      "https://www.samyogeesahityasansada.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// If you are using Clerk, enable this:
// app.use(clerkMiddleware());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Samyogee backend is running successfully 🚀",
  });
});

// User API
app.use("/api/v1/user", router);

// Protected route
app.get("/api/protected", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working",
  });
});

export default app;