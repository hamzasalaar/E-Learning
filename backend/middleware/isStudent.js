const isStudent = (req, res, next) => {
  // Check if the user is authenticated and has the 'student' role
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. You must be a student to access this resource.",
    });
  }
  next(); // If the user is a student, allow the request to proceed
}

module.exports = { isStudent };