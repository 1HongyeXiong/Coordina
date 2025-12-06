import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./configuration/db";
import session from "express-session";

import userRoutes from "./routes/userRoute";
import eventRoutes from "./routes/eventRoute";
import eventtimeRoute from "./routes/eventtimeRoute";
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();

// ★ Allow front-end hosted on Azure Static Web App
const FRONTEND_URL = "https://lemon-smoke-0c9095b1e.3.azurestaticapps.net";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// ★ Session (must come AFTER CORS)
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Required on Azure
    httpOnly: true,
    sameSite: "none",  // ★ Required for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("frontend"));

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/eventtimes", eventtimeRoute);
app.use("/auth", authRoutes);

app.get("/test", (req, res) => {
  res.status(200).send("It works!");
});

// Root route
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Coordina API",
    endpoints: {
      users: "/api/users",
      events: "/api/events",
      eventtime: "/api/eventtimes",
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
