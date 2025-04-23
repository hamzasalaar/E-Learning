const express = require("express");
const { isAuthenticated } = require("../middleware/userAuth");
const { isStudent } = require("../middleware/isStudent");
const {
  getEnrolledCourses,
  enrollInCourse,
  createReview,
  updateReview,
  deleteReview,
  unenrollFromCourse,
  updateProgress,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

const StudentRoute = express.Router();

// Apply authentication middleware to all routes
StudentRoute.use(isAuthenticated, isStudent);

StudentRoute.get("/profile", getStudentProfile);
StudentRoute.put("/profile", updateStudentProfile);

StudentRoute.post("/enroll/:courseId", enrollInCourse);
StudentRoute.get("/my-courses", getEnrolledCourses);
StudentRoute.post("/unenroll/:courseId", unenrollFromCourse);

StudentRoute.post("/:courseId/review", createReview);
StudentRoute.put("/:courseId/update-review", updateReview);
StudentRoute.delete("/:courseId/review", deleteReview);

StudentRoute.put("/progress/:courseId", updateProgress); // Update progress in a course

module.exports = StudentRoute;
