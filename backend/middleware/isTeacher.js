const isTeacher = (req, res, next) => {
    // Check if the user is authenticated and has the 'teacher' role
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You must be a teacher to access this resource.",
      });
    }
    next(); // If the user is a teacher, allow the request to proceed
  };
  
  module.exports = { isTeacher };
  