const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const connectDB = require("./utils/db");
const AuthRoute = require("./routes/authRoute");
const AdminRoute = require("./routes/adminRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Define the allowed origins
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:5173",
];

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // If no origin or origin is in the allowed origins list, allow the request
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },    credentials: true,
  })
);
app.use(cookieparser());

app.use("/api/auth", AuthRoute);
app.use("/api/admin", AdminRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
