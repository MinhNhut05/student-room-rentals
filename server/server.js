const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  "https://minhnhut05.github.io", // Production Frontend (old)
  "http://localhost:3000", // Local Development Frontend
  "https://xemtrovuive.online", // Custom Domain
  "https://www.xemtrovuive.online", // Custom Domain with www
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD", // QUAN TRỌNG: Cho phép cả phương thức POST
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI) // Bỏ các option không còn dùng nữa để tránh warning
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
