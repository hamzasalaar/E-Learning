const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log("Token: ", token)
    if (!token)
      return res.status(401).json({ success: false, message: "Access Denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });
    if (user.role !== "admin")
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });

    req.user = user;
    next();
  } catch (error) {}
};

module.exports = { isAdmin };
