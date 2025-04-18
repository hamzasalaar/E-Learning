const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Find user
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication error" });
  }
};

module.exports = { isAuthenticated };