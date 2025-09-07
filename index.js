// ==========================
// School Management System
// Backend Entry Point
// ==========================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db_connect.js";
import routers from "./routes/routes.js";
import bodyParser from "body-parser";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // parse JSON body
app.use(cors());         // allow cross-origin requests
app.use(helmet());       // basic security headers
app.use(morgan("dev"));  // request logging
app.use(bodyParser.json({ strict: false }));

app.use("/api/v1", routers);

// ==========================
// Routes (Basic)
// ==========================
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
    connectDB()
});
