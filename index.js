// ==========================
// School Management System
// Backend Entry Point
// ==========================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routers from "./routes/routes.js";
import { connectDB } from "./config/db_connect.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional if you expect form data
// Handle invalid JSON safely
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON format" });
    }
    next();
});
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", routers);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the School Management System API 🚀",
        status: "OK",
        timestamp: new Date(),
    });
});

// ==========================
// Start Server
// ==========================
app.listen(PORT, async () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    connectDB();
});
