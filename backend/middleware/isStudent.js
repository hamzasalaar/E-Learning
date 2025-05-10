const isStudent = (req, res, next) => {
  // Ensure req.user exists (set by isAuthenticated middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Students only.",
    });
  }

  next(); // User is a student
};

module.exports = { isStudent };
