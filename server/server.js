require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();
app.set("trust proxy", 1);
// =======================
// Database Connection
// =======================
connectDB();

// =======================
// Global Middleware
// =======================
app.use(
  cors({
    origin: [
      "http://localhost:5173","https://erms-techylla-theta.vercel.app/",
    ],
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/skills", skillRoutes);
// =======================
// Rate Limiter
// =======================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
});

app.use(limiter);

// =======================
// Health Check
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Resource Management API Running",
  });
});

// =======================
// API Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);

// =======================
// 404 Handler
// =======================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// =======================
// Global Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});