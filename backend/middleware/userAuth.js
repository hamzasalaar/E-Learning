const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    // get token from cookies
    let token = req.cookies?.token;

    // Check if token is in the authorization headers
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]; // Get token after "Bearer"
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

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
