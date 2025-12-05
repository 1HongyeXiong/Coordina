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

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Changed from true
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // Move maxAge inside cookie
    sameSite: 'strict' // Strong CSRF protection; consider CSRF tokens for state-changing operations
    // Note: sameSite: 'strict' provides strong CSRF mitigation, but may affect user experience with external links.
    // For full protection, also implement CSRF tokens for state-changing operations.
  }
}));

// Warn if running in development mode with insecure cookies
if (process.env.NODE_ENV !== 'production') {
  console.warn(
    "[WARNING] Session cookies are not secure (sent over HTTP). " +
    "Do not use this configuration in production!"
  );
}

// Middleware
app.use(cors());
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
    message: "Welcome to Coordina API ",
    endpoints: {
      users: "/api/users",
      events: "/api/events",
      eventtime: "/api/eventtimes"
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