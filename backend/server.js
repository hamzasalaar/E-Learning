const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");

// Route imports
const AuthRoute = require("./routes/authRoute");
const AdminRoute = require("./routes/adminRoute");
const TeacherRoute = require("./routes/teacherRoute");
const StudentRoute = require("./routes/studentRoute");
const PublicRoute = require("./routes/publicRoute");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// CORS Setup
const allowedOrigins = [
  "http://localhost:3001", // Web dev server
  "http://localhost:5173", // Vite
  "http://192.168.3.147:8081", // Expo Dev Tools
  "http://192.168.3.147:19006", // Expo Go app
  "http://localhost:8081",
  "https://frontend-bz16.onrender.com", // Production frontend URL
];

// CORS middleware with debug logging
app.use(
  cors({
    origin: function (origin, callback) {
      console.log(`CORS request from origin: ${origin}`);
      if (!origin || origin === "null") {
        // Mobile apps (like Expo Go) often have no origin – allow it
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error(` Blocked by CORS: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/public", PublicRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/teacher", TeacherRoute);
app.use("/api/student", StudentRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Connect to DB and start server
connectDB();
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
