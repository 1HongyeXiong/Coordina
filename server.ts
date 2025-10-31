// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./configuration/db";

import userRoutes from "./routes/userRoute";
import eventRoutes from "./routes/eventRoute";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Root route
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Coordina API ",
    endpoints: {
      users: "/api/users",
      events: "/api/events",
    },
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err?.stack ?? err);
  res.status(500).json({ error: err?.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Coordina server running on http://localhost:${PORT}`)
);