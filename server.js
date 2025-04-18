const express = require("express");
const dotenv = require("dotenv");
const redis = require("./src/config/connections_redis");
const cors = require("cors");
const db = require("./src/models");
const createHttpError = require("http-errors");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const dormitoryRoutes = require("./src/routes/dormitoryRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const roomAllocationRoutes = require("./src/routes/roomAllocationRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    services: {
      database: { status: "UP" },
      redis: { status: redis.isConnected() ? "UP" : "DOWN" },
    },
  };

  res.status(200).json(health);
});

app.get("/", (req, res, next) => {
  res.status(200).json({
    message:
      "Welcome to the Dormitory Management System API. Made by quybuiquang",
  });
});

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/dormitories", dormitoryRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/room-allocations", roomAllocationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createHttpError.NotFound("This is routes not found ^ - ^"));
});
app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

// Khởi chạy server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }

  // Redis status
  console.log(
    `Redis status: ${redis.isConnected() ? "✅ Connected" : "❌ Not connected"}`
  );
  console.log(
    `⚠️ The application will function with limited capabilities if Redis is not available.`
  );
});
