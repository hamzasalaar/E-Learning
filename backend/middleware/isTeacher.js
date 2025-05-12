const isTeacher = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }

  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Teachers only.",
    });
  }

  next(); // Authorized as teacher
};

module.exports = { isTeacher };
